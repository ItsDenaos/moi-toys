(function () {
  "use strict";

  var CATEGORIAS = {
    web:   { nombre: "Webs",     singular: "Web",     boton: "Visitar" },
    app:   { nombre: "Apps web", singular: "App web", boton: "Abrir" },
    juego: { nombre: "Juegos",   singular: "Juego",   boton: "Jugar" },
    otro:  { nombre: "Otros",    singular: "Otro",    boton: "Ver" },
  };

  // Colores de empaque: [fondo, color del texto impreso encima]
  var TINTA = "#1d1633";
  var PALETA = {
    tomate:  ["#ff5a36", TINTA],
    naranja: ["#ff8f1f", TINTA],
    sol:     ["#ffc83d", TINTA],
    lima:    ["#9be03c", TINTA],
    menta:   ["#1fb89a", TINTA],
    cobalto: ["#3158f0", "#ffffff"],
    uva:     ["#7a4fe0", "#ffffff"],
    chicle:  ["#ff6fae", TINTA],
  };
  var ORDEN_PALETA = ["tomate", "sol", "cobalto", "menta", "uva", "naranja", "chicle", "lima"];
  // Colores de los sellos: siempre distintos del empaque.
  var SELLO_PARA = { sol: "chicle", naranja: "sol", tomate: "sol", lima: "chicle", menta: "sol", cobalto: "sol", uva: "sol", chicle: "sol" };
  // Inclinaciones para que la estantería no se vea de catálogo.
  var INCLINACIONES = [-1.2, 0.8, -0.4, 1.1, -0.9, 0.5];

  var proyectos = window.PROYECTOS || [];
  var filtroActual = "todos";
  var textoBusqueda = "";
  var movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var grilla = document.getElementById("grilla");
  var filtros = document.getElementById("filtros");
  var buscar = document.getElementById("buscar");
  var vacio = document.getElementById("vacio");

  function el(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto != null) nodo.textContent = texto;
    return nodo;
  }

  var SVG = "http://www.w3.org/2000/svg";
  function svg(etiqueta, atributos) {
    var nodo = document.createElementNS(SVG, etiqueta);
    Object.keys(atributos || {}).forEach(function (k) { nodo.setAttribute(k, atributos[k]); });
    return nodo;
  }

  function iconoLlave() {
    var s = svg("svg", { "aria-hidden": "true" });
    var u = svg("use");
    u.setAttribute("href", "#llave");
    s.appendChild(u);
    return s;
  }

  function colorDe(p, i) {
    var nombre = p.color || ORDEN_PALETA[i % ORDEN_PALETA.length];
    if (PALETA[nombre]) return { fondo: PALETA[nombre][0], texto: PALETA[nombre][1], nombre: nombre };
    return { fondo: nombre, texto: TINTA, nombre: null };
  }

  function contarPorCategoria() {
    var cuenta = {};
    proyectos.forEach(function (p) {
      cuenta[p.categoria] = (cuenta[p.categoria] || 0) + 1;
    });
    return cuenta;
  }

  // Normaliza para que "codigo" encuentre "Código".
  function normalizar(texto) {
    return String(texto || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function numero(i) {
    return "Nº " + String(i + 1).padStart(2, "0");
  }

  /* ---------- Contador de la portada ---------- */
  function pintarContador() {
    var cuenta = contarPorCategoria();
    var contador = document.getElementById("contador");
    var total = proyectos.length;
    contador.appendChild(el("span", null, total + (total === 1 ? " juguete" : " juguetes")));
    Object.keys(CATEGORIAS).forEach(function (clave) {
      var n = cuenta[clave];
      if (!n) return;
      var nombre = n === 1 ? CATEGORIAS[clave].singular : CATEGORIAS[clave].nombre;
      contador.appendChild(el("span", null, n + " " + nombre.toLowerCase()));
    });
  }

  /* ---------- Cinta de anuncios ---------- */
  function pintarCinta() {
    var pista = document.getElementById("cinta-pista");
    var avisos = proyectos.filter(function (p) { return p.sello; }).map(function (p) {
      return [p.titulo, p.sello];
    });
    avisos.push(["Moi Toys", "Pilas no incluidas"]);
    // Dos copias seguidas para que la cinta dé la vuelta sin saltos.
    for (var copia = 0; copia < 2; copia++) {
      avisos.forEach(function (a) {
        var item = el("span");
        item.appendChild(el("b", null, a[0] + " "));
        item.appendChild(document.createTextNode(a[1]));
        pista.appendChild(item);
        pista.appendChild(el("span", "chispa", "✦"));
      });
    }
  }

  /* ---------- Etiquetas de filtro ---------- */
  function pintarFiltros() {
    var cuenta = contarPorCategoria();
    var opciones = [{ clave: "todos", nombre: "Todos", n: proyectos.length }];
    Object.keys(CATEGORIAS).forEach(function (clave) {
      // Solo se muestran los tipos que tienen al menos un proyecto.
      if (cuenta[clave]) opciones.push({ clave: clave, nombre: CATEGORIAS[clave].nombre, n: cuenta[clave] });
    });

    opciones.forEach(function (op) {
      var boton = el("button", "filtro");
      boton.type = "button";
      boton.dataset.clave = op.clave;
      boton.setAttribute("aria-pressed", String(op.clave === filtroActual));
      var cara = el("span", "filtro-cara", op.nombre);
      cara.appendChild(el("span", "num", String(op.n)));
      boton.appendChild(cara);
      boton.addEventListener("click", function () { elegirFiltro(op.clave); });
      filtros.appendChild(boton);
    });
  }

  function elegirFiltro(clave) {
    filtroActual = clave;
    filtros.querySelectorAll(".filtro").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.clave === filtroActual));
    });
    pintarGrilla();
  }

  /* ---------- Empaques ---------- */
  function columpiar(carton) {
    if (movimientoReducido || carton.classList.contains("columpio")) return;
    carton.classList.add("columpio");
  }

  function crearPack(p, indice, orden) {
    var cat = CATEGORIAS[p.categoria] || CATEGORIAS.otro;
    var color = colorDe(p, indice);

    var li = el("li", "pack");
    li.dataset.indice = indice;
    li.appendChild(el("span", "gancho")).setAttribute("aria-hidden", "true");

    var mueve = el("div", "pack-mueve");
    mueve.style.setProperty("--inclinacion", INCLINACIONES[indice % INCLINACIONES.length] + "deg");
    mueve.style.animationDelay = Math.min(orden * 90, 540) + "ms";

    var carton = el("article", "pack-carton");
    carton.setAttribute("aria-label", p.titulo);
    carton.style.setProperty("--pack", color.fondo);
    carton.style.setProperty("--pack-texto", color.texto);
    carton.addEventListener("pointerenter", function () { columpiar(carton); });
    carton.addEventListener("animationend", function (e) {
      if (e.animationName === "columpio") carton.classList.remove("columpio");
    });

    carton.appendChild(el("div", "pack-pestana"));
    var cuerpo = el("div", "pack-cuerpo");

    // Marca y número de colección
    var marca = el("div", "pack-marca");
    var logo = el("span", "pack-logo");
    logo.appendChild(iconoLlave());
    logo.appendChild(document.createTextNode("MOI TOYS"));
    logo.setAttribute("aria-hidden", "true");
    marca.appendChild(logo);
    marca.appendChild(el("span", "pack-num", numero(indice)));
    cuerpo.appendChild(marca);

    // Burbuja con la captura
    var vitrina = el("div", "pack-vitrina");
    var burbuja = el("div", "pack-burbuja");
    if (p.imagen) {
      var img = el("img");
      img.src = p.imagen;
      img.alt = "Captura de " + p.titulo;
      img.loading = "lazy";
      img.decoding = "async";
      burbuja.appendChild(img);
    } else {
      var emoji = el("span", "pack-emoji", p.emoji || "🧩");
      emoji.setAttribute("aria-hidden", "true");
      burbuja.appendChild(emoji);
    }
    vitrina.appendChild(burbuja);

    var calcos = el("div", "pack-calcos");
    if (p.destacado) calcos.appendChild(el("span", "pack-calco favorito", "★ Favorito"));
    if (p.estado === "en-desarrollo") calcos.appendChild(el("span", "pack-calco desarrollo", "En desarrollo"));
    if (calcos.childNodes.length) vitrina.appendChild(calcos);

    if (p.sello) {
      var sello = el("span", "pack-sello");
      var colorSello = PALETA[SELLO_PARA[color.nombre] || "sol"][0];
      sello.style.setProperty("--sello", colorSello);
      sello.appendChild(el("span", null, p.sello));
      vitrina.appendChild(sello);
    }
    cuerpo.appendChild(vitrina);

    // Nombre impreso sobre el cartón
    var nombre = el("div", "pack-nombre");
    nombre.appendChild(el("span", "pack-tipo", cat.singular));
    nombre.appendChild(el("h3", null, p.titulo));
    if (p.subtitulo) nombre.appendChild(el("p", "pack-sub", p.subtitulo));
    if (p.ficha) nombre.appendChild(el("p", "pack-ficha", p.ficha));
    cuerpo.appendChild(nombre);

    // Etiqueta de papel
    var etiqueta = el("div", "pack-etiqueta");
    etiqueta.appendChild(el("p", null, p.descripcion));

    if (p.tecnologias && p.tecnologias.length) {
      var piezas = el("div");
      piezas.appendChild(el("span", "rotulo", "Piezas incluidas"));
      var lista = el("ul", "piezas");
      p.tecnologias.forEach(function (t) { lista.appendChild(el("li", null, t)); });
      piezas.appendChild(lista);
      etiqueta.appendChild(piezas);
    }

    var acciones = el("div", "pack-acciones");
    if (p.demo) {
      var abrir = el("a", "boton-pack boton-jugar", "▶ " + cat.boton);
      abrir.href = p.demo;
      abrir.target = "_blank";
      abrir.rel = "noopener";
      acciones.appendChild(abrir);
    } else {
      acciones.appendChild(el("span", "boton-pack boton-pronto", "Muy pronto"));
    }
    if (p.codigo) {
      var codigo = el("a", "boton-pack boton-codigo", "</> Código");
      codigo.href = p.codigo;
      codigo.target = "_blank";
      codigo.rel = "noopener";
      codigo.setAttribute("aria-label", "Código de " + p.titulo);
      acciones.appendChild(codigo);
    }
    etiqueta.appendChild(acciones);
    cuerpo.appendChild(etiqueta);

    carton.appendChild(cuerpo);
    mueve.appendChild(carton);
    li.appendChild(mueve);
    return li;
  }

  function pintarGrilla() {
    var q = normalizar(textoBusqueda.trim());
    var visibles = [];
    proyectos.forEach(function (p, i) {
      if (filtroActual !== "todos" && p.categoria !== filtroActual) return;
      if (q) {
        var pajar = normalizar([p.titulo, p.subtitulo, p.descripcion, p.ficha].concat(p.tecnologias || []).join(" "));
        if (pajar.indexOf(q) === -1) return;
      }
      visibles.push(i);
    });

    grilla.replaceChildren();
    visibles.forEach(function (i, orden) { grilla.appendChild(crearPack(proyectos[i], i, orden)); });
    vacio.hidden = visibles.length > 0;
  }

  /* ---------- Máquina de cápsulas ---------- */
  // Dónde van las cápsulas dentro de la cúpula (x, y, giro).
  var HUECOS = [
    [110, 196, -20], [152, 202, 15], [194, 194, -10],
    [84, 158, 30], [128, 160, -35], [172, 158, 10], [216, 160, 40],
    [104, 118, 5], [150, 120, -25], [196, 118, 20],
    [130, 80, 60],
  ];

  function pintarCapsulas() {
    var grupo = document.getElementById("capsulas");
    HUECOS.forEach(function (h, i) {
      var p = proyectos.length ? proyectos[i % proyectos.length] : {};
      var fondo = colorDe(p, i).fondo;
      var lugar = svg("g", { transform: "translate(" + h[0] + " " + h[1] + ") rotate(" + h[2] + ")" });
      var capsula = svg("g", { class: "capsula" });
      capsula.appendChild(svg("circle", { r: 23, class: "capsula-cuerpo" }));
      capsula.appendChild(svg("path", { d: "M-23 0 A23 23 0 0 1 23 0 Z", fill: fondo, stroke: TINTA, "stroke-width": 4 }));
      capsula.appendChild(svg("line", { x1: -23, y1: 0, x2: 23, y2: 0, class: "capsula-linea" }));
      capsula.appendChild(svg("ellipse", { cx: -8, cy: -11, rx: 6, ry: 3.5, class: "capsula-luz", transform: "rotate(-30 -8 -11)" }));
      lugar.appendChild(capsula);
      grupo.appendChild(lugar);
    });
  }

  var girando = false;
  var vueltas = 0;
  var ultimo = -1;
  var elegido = -1;

  function girar() {
    if (girando || !proyectos.length) return;
    girando = true;
    vueltas += 1;

    var perilla = document.getElementById("perilla");
    var capsulas = document.getElementById("capsulas");
    var premio = document.getElementById("premio");
    var tarjeta = document.getElementById("premio-tarjeta");
    var botonGirar = document.querySelector(".boton-girar");
    botonGirar.setAttribute("aria-disabled", "true");

    var cartel = document.querySelector(".maquina-cartel");
    var pregunta = document.getElementById("cartel-pregunta");

    perilla.style.transform = "rotate(" + vueltas * 360 + "deg)";
    capsulas.classList.add("agitando");
    premio.classList.remove("cae", "abierto");

    // Nunca sale el mismo juguete dos veces seguidas.
    do { elegido = Math.floor(Math.random() * proyectos.length); }
    while (proyectos.length > 1 && elegido === ultimo);
    ultimo = elegido;
    var p = proyectos[elegido];
    var color = colorDe(p, elegido).fondo;

    var pausa = movimientoReducido ? 0 : 1;
    setTimeout(function () {
      capsulas.classList.remove("agitando");
      premio.style.setProperty("--premio-color", color);
      void premio.getBoundingClientRect(); // reinicia la animación
      premio.classList.add("cae");
    }, 850 * pausa);

    setTimeout(function () {
      premio.classList.add("abierto");
      tarjeta.style.setProperty("--premio-color", color);
      document.getElementById("premio-emoji").textContent = p.emoji || "🧩";
      document.getElementById("premio-nombre").textContent = p.titulo;
      // Se esconde y se vuelve a mostrar para que la animación de aparecer se repita en cada vuelta.
      tarjeta.hidden = true;
      void tarjeta.offsetWidth;
      tarjeta.hidden = false;
      pregunta.hidden = true;
      cartel.classList.add("con-premio");
      document.getElementById("anuncio").textContent = "Te salió " + p.titulo;
      botonGirar.textContent = "Otra vuelta";
      botonGirar.removeAttribute("aria-disabled");
      girando = false;
    }, 1900 * pausa);
  }

  function verElegido() {
    if (elegido < 0) return;
    var buscarPack = function () { return grilla.querySelector('.pack[data-indice="' + elegido + '"]'); };
    if (!buscarPack()) {
      // Está escondido por un filtro o una búsqueda: se muestra todo.
      buscar.value = "";
      textoBusqueda = "";
      elegirFiltro("todos");
    }
    var pack = buscarPack();
    if (!pack) return;
    pack.scrollIntoView({ behavior: movimientoReducido ? "auto" : "smooth", block: "center" });
    var carton = pack.querySelector(".pack-carton");
    setTimeout(function () {
      carton.classList.remove("elegido");
      void carton.offsetWidth;
      carton.classList.add("elegido");
      columpiar(carton);
      var enlace = carton.querySelector("a");
      if (enlace) enlace.focus({ preventScroll: true });
    }, movimientoReducido ? 0 : 650);
  }

  /* ---------- Código de barras del pie ---------- */
  function pintarCodigoBarras() {
    var caja = document.getElementById("codigo-barras");
    var texto = "MOITOYS" + new Date().getFullYear();
    var x = 0;
    var barras = [];
    for (var i = 0; i < texto.length; i++) {
      var c = texto.charCodeAt(i);
      [c % 3 + 1, (c >> 2) % 3 + 1, (c >> 4) % 2 + 1].forEach(function (ancho, j) {
        barras.push([x, ancho]);
        x += ancho + ((c >> j) % 2) + 1;
      });
    }
    caja.setAttribute("viewBox", "0 0 " + x + " 46");
    caja.setAttribute("preserveAspectRatio", "none");
    barras.forEach(function (b) {
      caja.appendChild(svg("rect", { x: b[0], y: 0, width: b[1], height: 36, fill: TINTA }));
    });
    var leyenda = svg("text", { x: x / 2, y: 45, "text-anchor": "middle", "font-size": 8.5, "font-family": "Barlow Condensed, sans-serif", "font-weight": 700, fill: TINTA, "letter-spacing": 1.5 });
    leyenda.textContent = "MOI · TOYS · " + new Date().getFullYear();
    caja.appendChild(leyenda);
  }

  /* ---------- Tema claro / oscuro ---------- */
  function temaActual() {
    var forzado = document.documentElement.dataset.theme;
    if (forzado) return forzado;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.getElementById("boton-tema").addEventListener("click", function () {
    var nuevo = temaActual() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    try { localStorage.setItem("moi-tema", nuevo); } catch (e) {}
  });

  /* ---------- Arranque ---------- */
  buscar.addEventListener("input", function () {
    textoBusqueda = buscar.value;
    pintarGrilla();
  });

  document.querySelectorAll("[data-girar]").forEach(function (b) { b.addEventListener("click", girar); });
  document.getElementById("premio-ver").addEventListener("click", verElegido);

  var github = document.getElementById("enlace-github");
  if (window.MOI && window.MOI.github) github.href = window.MOI.github;
  else github.hidden = true;

  document.querySelectorAll(".anio").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  pintarContador();
  pintarCinta();
  pintarFiltros();
  pintarCapsulas();
  pintarGrilla();
  pintarCodigoBarras();
})();
