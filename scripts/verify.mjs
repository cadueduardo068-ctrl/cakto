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
const window={};const scripts=[];
const analytics=load('src/lib/analytics.ts',{require:()=>config,window,document:{createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}}});
analytics.trackCheckout();assert.equal(window.fbq,undefined,'Sem consentimento, sem eventos');
config.product.metaPixelId='123456789';analytics.enableAnalytics();analytics.enableAnalytics();
assert.equal(scripts.length,1,'Script não duplicado');
assert.equal(window.fbq.queue.filter(x=>x[1]==='PageView').length,1);
assert.equal(window.fbq.queue.filter(x=>x[1]==='ViewContent').length,1);
analytics.trackCheckout();assert.equal(window.fbq.queue.filter(x=>x[1]==='InitiateCheckout').length,1);
analytics.revokeAnalytics();analytics.trackCheckout();assert.equal(window.fbq.queue.filter(x=>x[1]==='InitiateCheckout').length,1);
analytics.enableAnalytics();assert.equal(scripts.length,1);assert.equal(window.fbq.queue.filter(x=>x[1]==='PageView').length,1);
assert.equal(window.fbq.queue.some(x=>x[1]==='Purchase'),false);
for(const name of ['coffee','fashion','sale','service','barber','studio']){
  const path=`public/templates/${name}.svg`;assert.ok(existsSync(path));const svg=readFileSync(path,'utf8');assert.ok(svg.includes('<svg'));assert.ok(svg.includes('COMPOSIÇÃO DE APRESENTAÇÃO'));assert.ok(!svg.includes('http://')||svg.includes('http://www.w3.org/2000/svg'));assert.ok(!svg.includes('<image'));
}
assert.equal(config.product.reviews.length,0,'Nenhuma avaliação inventada');
assert.ok(config.product.bonuses.every(x=>!x.available),'Bônus não produzidos desativados');
console.log('OK: checkout Cakto configurado, HTTPS, UTM, consentimento, eventos sem duplicação, revogação e 6 SVGs locais.');
