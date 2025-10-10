Amorcita — Mapa Interativo de Memórias

Um site estático e romântico em formato de mapa interativo (Leaflet.js + Jawg Maps) para marcar lugares, fotos e lembranças. Totalmente front‑end, sem back‑end ou banco.

Visão geral
- Mapa em tela cheia usando Leaflet.js
- Tiles do Jawg Maps (estilo "jawg-streets") — funciona com seu token Jawg; há fallback para Carto Positron
- Marcadores personalizados com sua imagem (`public/img/Marcador.png`)
- Popups com foto única ou carrossel (Swiper) com várias fotos + legendas
- Botão flutuante 💙 com lista de lugares e contador
- Trilha sonora simples com múltiplas faixas (MP3)
- Visual leve, tipografia elegante e animações sutis (GSAP)

Requisitos
- Navegador moderno
- Internet para carregar tiles do mapa e CDNs (Leaflet/Swiper/GSAP)

Estrutura de pastas
/public
  ├── img/
  │   ├── Marcador.png            # ícone do marcador (sua arte)
  │   ├── urca.jpg, urca-2.jpg    # suas fotos
  │   └── ...
  └── audio/
      ├── track1.mp3
      ├── track2.mp3
      └── ...
/src
  ├── index.html
  ├── style.css
  ├── script.js
  └── lugares.js
README.md

Como abrir
- Abra `src/index.html` no navegador (duplo clique). Alternativa: servir com um servidor estático (Vercel/GitHub Pages).

Configuração do mapa (Jawg)
- Em `src/script.js`, informe seu token do Jawg na constante `JAWG_TOKEN`.
  const JAWG_TOKEN = "SEU_TOKEN_AQUI";
- Com token válido, o estilo "jawg-streets" será usado. Sem token, cai para Carto Positron automaticamente.

Como adicionar lugares, fotos e textos
Edite `src/lugares.js`. Dois formatos por lugar:

1) UMA foto (sem carrossel)
  {
    nome: "Parque Lage",
    coordenadas: [-22.964, -43.21], // [lat, lng]
    foto: "../public/img/parque-lage.jpg",
    mensagem: "O dia em que eu me apaixonei por você de vez 💙"
  }

2) VÁRIAS fotos (ativa carrossel automaticamente)
  {
    nome: "Praia do Forte",
    coordenadas: [-12.542, -38.472],
    fotos: [
      { url: "../public/img/praia1.jpg", texto: "Nosso primeiro dia aqui 💙" },
      { url: "../public/img/praia2.jpg", texto: "Voltamos um ano depois, ainda mais felizes!" }
    ]
  }

- Dica: use sempre `[lat, lng]` (latitude, longitude) para `coordenadas`.
- Os popups se ajustam ao conteúdo e, com várias fotos, exibem setas/pontinhos para navegar.

Marcar lugares de encontro (cor/destaque)
- Adicione `encontro: true` no item para aplicar variação visual do pino.
  {
    nome: "Praia da Urca",
    coordenadas: [-22.948, -43.156],
    fotos: [ { url: "../public/img/urca.jpg", texto: "Nosso primeiro pôr do sol juntos 🌅" } ],
    encontro: true
  }

Como adicionar músicas
- Coloque seus `.mp3` em `public/audio/` e edite a playlist em `src/script.js`:
  const PLAYLIST = [
    { titulo: "Faixa 1", arquivo: "../public/audio/track1.mp3" },
    { titulo: "Faixa 2", arquivo: "../public/audio/track2.mp3" },
  ];
- O player oferece play/pause, anterior/próxima, volume e mudo.

Como trocar o ícone/cor do marcador
- O projeto usa `public/img/Marcador.png` (original 500×500) escalada para 56×56 no mapa.
- Para mudar o arquivo, substitua `public/img/Marcador.png` por outra imagem (PNG com fundo transparente recomendado).
- Para mudar o tamanho/âncoras, ajuste em `src/script.js` dentro de `createMarker`:
  const icon = L.icon({
    iconUrl: '../public/img/Marcador.png',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -48],
  });
- Para uma variação “encontro”, a classe CSS `.amor-pin--encontro` pode receber filtros/ajustes em `src/style.css`.
 - A cor do marcador vem diretamente do PNG `public/img/Marcador.png`. Para mudar a cor, basta substituir este arquivo por outro com a cor desejada (recomendado PNG com fundo transparente). Não aplicamos filtros CSS de cor por padrão.

Cores do botão 💙 (mesmo gradiente do marcador)
- O botão flutuante usa gradiente azul em `src/style.css` na regra `#toggle-places`.
- Para mudar as cores, ajuste a linha:
  background: linear-gradient(135deg, #8ab6ff, #3f6fb8);
- Dica: mantenha contraste suficiente com o texto (branco) e preserve a legibilidade do badge.

Aparência do mapa (ruas mais visíveis)
- Em `src/style.css`, há um overlay leve (`.map-overlay.roads-contrast`) com `mix-blend-mode: multiply` para dar contraste às vias.
- Ajuste intensidade alterando as opacidades dos gradientes nessa classe.
- A saturação dos tiles é ajustável na regra `.leaflet-tile { filter: ... }`.

Dúvidas comuns
- Não vejo todos os pinos: verifique `coordenadas: [lat, lng]` válidas.
- Imagens não aparecem: confira os caminhos (começam com `../public/img/...`).
- Outro tema do Jawg: troque a URL do tile layer em `initMap()` para `jawg-light`, `jawg-dark`, etc.

Deploy
- Vercel: arraste o projeto ou conecte o repositório. A página é `src/index.html`.
- GitHub Pages: publique a branch; paths relativos já apontam para `public/`.

Créditos
- Leaflet (https://leafletjs.com)
- Jawg Maps (https://www.jawg.io)
- Swiper (https://swiperjs.com)
- GSAP (https://greensock.com/gsap)


