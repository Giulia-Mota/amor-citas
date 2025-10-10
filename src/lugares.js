// Dados dos lugares.
// Observação: por praticidade, aqui usamos coordenadas no formato [lat, lng].
// O Mapbox GL JS espera [lng, lat], então o app converte automaticamente.

// Você pode usar um de dois formatos por lugar:
// 1) Campo "foto" (apenas uma imagem) + "mensagem"
// 2) Campo "fotos" (array) com objetos { url, texto } para ativar o carrossel
// Exemplo de múltiplas fotos está no primeiro item abaixo.

const lugares = [
  {
    nome: "Modena Residence",
    coordenadas: [-1.4291488184684868, -48.47065626325489],
    fotos: [
      { url: "../public/img/foto 3x4 1.jpg", texto: "Nosso primeiro pôr do sol juntos 🌅" },
      { url: "../public/img/parceiros-de-visao-lateral-de-maos-dadas-1-.avif", texto: "Nosso!!1! primeiro pôr do sol juntos 🌅" },
      { url: "../public/img/download.jpeg", texto: "Nosso!1!1! primeiro pôr do sol juntos 🌅" },
      { url: "../public/img/download (2).jpeg", texto: "Nosso!!111! primeiro pôr do sol juntos 🌅" },

    ],
    encontro: true,
  },
];

// Exporte global para o script principal
window.lugares = lugares;


