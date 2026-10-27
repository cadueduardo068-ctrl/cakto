# Meta Pixel — instalação e validação

Pixel: `1592812189258908`. Stack: React 19 + Vite 7 + TypeScript. Não há roteador; os links internos são âncoras na mesma página.

## Comportamento

- Nenhum script da Meta ou pixel de imagem `noscript` é carregado antes de uma escolha afirmativa.
- Recusar permite continuar usando a página e comprar normalmente, sem enviar os eventos desta integração.
- Ao aceitar: o SDK oficial `https://connect.facebook.net/en_US/fbevents.js` é carregado uma vez. O ID é inicializado uma vez, com proteção contra StrictMode e remontagem. A detecção automática de eventos (`autoConfig`) fica desativada.
- `PageView` e `ViewContent`: uma vez por carregamento do documento após consentimento. Navegar pelas âncoras ou reabrir preferências não os repete. Recarregar o documento representa uma nova visualização.
- `InitiateCheckout`: somente ao clicar em um CTA de compra que abre o checkout configurado, e somente com consentimento ativo. Não é disparado no carregamento.
- Os eventos usam `trackSingle`, destinados exclusivamente ao ID configurado. O payload contém apenas dados do produto (nome, valor, moeda e tipo de conteúdo). Não há advanced matching manual, formulário de dados pessoais ou evento `Purchase`.
- Revogar a autorização interrompe eventos futuros; se o SDK ainda estiver baixando, os eventos desta integração que ainda estiverem na fila são descartados. A escolha é sincronizada entre abas do mesmo domínio. Dados já enviados não podem ser desfeitos pela página.
- A chave `social-pro-marketing-consent-v1` guarda a escolha neste navegador. A chave antiga da página não é reaproveitada: visitantes anteriores recebem a nova escolha específica de publicidade. Sem acesso ao armazenamento, a escolha vale para a página atual.

O SDK da Meta também recebe dados técnicos próprios do navegador e a URL da página; não coloque dados sensíveis em URLs. Não é inserido um rastreador `noscript`, pois ele ignoraria o controle de consentimento em JavaScript. Não instale uma segunda cópia por HTML, GTM ou outra ferramenta.

## Testar no site publicado

1. Publique o build atualizado. Em uma janela de teste sem bloqueador de anúncios, abra `https://instagramdeimpacto.cadueduardo068.workers.dev/`. Para um teste limpo, remova a chave de consentimento no armazenamento do site ou use um perfil novo.
2. No DevTools > Network, filtre por `fbevents` e `facebook.com/tr`. Antes de aceitar e depois de recusar, não deve haver requisições da Meta iniciadas pela página. O botão de compra deve continuar abrindo exatamente `https://pay.cakto.com.br/sadw6bg_1247295`.
3. Abra **Preferências de privacidade** no rodapé e aceite publicidade. Deve aparecer um único `fbevents.js`; os eventos iniciais são `PageView` e `ViewContent`, com o ID correto. Reabrir preferências e aceitar novamente não deve duplicar os eventos.
4. Clique em um botão de compra. Deve aparecer `InitiateCheckout`, sem `Purchase`. No DevTools, ative **Preserve log** antes de sair para o checkout. Eventos que o próprio checkout enviar pertencem à configuração da Cakto, não a esta página.
5. Volte ao site e recuse publicidade nas preferências. Novos cliques não devem emitir eventos desta integração. Teste também a escolha em outra aba e a navegação pelas âncoras.
6. Com o **Meta Pixel Helper**, confirme o ID e confira os eventos após aceitar. Sem consentimento, a ausência do Pixel é o comportamento esperado. Bloqueadores, Brave Shields e proteções do navegador podem impedir o carregamento mesmo após aceitar.
7. No **Gerenciador de Eventos** da Meta, selecione a fonte de dados com ID `1592812189258908` e abra **Testar eventos**. Abra o site pelo fluxo de teste e repita o aceite e o clique. Confirme os nomes e os parâmetros recebidos. Não configure `Purchase` com base em clique ou visita: ele depende da confirmação real do pagamento na plataforma.
8. Verifique o Console e a aba Network. O build e os testes automatizados não substituem essa confirmação de recebimento no painel da Meta. Não é necessário realizar uma compra para testar os três eventos.

## Cloudflare

O build é estático, sem funções ou segredos. Para Cloudflare Pages: `npm run build`, saída `dist`. Para Workers Static Assets: use o mesmo conteúdo de `dist` conforme a configuração existente. O domínio fornecido é `workers.dev`; não se trata de uma URL `pages.dev`. Não é necessário alterar domínio, DNS, checkout ou configurações da Cakto.

Se a hospedagem tiver uma Content-Security-Policy personalizada, ela precisa permitir o SDK e os endpoints da Meta usados pelo navegador. Este projeto não acrescenta nem relaxa uma CSP. Confira isso no console durante a validação.

O consentimento técnico foi implementado; a política completa do responsável pelo tratamento (identificação, contato, finalidades, compartilhamento, direitos e retenção) deve refletir a operação real. O código não constitui validação jurídica integral da operação.

## Verificações locais

```sh
node scripts/verify.mjs
npm run build
```
