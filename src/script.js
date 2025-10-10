// Configuração principal (Leaflet n 0 requer token)
// Opcional: token do Jawg Maps (para usar tiles Jawg). Se vazio, usa fallback Positron.
const JAWG_TOKEN = "Nj7JBIKW1g15boZQMBpku2TcfB3JIefUVZy2TITZw0MczDxbQDoHaWAvkUN02wlC"

// Playlist (adicione seus arquivos MP3 em public/audio)
const PLAYLIST = [
  { titulo: "Faixa 1", arquivo: "../public/audio/track1.mp3" },
  { titulo: "Faixa 2", arquivo: "../public/audio/track2.mp3" },
];

// Elementos de UI
const mapContainerId = "map";
const panelEl = document.getElementById("places-panel");
const listEl = document.getElementById("places-list");
const counterEl = document.getElementById("places-counter");
const countBadgeEl = document.getElementById("places-count-badge");
const toggleBtn = document.getElementById("toggle-places");
const closePanelBtn = document.getElementById("close-panel");

// Audio UI
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev-track");
const nextBtn = document.getElementById("next-track");
const titleEl = document.getElementById("track-title");
const volumeEl = document.getElementById("volume");
const muteBtn = document.getElementById("mute");

let currentTrackIndex = 0;
let map;
let markerRefs = [];
let bounds;
// Toggle verbose debugging for popup/swiper behavior. Set to true to enable console logs.
const DEBUG_POPUP = true;

function getPrimaryImageAndText(place) {
  if (Array.isArray(place.fotos) && place.fotos.length) {
    const first = place.fotos[0];
    return { img: first.url, text: first.texto ?? "" };
  }
  return { img: place.foto, text: place.mensagem ?? "" };
}

function buildPopupHTML(place, idx) {
  // Pega a primeira foto
  let foto = place.fotos && place.fotos.length ? place.fotos[0] : { url: place.foto, texto: place.mensagem };
  return `
    <div class="popup-inner">
      <div class="popup-card">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <img class="slide-img" src="${foto.url}" alt="${place.nome}" />
            </div>
            <div class="flip-card-back">
              <h3>${place.nome}</h3>
              <p>${foto.texto ?? ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function computeMapCenterFromPlaces(places) {
  if (!places || places.length === 0) return [-43.1729, -22.9068]; // Rio como fallback [lng, lat]
  const lngs = [];
  const lats = [];
  for (const p of places) {
    // lugares guarda [lat, lng]; convertendo para [lng, lat]
    const lat = Number(p.coordenadas?.[0]);
    const lng = Number(p.coordenadas?.[1]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      lats.push(lat);
      lngs.push(lng);
    }
  }
  if (!lngs.length) return [-22.9068, -43.1729]; // [lat, lng]
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  return [avgLat, avgLng]; // Leaflet espera [lat, lng]
}

function createMarker(place, index) {
  const [lat, lng] = place.coordenadas; // [lat, lng]
  const baseIconUrl = '../public/img/Marcador.png';
  const icon = L.icon({
    iconUrl: baseIconUrl,
    iconSize: [56, 56],
    iconAnchor: [28, 56], // base centralizada
    popupAnchor: [0, -48],
    className: place.encontro ? 'amor-pin amor-pin--encontro' : 'amor-pin'
  });

  const html = buildPopupHTML(place, index);
  const marker = L.marker([lat, lng], { icon }).addTo(map);
  if (!bounds) bounds = L.latLngBounds([lat, lng], [lat, lng]);
  else bounds.extend([lat, lng]);
  marker.bindPopup(html, { closeButton: true, offset: [0, -10], autoPan: true });

  // anima o elemento do marcador
  marker.on("add", () => {
    const el = marker._icon;
    if (el) {
      if (window.gsap && gsap.from) {
        gsap.from(el, { scale: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.04 * index });
      } else {
        el.style.transform = 'scale(1)';
      }
    }
  });

  marker.on("popupopen", (e) => {
    const popupEl = e.popup.getElement();
    const inner = popupEl && popupEl.querySelector('.popup-inner');
    if (inner) {
      if (window.gsap && gsap.fromTo) {
        gsap.fromTo(inner, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
      } else {
        inner.style.opacity = '1';
        inner.style.transform = 'translateY(0)';
      }
    }
    // Flip-card animation
    if (popupEl) {
      const flipCards = popupEl.querySelectorAll('.flip-card-inner');
      flipCards.forEach(card => {
        card.addEventListener('click', () => {
          card.classList.toggle('is-flipped');
        });
      });
      // Ajuste dinâmico de tamanho proporcional da imagem e do card
      const img = popupEl.querySelector('.slide-img');
      const flipCard = popupEl.querySelector('.flip-card');
      const flipInner = popupEl.querySelector('.flip-card-inner');
      const flipFront = popupEl.querySelector('.flip-card-front');
      const flipBack = popupEl.querySelector('.flip-card-back');
      if (img && flipCard && flipInner && flipFront && flipBack) {
        img.onload = function() {
          const maxW = 350;
          const maxH = 260;
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w && h) {
            let ratio = w / h;
            let finalW = maxW;
            let finalH = Math.round(finalW / ratio);
            if (finalH > maxH) {
              finalH = maxH;
              finalW = Math.round(finalH * ratio);
            }
            [flipCard, flipInner, flipFront, flipBack].forEach(el => {
              el.style.width = finalW + 'px';
              el.style.height = finalH + 'px';
              el.style.maxWidth = maxW + 'px';
              el.style.maxHeight = maxH + 'px';
              el.style.borderRadius = '12px';
            });
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '12px';
          }
        };
        if (img.complete) img.onload();
      }
    }
  });
  return marker;
}

function initAudio() {
  if (!PLAYLIST.length) return;
  function load(index) {
    currentTrackIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    const track = PLAYLIST[currentTrackIndex];
    audio.src = track.arquivo;
    titleEl.textContent = track.titulo;
  }
  function play() {
    audio.play().catch(() => {/* autoplay bloqueado até interação */});
  }
  function pause() { audio.pause(); }

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      play();
      playPauseBtn.textContent = "⏸";
    } else {
      pause();
      playPauseBtn.textContent = "▶";
    }
  });
  prevBtn.addEventListener("click", () => { load(currentTrackIndex - 1); play(); });
  nextBtn.addEventListener("click", () => { load(currentTrackIndex + 1); play(); });
  audio.addEventListener("ended", () => { load(currentTrackIndex + 1); play(); });

  volumeEl.addEventListener("input", () => { audio.volume = parseFloat(volumeEl.value); });
  muteBtn.addEventListener("click", () => { audio.muted = !audio.muted; muteBtn.textContent = audio.muted ? "🔇" : "🔈"; });

  // carga inicial
  load(0);
  audio.volume = parseFloat(volumeEl.value);
}

function initMap() {
  const center = computeMapCenterFromPlaces(window.lugares); // [lat, lng]
  map = L.map(mapContainerId, { zoomControl: true }).setView(center, 12);

  const hasJawg = JAWG_TOKEN && JAWG_TOKEN !== "COLOQUE_SEU_TOKEN_JAWG_AQUI";
  if (hasJawg) {
    // Jawg Streets: https://www.jawg.io
    L.tileLayer(
      'https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=' + encodeURIComponent(JAWG_TOKEN),
      {
        maxZoom: 22,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors, Imagery \u00a9 Jawg',
      }
    ).addTo(map);
  } else {
    // Fallback: Carto Positron (mapa mais limpo/minimalista)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
    }).addTo(map);
  }

  // cria marcadores
  markerRefs = window.lugares.map((p, i) => createMarker(p, i));
  if (bounds && window.lugares.length > 1) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
}

// Popula a lista lateral de lugares especiais
function populatePlacesList(places) {
  listEl.innerHTML = "";
  for (let i = 0; i < places.length; i++) {
    const p = places[i];
    const primary = getPrimaryImageAndText(p);
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${primary.img}" alt="${p.nome}" />
      <div>
        <h3>${p.nome}</h3>
        <span>${primary.text}</span>
      </div>
    `;
    li.addEventListener("click", () => {
      const [lat, lng] = p.coordenadas;
      map.flyTo([lat, lng], 14, { duration: 0.8 });
      const marker = markerRefs[i];
      if (marker) {
        marker.openPopup();
      }
    });
    listEl.appendChild(li);
  }
  counterEl.textContent = `Nossos ${places.length} lugares especiais`;
}