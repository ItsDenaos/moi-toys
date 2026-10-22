// Saca una captura de cada proyecto para su empaque en img/.
//
// Sirve la carpeta publicada de cada proyecto (dist, .output/public…) con un servidor
// estático propio, la abre en Chromium a 1024×640 y guarda img/<id>.jpg.
//
// Uso (desde la carpeta moi-toys):
//   node scripts/capturas.cjs                      todas
//   node scripts/capturas.cjs ghostreel lumos      solo esas
//
// Necesita Playwright con Chromium. Por defecto usa el que ya está instalado en
// ../pdf-kingdom; si está en otro lado, se indica con la variable MOI_PLAYWRIGHT.
// Antes de capturar, conviene compilar cada proyecto (npm run build / npm run generate)
// para que la captura muestre la última versión.

const http = require("http");
const fs = require("fs");
const path = require("path");

const RAIZ = path.resolve(__dirname, "..");
const DOCS = path.resolve(RAIZ, "..");
const rutaPlaywright = process.env.MOI_PLAYWRIGHT || path.join(DOCS, "pdf-kingdom", "node_modules", "playwright");
const { chromium } = require(rutaPlaywright);
const soloEstos = process.argv.slice(2);

// id = nombre del archivo en img/; dir = carpeta publicada del proyecto.
const PROYECTOS = [
  { id: "leyenda", dir: "Leyenda/app/dist" },
  { id: "lumos", dir: "lumos/dist" },
  { id: "georetos", dir: "georetos/dist" },
  { id: "gobierno", dir: "Cositas/gobierno-sim/dist" },
  { id: "pdf-kingdom", dir: "pdf-kingdom/.output/public" },
  {
    id: "pa-donde",
    dir: "pa-donde",
    // Cierra la bienvenida para que se vea el mapa.
    antes: async (page) => {
      await page.getByText("Saltar", { exact: true }).click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(800);
    },
  },
  { id: "ghostreel", dir: "ghostreel/dist" },
  {
    id: "papel-minado",
    dir: "papel-minado",
    // Pasa la portada ("pulsa cualquier tecla") y destapa el centro (el primer clic
    // es seguro) para que se vea una partida empezada.
    antes: async (page) => {
      await page.keyboard.press("Space");
      await page.waitForTimeout(2500);
      await page.mouse.click(512, 335);
      await page.waitForTimeout(2500);
      await page.mouse.move(1000, 600);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    },
  },
];

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".geojson": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".wasm": "application/wasm",
  ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav",
};

function servir(dir) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let file = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
      if (!file.startsWith(dir)) { res.writeHead(403); return res.end(); }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
      if (!fs.existsSync(file)) file = path.join(dir, "index.html"); // rutas de SPA
      res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => resolve(srv));
  });
}

(async () => {
  const salida = path.join(RAIZ, "img");
  fs.mkdirSync(salida, { recursive: true });
  const browser = await chromium.launch();
  for (const p of PROYECTOS) {
    if (soloEstos.length && !soloEstos.includes(p.id)) continue;
    const dir = path.join(DOCS, p.dir);
    if (!fs.existsSync(path.join(dir, "index.html"))) {
      console.log(`SALTADO ${p.id}: no existe ${dir}/index.html (¿falta compilarlo?)`);
      continue;
    }
    const srv = await servir(dir);
    const ctx = await browser.newContext({
      viewport: { width: 1024, height: 640 },
      locale: "es-CO",
      serviceWorkers: "block",
    });
    const page = await ctx.newPage();
    try {
      await page.goto(`http://127.0.0.1:${srv.address().port}/`, { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2500);
      if (p.antes) await p.antes(page);
      await page.screenshot({ path: path.join(salida, `${p.id}.jpg`), type: "jpeg", quality: 82 });
      console.log(`OK ${p.id}`);
    } catch (e) {
      console.log(`FALLÓ ${p.id}: ${e.message}`);
    }
    await ctx.close();
    srv.close();
  }
  await browser.close();
})();
