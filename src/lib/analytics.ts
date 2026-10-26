import { product } from '../config/product';
type Pixel = ((...args: unknown[]) => void) & { queue: unknown[][]; callMethod?: (...args: unknown[]) => void; push: Pixel; loaded: boolean; version: string };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }
let active = false;
let initialized = false;
export function enableAnalytics() {
  if (active || !/^\d+$/.test(product.metaPixelId)) return;
  active = true;
  if (initialized) { window.fbq?.('consent', 'grant'); return; }
  initialized = true;
  const pixel = function(...args: unknown[]) { if (pixel.callMethod) pixel.callMethod(...args); else pixel.queue.push(args); } as Pixel;
  pixel.queue = []; pixel.push = pixel; pixel.loaded = true; pixel.version = '2.0';
  window.fbq = window._fbq = pixel;
  pixel('consent', 'grant'); pixel('init', product.metaPixelId);
  const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(script);
  pixel('track', 'PageView');
  pixel('track', 'ViewContent', { content_name: product.productName, value: product.productPrice, currency: 'BRL' });
}
export function trackCheckout() {
  if (active) window.fbq?.('track', 'InitiateCheckout', { content_name: product.productName, value: product.productPrice, currency: 'BRL' });
}
export function revokeAnalytics() { if (active) window.fbq?.('consent', 'revoke'); active = false; }
