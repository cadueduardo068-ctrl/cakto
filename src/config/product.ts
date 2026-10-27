export const product = {
  productName: 'Social Pro Kit',
  reviews: [] as { name: string; avatar?: string; rating: number; text: string; date: string; verifiedPurchase: boolean }[],
  guarantee: { period: '', conditions: '', requestInstructions: '' },
  mobileEditing: '',
  productDescription: '100 templates editáveis para deixar seu Instagram mais profissional.',
  productPrice: 29.90,
  // Substitua por imagens reais do produto. Sem imagens, são exibidos mockups demonstrativos em CSS.
  productImages: [] as string[],
  includedItems: ['100 templates editáveis para Instagram', 'Modelos para promoções', 'Modelos para divulgação de serviços', 'Modelos para apresentação de produtos'],
  bonuses: [
    { name: 'Guia de personalização', available: false },
    { name: 'Calendário de ideias para posts', available: false },
    { name: 'Checklist de identidade visual', available: false },
  ],
  checkoutUrl: 'https://pay.cakto.com.br/sadw6bg_1247295',
  supportContact: '', // E-mail real do suporte.
  sellerName: '',
  sellerDocument: '',
  editingTool: '',
  commercialLicense: '',
  deliveryDetails: '',
  privacyPolicy: '', // Texto aprovado da política.
  termsOfUse: '', // Texto aprovado dos termos.
  // Ative somente após revisar a compatibilidade dos parâmetros com seu checkout.
  forwardUtmParameters: false,
  metaPixelId: '',
};
export const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.productPrice);
export function getCheckoutUrl() {
  if (!product.checkoutUrl) return null;
  try {
    const url = new URL(product.checkoutUrl);
    if (url.protocol !== 'https:') return null;
    if (product.forwardUtmParameters) {
      const current = new URLSearchParams(window.location.search);
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(key => {
        const value = current.get(key);
        if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
      });
    }
    return url.href;
  } catch { return null; }
}
