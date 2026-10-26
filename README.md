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

Edite `src/config/product.ts`: preço, conteúdo, imagens reais e `checkoutUrl` (link HTTPS oficial gerado na Cakto). Todos os CTAs utilizam essa configuração. Sem link, a página apresenta a oferta sem executar ou simular compra. O CTA fixo mobile aparece apenas quando o checkout está disponível.

Antes de abrir vendas, informe suporte, responsável, documento, ferramenta de edição, licença, entrega e textos jurídicos definitivos. Só marque bônus como disponíveis depois de produzi-los. Os textos de FAQ indicam os detalhes ainda pendentes.

As avaliações autênticas são configuradas em `reviews` com nome, avatar opcional, estrelas, texto, data ISO (AAAA-MM-DD) e confirmação de compra. Sem avaliações, a página mostra a galeria demonstrativa. Não marque compra verificada sem comprovação. Preencha os três campos de `guarantee` para exibir uma política específica; enquanto isso a página informa que as condições estão pendentes. Configure `mobileEditing` com a compatibilidade real.

As animações respeitam a preferência de movimento reduzido. O slider aceita arraste e teclado. Os diálogos jurídicos utilizam o elemento nativo `dialog`, com foco contido e fechamento por Escape. Os arquivos SVG podem ser atualizados em `public/templates`; o gerador fica em `scripts/create-demo-assets.mjs`.

## Meta Pixel e UTM

O Pixel está desativado por padrão. Configure `metaPixelId` depois de revisar a política aplicável. O carregamento do script e os eventos PageView/ViewContent dependem de consentimento; InitiateCheckout depende também do clique para um checkout configurado. Não há evento Purchase. O visitante pode revogar a autorização no rodapé.

Ative `forwardUtmParameters` somente depois de validar a compatibilidade com o checkout real. São preservados os cinco parâmetros UTM padrão, sem sobrescrever valores já existentes no link de destino.

## Cloudflare Pages

- Framework: Vite
- Comando: `npm run build`
- Diretório de saída: `dist`
- Node.js: 22 ou superior compatível com Vite 7
- Diretório raiz: esta pasta

Não há backend, armazenamento de cartões nem chave secreta. O pagamento e a entrega precisam ser configurados na Cakto. A publicação de prévia pelo Sites é privada e independente da hospedagem final no Cloudflare Pages.
