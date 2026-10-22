# Moi Toys 🧸

La caja de juguetes de Moisés: una vitrina con todas mis webs, apps web y juegos web.

Es un sitio estático (HTML, CSS y JavaScript, sin build ni dependencias): se abre con doble
clic en `index.html` y se publica tal cual.

## La identidad

Moi Toys es una **juguetería**. La pared es un tablero perforado con un toldo de tienda
arriba, y cada proyecto es un juguete empacado que cuelga de un gancho:

- **El empaque**: cartón del color del proyecto con rayos de sol, número de colección
  (Nº 01, Nº 02…), la captura del proyecto dentro de una burbuja de plástico, un sello de
  estrella y una etiqueta de papel con la descripción y las "piezas incluidas"
  (tecnologías). Al pasar el mouse se columpia en su gancho.
- **La máquina de cápsulas**: en la portada; al girar la perilla sale un proyecto al azar
  y el botón "Ver en la estantería" lleva hasta su empaque.
- **La llave de cuerda**: el símbolo de la marca (logo, favicon y empaques).
- **Tipografías**: Bagel Fat One (títulos), Barlow Condensed (letra de empaque) y Nunito
  (texto).
- **Modo oscuro**: la tienda de noche. Solo cambia la pared; los empaques son "impresos" y
  se ven igual.

## Archivos

| Archivo                | Qué tiene                                                     |
| ---------------------- | ------------------------------------------------------------- |
| `proyectos.js`         | **La lista de proyectos.** Es el único archivo que hay que tocar para agregar uno. |
| `index.html`           | La estructura de la página (y el dibujo de la máquina).       |
| `styles.css`           | Colores, tipografía y diseño (modo claro y oscuro).           |
| `app.js`               | Arma los empaques, los filtros, el buscador y la máquina.     |
| `tema.js`              | Aplica el modo claro u oscuro guardado antes de pintar.        |
| `img/`                 | Capturas de los proyectos.                                    |
| `netlify.toml`         | Publicación y encabezados de seguridad.                       |
| `scripts/capturas.cjs` | Vuelve a sacar las capturas de `img/`.                         |

## Agregar un proyecto

Abrir `proyectos.js`, copiar uno de los bloques `{ ... }` y cambiar sus datos:

```js
{
  titulo: "Mi juego nuevo",
  subtitulo: "La gran aventura",     // opcional: segunda línea del nombre
  categoria: "juego",                // "web" | "app" | "juego" | "otro"
  descripcion: "Qué es y de qué va, en una o dos frases.",
  tecnologias: ["JavaScript", "Canvas"],
  ficha: "1 jugador · celular",      // opcional: datos cortos del empaque
  sello: "¡Nuevo!",                  // opcional: texto de la estrella (corto)
  estado: "en-desarrollo",           // o "publicado"
  color: "chicle",                   // tomate, naranja, sol, lima, menta, cielo, cobalto, uva o chicle
  imagen: "img/mi-juego.jpg",        // opcional: captura (mejor en 16:10)
  emoji: "🎮",                       // cápsula de la máquina (y portada si no hay imagen)
  demo: "https://mi-juego.netlify.app",
  codigo: "https://github.com/ItsDenaos/mi-juego",
  destacado: true,                   // opcional: calcomanía de "★ Favorito"
},
```

- Si `demo` está vacío, el empaque muestra **Muy pronto** en vez del botón de jugar.
- Los filtros solo aparecen para los tipos que tienen al menos un proyecto.
- Los sellos de la estrella también salen en la cinta de anuncios de la portada.

## Capturas

Las capturas de `img/` se sacan solas con:

```bash
node scripts/capturas.cjs                      # todas
node scripts/capturas.cjs camaleon ghostreel   # solo esas
```

El script abre la versión compilada de cada proyecto (su carpeta `dist`, `.output/public`,
etc., junto a esta carpeta en Documentos) y guarda `img/<id>.jpg` a 1024×640. Usa el
Playwright que ya está instalado en `pdf-kingdom`. Para un proyecto nuevo, agregarlo a la
lista `PROYECTOS` del script. Conviene compilar cada proyecto antes, para que la captura
muestre la última versión. Camaleón usa la cámara de prueba de Chromium (un patrón verde
animado), así que no hace falta webcam.

## Código de los proyectos

El botón "Código" aparece en todos los proyectos que tienen `codigo`, sea el repositorio
público o privado: la página no le pregunta nada a GitHub. Si el repositorio es privado
(hoy Lumos y Simulador de Gobierno), quien no tenga acceso verá un 404 de GitHub al abrirlo.

## Publicar en Netlify

`netlify.toml` le dice a Netlify que publique la carpeta tal cual (no hay comando de build) y
agrega encabezados de seguridad: una política CSP que solo permite scripts y estilos propios
más Google Fonts, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` y
`Permissions-Policy`. Por la CSP, el HTML no lleva scripts ni atributos `style` en línea
(por eso `tema.js` va en su propio archivo); si se agrega uno, el navegador lo bloquea en
Netlify aunque en local funcione.

### Con un repositorio de GitHub (recomendado)

La primera vez:

1. Subir el proyecto a GitHub, de una de estas dos formas:
   - **Con GitHub Desktop:** *Publish repository*, con el nombre `moi-toys`. Crea el
     repositorio en GitHub y sube los commits.
   - **Con la terminal:** crear en [github.com/new](https://github.com/new) un repositorio
     vacío llamado `moi-toys` (sin README, sin `.gitignore` y sin licencia, porque ya están
     en el proyecto) y luego:

     ```bash
     git remote add origin https://github.com/ItsDenaos/moi-toys.git
     git push -u origin main
     ```
2. En [app.netlify.com](https://app.netlify.com): *Add new site → Import an existing project →
   GitHub*, autorizar a Netlify y elegir `moi-toys`. Netlify lee `netlify.toml`, así que los
   campos de build quedan bien solos: solo hay que darle *Deploy*.
3. Netlify da una dirección como `https://nombre-al-azar.netlify.app`; se puede cambiar en
   *Site configuration → Change site name* (por ejemplo `moi-toys.netlify.app`, si está libre).

Después, para publicar un cambio:

```bash
git add -A
git commit -m "Describe el cambio"
git push
```

Netlify vuelve a publicar solo en uno o dos minutos.

### Arrastrando la carpeta (sin GitHub)

Arrastrar la carpeta `moi-toys` a [app.netlify.com/drop](https://app.netlify.com/drop). Para
actualizarla hay que volver a arrastrarla en *Deploys* del sitio.
