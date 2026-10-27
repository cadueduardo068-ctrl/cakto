# Social Pro Kit

Página de vendas em React, Vite, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Framer Motion e Lucide React. Inclui comparação arrastável, vitrine com profundidade, simulador de cores/título e galeria com swipe e download. Os seis SVGs locais são exemplos demonstrativos criados para esta página. Não inclui os 100 arquivos finais do produto.

## Executar

```sh
npm install
npm run dev
npm run build
npm run preview
node scripts/verify.mjs
```

No PowerShell com scripts bloqueados, use `npm.cmd` no lugar de `npm`.

## Configuração da oferta

Edite `src/config/product.ts`: preço, conteúdo, imagens reais e `checkoutUrl`. O checkout informado pelo vendedor está configurado: `https://pay.cakto.com.br/sadw6bg_1247295`. Todos os CTAs de compra utilizam essa configuração. O CTA fixo mobile aparece quando o checkout está disponível e a oferta principal está fora da tela. Os avisos de demonstração foram retirados da página; os mockups continuam identificados como composições de apresentação.

Antes de abrir vendas, informe suporte, responsável, documento, ferramenta de edição, licença, entrega e textos jurídicos definitivos. Só marque bônus como disponíveis depois de produzi-los. Os textos de FAQ indicam os detalhes ainda pendentes.

As avaliações autênticas são configuradas em `reviews` com nome, avatar opcional, estrelas, texto, data ISO (AAAA-MM-DD) e confirmação de compra. Sem avaliações, a página mostra a galeria visual. Não marque compra verificada sem comprovação. Preencha os três campos de `guarantee` para exibir uma política específica; sem esses dados a seção fica oculta. Bônus não disponíveis não aparecem na oferta. Perguntas sobre condições não configuradas ficam ocultas. Configure `mobileEditing` com a compatibilidade real.

As animações respeitam a preferência de movimento reduzido. O slider aceita arraste e teclado. Os diálogos jurídicos utilizam o elemento nativo `dialog`, com foco contido e fechamento por Escape. Os arquivos SVG podem ser atualizados em `public/templates`; o gerador fica em `scripts/create-demo-assets.mjs`.

## Meta Pixel e UTM

O Pixel `1592812189258908` está configurado. O SDK e os eventos PageView/ViewContent dependem de consentimento para publicidade; InitiateCheckout depende também do clique para um checkout configurado. Não há evento Purchase. O visitante pode revogar a autorização no rodapé. A instalação antiga diretamente no HTML foi retirada para impedir rastreamento antecipado e duplicação. Veja `META-PIXEL.md` para os testes com Pixel Helper e Gerenciador de Eventos.

Ative `forwardUtmParameters` somente depois de validar a compatibilidade com o checkout real. São preservados os cinco parâmetros UTM padrão, sem sobrescrever valores já existentes no link de destino.

## Cloudflare Pages

- Framework: Vite
- Comando: `npm run build`
- Diretório de saída: `dist`
- Node.js: 22 ou superior compatível com Vite 7
- Diretório raiz: esta pasta

Não há backend, armazenamento de cartões nem chave secreta. O pagamento e a entrega precisam ser configurados na Cakto. A publicação de prévia pelo Sites é privada e independente da hospedagem final no Cloudflare Pages.
