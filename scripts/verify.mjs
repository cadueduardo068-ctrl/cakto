import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';
import ts from 'typescript';
function load(path,extra={}) {
  const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const ctx=createContext({exports:{},URL,URLSearchParams,Intl,...extra});runInContext(code,ctx);return ctx.exports;
}
const config=load('src/config/product.ts',{window:{location:{search:'?utm_source=instagram&utm_campaign=lancamento&utm_medium=paid&email=private'}}});
assert.equal(config.getCheckoutUrl(),'https://pay.cakto.com.br/sadw6bg_1247295','Link real fornecido pelo vendedor');
config.product.checkoutUrl='';assert.equal(config.getCheckoutUrl(),null,'Checkout desativado sem URL');
config.product.checkoutUrl='javascript:alert(1)';assert.equal(config.getCheckoutUrl(),null);
config.product.checkoutUrl='http://example.com';assert.equal(config.getCheckoutUrl(),null);
config.product.checkoutUrl='https://example.com/checkout?utm_source=original';
config.product.forwardUtmParameters=true;
const url=new URL(config.getCheckoutUrl());
assert.equal(url.searchParams.get('utm_source'),'original');
assert.equal(url.searchParams.get('utm_campaign'),'lancamento');
assert.equal(url.searchParams.get('email'),null);
const window={};const scripts=[];const storage=new Map();
const environment={require:()=>config,window,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:id=>scripts.find(s=>s.id===id),querySelector:()=>null,createElement:()=>({remove(){const i=scripts.indexOf(this);if(i>=0)scripts.splice(i,1);}}),head:{appendChild:s=>scripts.push(s)}}};
const analytics=load('src/lib/analytics.ts',environment);
analytics.trackCheckout();assert.equal(window.fbq,undefined,'Sem consentimento, sem eventos');
assert.equal(analytics.readConsent(),null);
analytics.saveConsent('rejected');assert.equal(scripts.length,0);assert.equal(window.fbq,undefined);
assert.equal(config.product.metaPixelId,'1592812189258908');
analytics.saveConsent('accepted');analytics.enableAnalytics();
assert.equal(scripts.length,1,'Script não duplicado');
assert.equal(window.fbq.queue.filter(x=>x[0]==='init').length,1);
const sent=[...window.fbq.queue];window.fbq.queue=[];window.fbq.callMethod=(...args)=>sent.push(args);
const count=event=>sent.filter(x=>x[0]==='trackSingle'&&x[2]===event).length;
assert.equal(count('PageView'),1);assert.equal(count('ViewContent'),1);assert.equal(count('InitiateCheckout'),0);
// Re-import emulates hot reload / remount and must not reinitialize or retrack.
load('src/lib/analytics.ts',environment).enableAnalytics();
assert.equal(sent.filter(x=>x[0]==='init').length,1);assert.equal(count('PageView'),1);
analytics.trackCheckout();assert.equal(count('InitiateCheckout'),1);
analytics.saveConsent('rejected');analytics.trackCheckout();assert.equal(count('InitiateCheckout'),1);
analytics.saveConsent('accepted');assert.equal(scripts.length,1);assert.equal(count('PageView'),1);
assert.equal(count('Purchase'),0);
// Consent revoked while loading must discard events that have not left the queue.
delete window.__socialProMeta;delete window.fbq;delete window._fbq;scripts.length=0;
analytics.enableAnalytics();analytics.revokeAnalytics();assert.equal(window.fbq.queue.some(x=>x[0]==='trackSingle'),false);
analytics.enableAnalytics();assert.equal(window.fbq.queue.filter(x=>x[2]==='PageView').length,1);
assert.equal(window.fbq.queue.filter(x=>x[0]==='init').length,1);
assert.equal(readFileSync('index.html','utf8').includes('facebook.com/tr'),false,'Sem pixel noscript antes do consentimento');
for(const name of ['coffee','fashion','sale','service','barber','studio']){
  const path=`public/templates/${name}.svg`;assert.ok(existsSync(path));const svg=readFileSync(path,'utf8');assert.ok(svg.includes('<svg'));assert.ok(svg.includes('COMPOSIÇÃO DE APRESENTAÇÃO'));assert.ok(!svg.includes('http://')||svg.includes('http://www.w3.org/2000/svg'));assert.ok(!svg.includes('<image'));
}
assert.equal(config.product.reviews.length,0,'Nenhuma avaliação inventada');
assert.ok(config.product.bonuses.every(x=>!x.available),'Bônus não produzidos desativados');
console.log('OK: checkout Cakto configurado, HTTPS, UTM, consentimento, eventos sem duplicação, revogação e 6 SVGs locais.');
