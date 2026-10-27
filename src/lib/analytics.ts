import { product } from '../config/product';
type Pixel = ((...args: unknown[]) => void) & { queue: unknown[][]; callMethod?: (...args: unknown[]) => void; push: Pixel; loaded: boolean; version: string };
type PixelState = { active: boolean; initialized: boolean; pageTracked: boolean };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel; __socialProMeta?: PixelState } }
export const CONSENT_KEY = 'social-pro-marketing-consent-v1';
export type Consent = 'accepted' | 'rejected' | null;
const SCRIPT_ID = 'social-pro-meta-pixel';
export function readConsent(): Consent {
  try { const value=localStorage.getItem(CONSENT_KEY); return value==='accepted'||value==='rejected'?value:null; } catch { return null; }
}
// Window state survives StrictMode and module reloads without duplicate init/events.
function state() { return window.__socialProMeta ??= {active:false,initialized:false,pageTracked:false}; }
function loadPixel() {
  // Official fbq bootstrap/queue, reusing an existing SDK when present.
  if (!window.fbq) {
    const pixel=function(...args:unknown[]) { if(pixel.callMethod)pixel.callMethod(...args);else pixel.queue.push(args); } as Pixel;
    pixel.queue=[];pixel.push=pixel;pixel.loaded=true;pixel.version='2.0';
    window.fbq=pixel;if(!window._fbq)window._fbq=pixel;
  }
  if(!document.getElementById(SCRIPT_ID)&&!document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')) {
    const script=document.createElement('script');script.id=SCRIPT_ID;script.async=true;script.src='https://connect.facebook.net/en_US/fbevents.js';
    script.onerror=()=>script.remove();document.head.appendChild(script);
  }
  return window.fbq;
}
export function enableAnalytics() {
  if(!/^\d+$/.test(product.metaPixelId))return;
  const current=state();const pixel=loadPixel();
  if(!current.active)pixel('consent','grant');current.active=true;
  if(!current.initialized) {
    pixel('set','autoConfig',false,product.metaPixelId);
    pixel('init',product.metaPixelId);current.initialized=true;
  }
  if(!current.pageTracked) {
    // Single-page site: anchors do not count as another page view.
    pixel('trackSingle',product.metaPixelId,'PageView');
    pixel('trackSingle',product.metaPixelId,'ViewContent',{content_name:product.productName,content_type:'product',value:product.productPrice,currency:'BRL'});
    current.pageTracked=true;
  }
}
export function trackCheckout() {
  if(window.__socialProMeta?.active)window.fbq?.('trackSingle',product.metaPixelId,'InitiateCheckout',{content_name:product.productName,value:product.productPrice,currency:'BRL'});
}
export function revokeAnalytics() {
  const current=window.__socialProMeta;if(!current)return;current.active=false;
  const pixel=window.fbq;
  // Discard unsent events if consent is withdrawn while the SDK downloads.
  if(pixel&&!pixel.callMethod&&pixel.queue) {
    const pending=pixel.queue.some(args=>args[0]==='trackSingle'&&args[1]===product.metaPixelId&&args[2]==='PageView');
    pixel.queue=pixel.queue.filter(args=>!(args[0]==='trackSingle'&&args[1]===product.metaPixelId));
    if(pending)current.pageTracked=false;
  }
  pixel?.('consent','revoke');
}
export function saveConsent(value:Exclude<Consent,null>) {
  try{localStorage.setItem(CONSENT_KEY,value);}catch{/* Keep the choice for this page even when storage is unavailable. */}
  if(value==='accepted')enableAnalytics();else revokeAnalytics();
}
