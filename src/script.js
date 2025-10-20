// Inicializa o mapa centrado em uma coordenada (exemplo: São Paulo)
const map = L.map('map').setView([-1.437, -48.483], 13);

// Camada do Jawg Sunny ☀️
// Substitua "YOUR_JAWG_ACCESS_TOKEN" pelo seu token gratuito obtido em https://www.jawg.io
L.tileLayer('https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=Ge6ySoxyaqbVISUQlFFayc5pwYJ0baMMGhX90RqJlZYzBrTYANQDqCsb2EXudxxH', {
  attribution: '&copy; <a href="https://www.jawg.io" target="_blank">Jawg Maps</a> contributors'
}).addTo(map);

// Adiciona cada marcador com popup
lugares.forEach(lugar => {
  const marker = L.marker(lugar.coords, {
    icon: L.icon({
      iconUrl: '../public/img/Marcador.png',
      iconSize: [60, 60],
      iconAnchor: [30, 60],
      popupAnchor: [0, -55]
    })
  }).addTo(map);

  let fotoAtual = 0;

function criarPopupHTML() {
  const foto = lugar.fotos[fotoAtual];
  const idBase = lugar.nome.replace(/\s+/g, '-');

  // cria os pontinhos de navegação
  const dots = lugar.fotos.map((_, i) => `
    <span class="dot ${i === fotoAtual ? 'active' : ''}" data-index="${i}"></span>
  `).join('');

  return `
    <div id="popup-${idBase}" class="popup-card">
      <div class="card-inner" id="card-${idBase}">
        <div class="card-front">
          <img src="${foto.imagem}" alt="">
        </div>
        <div class="card-back">
          <p>${foto.texto}</p>
        </div>
      </div>
      <div class="dots-container">${dots}</div>
    </div>
  `;
}


  marker.bindPopup(criarPopupHTML(), { maxWidth: 400 });

  marker.on('popupopen', () => {
  fotoAtual = 0;
  atualizarPopup();

  function atualizarPopup() {
    marker.setPopupContent(criarPopupHTML());
    marker.openPopup();

    setTimeout(() => {
      const cardId = `card-${lugar.nome.replace(/\s+/g, '-')}`;
      const card = document.getElementById(cardId);
      const dots = document.querySelectorAll(`#popup-${lugar.nome.replace(/\s+/g, '-')} .dot`);
dots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const index = parseInt(dot.getAttribute('data-index'));
    fotoAtual = index;
    atualizarPopup();
  });
});


      if (card) {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
      }
    }, 50);
  }
});
});

