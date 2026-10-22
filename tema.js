// Aplica el tema guardado antes de pintar, para que no parpadee.
// Va en un archivo aparte (y no dentro del HTML) para que la política de seguridad
// de netlify.toml pueda prohibir los scripts en línea.
try {
  var t = localStorage.getItem("moi-tema");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch (e) {}
