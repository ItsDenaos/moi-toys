/*
 * La juguetería: aquí viven todos los proyectos que muestra la web.
 *
 * Para agregar uno nuevo, copia un bloque { ... } y cambia sus datos.
 * El orden de la lista es el orden de la estantería (y su número de colección: Nº 01, Nº 02…).
 *
 *   titulo       Nombre del proyecto.
 *   subtitulo    (opcional) Segunda línea del nombre, ej. "El reloj del cielo".
 *   categoria    "web" | "app" | "juego" | "otro"   (decide en qué filtro aparece)
 *   descripcion  Una o dos frases contando qué es.
 *   tecnologias  Lista de etiquetas, ej. ["Vue 3", "Vite"]. Salen como "piezas incluidas".
 *   ficha        (opcional) Datos cortos del empaque, ej. "2 jugadores · teclado".
 *   sello        (opcional) Texto de la estrella pegada en el empaque, ej. "¡Para 2!". Corto.
 *   estado       "publicado" | "en-desarrollo"
 *   color        Color del empaque: "tomate" | "naranja" | "sol" | "lima" | "menta" | "cobalto" | "uva" | "chicle"
 *                (o cualquier color CSS, ej. "#ff5a36").
 *   imagen       (opcional) Captura del proyecto, ej. "img/leyenda.jpg" (mejor en 16:10).
 *   emoji        Dibujo de la cápsula de la máquina (y de la portada si no hay imagen).
 *   demo         (opcional) Enlace para abrirlo o jugarlo. Vacío = "Muy pronto".
 *   codigo       (opcional) Enlace al repositorio.
 *   destacado    (opcional) true para pegarle el sello de "Favorito".
 */
window.PROYECTOS = [
  {
    titulo: "Leyenda",
    subtitulo: "Carrera de fútbol",
    categoria: "juego",
    descripcion:
      "Simulador de la carrera de un futbolista, de principiante a leyenda (o al fracaso). Fichajes, lesiones, selección nacional y todo el motor corriendo en el navegador.",
    tecnologias: ["Vue 3", "TypeScript", "Pinia", "Vite"],
    ficha: "1 jugador · una carrera entera",
    sello: "¡Sé leyenda!",
    estado: "publicado",
    color: "sol",
    imagen: "img/leyenda.jpg",
    emoji: "⚽",
    demo: "",
    codigo: "https://github.com/ItsDenaos/Leyenda",
    destacado: true,
  },
  {
    titulo: "Lumos",
    subtitulo: "El reloj del cielo",
    categoria: "juego",
    descripcion:
      "Plataformas y puzles cooperativo en pixel art para dos personas en el mismo teclado. Lu y Mos suben al Observatorio a darle cuerda al cielo: nadie puede ganar solo.",
    tecnologias: ["TypeScript", "Canvas", "Pixel art", "Vite"],
    ficha: "2 jugadores · mismo teclado",
    sello: "¡Para 2!",
    estado: "publicado",
    color: "uva",
    imagen: "img/lumos.jpg",
    emoji: "🌗",
    demo: "",
    codigo: "https://github.com/ItsDenaos/lumos",
  },
  {
    titulo: "GeoRetos",
    subtitulo: "El mundo es tu tablero",
    categoria: "juego",
    descripcion:
      "Retos de geografía para aprender jugando desde el celular: ubica países en el mapa, trivia, siluetas y un reto diario con racha. Se instala como app y funciona sin internet.",
    tecnologias: ["Vue 3", "TypeScript", "D3", "PWA"],
    ficha: "1 jugador · 195 países",
    sello: "¡Reto diario!",
    estado: "publicado",
    color: "cobalto",
    imagen: "img/georetos.jpg",
    emoji: "🌎",
    demo: "",
    codigo: "https://github.com/ItsDenaos/georetos",
  },
  {
    titulo: "Simulador de Gobierno",
    categoria: "juego",
    descripcion:
      "Gobierna un país ficticio por turnos: economía, parlamento, diplomacia con 5 países IA y eventos que vuelven como crisis. Seis finales posibles.",
    tecnologias: ["Vue 3", "Pinia", "Vite"],
    ficha: "1 jugador · por turnos",
    sello: "¡6 finales!",
    estado: "publicado",
    color: "menta",
    imagen: "img/gobierno.jpg",
    emoji: "🏛️",
    demo: "",
    codigo: "https://github.com/ItsDenaos/gobierno-sim",
  },
  {
    titulo: "Papel Minado",
    subtitulo: "Buscaminas de tinta y papel",
    categoria: "juego",
    descripcion:
      "Un buscaminas con estética de risografía: tintas planas, sellos de goma y confeti de papel. Cuatro formatos, pistas, récords y Pum, una bomba que se pone nerviosa.",
    tecnologias: ["HTML", "CSS", "JavaScript", "Web Audio"],
    ficha: "1 jugador · 4 formatos",
    sello: "¡PUM!",
    estado: "publicado",
    color: "chicle",
    imagen: "img/papel-minado.jpg",
    emoji: "💣",
    demo: "",
    codigo: "https://github.com/ItsDenaos/papel-minado",
  },
  {
    titulo: "PDF Kingdom",
    categoria: "app",
    descripcion:
      "Herramientas PDF gratis que funcionan 100 % en el navegador: unir, dividir, rotar, comprimir, proteger y pasar a JPG. Los archivos nunca salen de tu dispositivo.",
    tecnologias: ["Nuxt", "Vue 3", "TypeScript", "pdf.js"],
    ficha: "8 herramientas · sin registro",
    sello: "¡100 % privado!",
    estado: "publicado",
    color: "tomate",
    imagen: "img/pdf-kingdom.jpg",
    emoji: "👑",
    demo: "",
    codigo: "https://github.com/ItsDenaos/pdf-kingdom",
  },
  {
    titulo: "Pa' Donde",
    subtitulo: "Buses de Barranquilla",
    categoria: "app",
    descripcion:
      "Rutas de buses de Barranquilla sobre un mapa: Transmetro y buses tradicionales, con \"Cómo llegar\" y el valor del pasaje. Se instala como app y funciona sin internet.",
    tecnologias: ["JavaScript", "Leaflet", "OpenStreetMap", "PWA"],
    ficha: "127 rutas · área metropolitana",
    sello: "¡Sin internet!",
    estado: "publicado",
    color: "naranja",
    imagen: "img/pa-donde.jpg",
    emoji: "🚌",
    demo: "",
    codigo: "https://github.com/ItsDenaos/pa-donde",
  },
  {
    titulo: "Ghostreel",
    subtitulo: "Recorta y comprime video",
    categoria: "app",
    descripcion:
      "Recorta y comprime videos 100 % en el navegador: corte rápido sin pérdida o exacto al fotograma, y un clic para que quepan en WhatsApp, Discord o el correo. Tus videos nunca salen del dispositivo.",
    tecnologias: ["React", "TypeScript", "WebCodecs", "Mediabunny", "PWA"],
    ficha: "MP4, MOV, WebM y MKV",
    sello: "¡Sin rastro!",
    estado: "publicado",
    color: "lima",
    imagen: "img/ghostreel.jpg",
    emoji: "👻",
    demo: "",
    codigo: "https://github.com/ItsDenaos/ghostreel",
  },
];

/* Datos generales del sitio. */
window.MOI = {
  github: "https://github.com/ItsDenaos",
};
