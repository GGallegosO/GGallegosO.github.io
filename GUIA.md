# Guía completa: crea y publica tu portafolio con GitHub Pages e is-a.dev

Esta guía documenta cómo está construido este portafolio y cómo replicarlo desde cero, sin depender de inteligencia artificial. Está pensada para alguien que ya conoce lo básico de HTML, CSS y JavaScript, y que quiere publicar un sitio personal gratuito con un dominio propio.

> **Ejemplo real:** este repositorio usa `GGallegosO.github.io` como repositorio y `gustavog.is-a.dev` como dominio final. Donde veas `<tu-usuario>`, `<tu-subdominio>` o `tu@email.com`, reemplázalo por tus datos.

---

## Índice

1. [Qué vas a construir](#1-qué-vas-a-construir)
2. [Conceptos que conviene entender](#2-conceptos-que-conviene-entender)
3. [Requisitos](#3-requisitos)
4. [Prepara la carpeta del proyecto](#4-prepara-la-carpeta-del-proyecto)
5. [Estructura de archivos](#5-estructura-de-archivos)
6. [HTML: contenido y semántica](#6-html-contenido-y-semántica)
7. [CSS: diseño, temas y responsive](#7-css-diseño-temas-y-responsive)
8. [JavaScript: interacción sin frameworks](#8-javascript-interacción-sin-frameworks)
9. [Prueba el sitio en local](#9-prueba-el-sitio-en-local)
10. [Publica en GitHub Pages](#10-publica-en-github-pages)
11. [Consigue un subdominio gratis con is-a.dev](#11-consigue-un-subdominio-gratis-con-is-adev)
12. [Configura el formulario con Web3Forms](#12-configura-el-formulario-con-web3forms)
13. [Agrega tus proyectos](#13-agrega-tus-proyectos)
14. [Mantenimiento y mejoras](#14-mantenimiento-y-mejoras)
15. [Solución de problemas](#15-solución-de-problemas)
16. [Checklist final](#16-checklist-final)
17. [Recursos](#17-recursos)

---

## 1. Qué vas a construir

Una landing page de una sola página con:

- Presentación personal y pitch profesional.
- Sección "Sobre mí".
- Stack técnico agrupado por áreas.
- Formación y enfoque actual.
- Sección de proyectos que se llena desde un archivo JSON.
- Formulario de contacto sin backend.
- Tema claro/oscuro persistente.
- Diseño responsive y accesible.
- SEO básico: metadatos, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml`.

El sitio es **estático**: no hay servidor Node corriendo en producción, no hay base de datos y no hay paso de build. GitHub Pages solo entrega archivos HTML, CSS, JS e imágenes.

### ¿Por qué no usar un framework?

Para una landing de una página, HTML/CSS/JS es suficiente y tiene ventajas concretas:

- Carga rápida.
- Cero dependencias que actualizar.
- Deploy directo desde la rama `main`.
- Menos cosas que pueden romperse.
- Es más fácil de entender si recién empiezas.

Si más adelante quieres un blog o decenas de páginas de proyectos, **Astro** es una buena migración: sigue generando un sitio estático y permite escribir contenido en Markdown.

---

## 2. Conceptos que conviene entender

### Sitio estático

Son archivos que el navegador recibe tal cual: `index.html`, `styles.css`, `main.js`, imágenes. No hay código de servidor que se ejecute en cada visita. Por eso puede alojarse gratis en GitHub Pages, Cloudflare Pages, Netlify o Vercel.

### GitHub Pages

Servicio de hosting gratuito para repositorios de GitHub. Hay dos tipos de sitio:

| Tipo | Repositorio | URL |
|---|---|---|
| User site | `<usuario>.github.io` | `https://<usuario>.github.io` |
| Project site | cualquier otro nombre | `https://<usuario>.github.io/<repo>` |

Para este proyecto conviene un **user site**: el repositorio debe llamarse exactamente `<usuario>.github.io` y el sitio queda en la raíz del dominio.

### DNS, CNAME y HTTPS

- **DNS**: sistema que traduce un dominio a un servidor.
- **CNAME**: registro que dice "este subdominio apunta a otro dominio". Para GitHub Pages, el CNAME debe apuntar a `<usuario>.github.io`, sin el nombre del repositorio.
- **HTTPS**: GitHub Pages emite un certificado gratuito cuando el dominio está bien configurado. Después se activa "Enforce HTTPS".

### is-a.dev

Servicio gratuito que entrega subdominios `*.is-a.dev` a desarrolladores. No es automático: se solicita con un Pull Request y un maintainer lo revisa. Requisitos importantes:

- El sitio debe estar publicado y tener contenido real.
- Debe ser un sitio personal o un proyecto de software, no comercial.
- La solicitud se escribe a mano; ellos piden explícitamente **no usar IA** para generar el PR.

### Web3Forms

Servicio que recibe formularios sin backend. Le das un `access_key` público a tu HTML y él reenvía el mensaje a tu correo. La clave es pública por diseño: no sirve para enviar correos masivos sin pasar por sus filtros.

---

## 3. Requisitos

- Cuenta de GitHub.
- Git instalado.
- Un editor de código (VS Code, por ejemplo).
- Un navegador moderno.
- Node.js **opcional**, solo para levantar un servidor local con `npx serve`.
- Una imagen de perfil (puede ser tu avatar de GitHub).

Comprueba las versiones:

```bash
git --version
node --version   # opcional
```

---

## 4. Prepara la carpeta del proyecto

Crea la carpeta y la estructura base:

```bash
mkdir mi-portafolio
cd mi-portafolio

mkdir -p assets/css assets/js assets/img/projects data

touch index.html
touch assets/css/styles.css
touch assets/js/main.js
touch data/projects.json
```

Inicializa Git:

```bash
git init -b main
```

Si es tu primer repositorio, configura tu identidad. Si no quieres exponer tu correo personal en los commits, usa el correo noreply de GitHub:

```bash
git config user.name "Tu Nombre"
git config user.email "<ID>+<tu-usuario>@users.noreply.github.com"
```

Puedes encontrar tu ID en la API de GitHub:

```bash
curl -s https://api.github.com/users/<tu-usuario> | grep '"id"'
```

---

## 5. Estructura de archivos

```text
.
├── index.html              # Toda la estructura y el contenido
├── assets/
│   ├── css/
│   │   └── styles.css      # Diseño, temas y responsive
│   ├── js/
│   │   └── main.js         # Tema, navegación, proyectos y formulario
│   └── img/
│       ├── avatar.jpg
│       ├── og-image.png    # Imagen para compartir en redes
│       ├── apple-touch-icon.png
│       └── projects/       # Capturas de proyectos
├── data/
│   └── projects.json       # Datos de los proyectos
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── README.md
└── GUIA.md
```

Cada archivo tiene una responsabilidad clara. Esto facilita encontrar errores y mantener el sitio sin herramientas extra.

---

## 6. HTML: contenido y semántica

### 6.1 Esqueleto mínimo

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tu Nombre | Desarrollador Fullstack</title>
  <meta name="description" content="Portafolio de ...">
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <!-- contenido -->
  <script src="assets/js/main.js" defer></script>
</body>
</html>
```

Puntos importantes:

- `lang="es"` ayuda a lectores de pantalla y buscadores.
- `viewport` es obligatorio para que el diseño responsive funcione.
- `defer` hace que el JavaScript se ejecute después de parsear el HTML.

### 6.2 Metadatos y SEO

En el `<head>` agrega:

```html
<link rel="canonical" href="https://<tu-subdominio>.is-a.dev/">

<meta property="og:type" content="website">
<meta property="og:url" content="https://<tu-subdominio>.is-a.dev/">
<meta property="og:title" content="Tu Nombre | Desarrollador Fullstack">
<meta property="og:description" content="Descripción breve de tu perfil.">
<meta property="og:image" content="https://<tu-subdominio>.is-a.dev/assets/img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
```

La imagen Open Graph debe medir **1200 × 630 px**. Es la que aparece cuando compartes el enlace en LinkedIn, WhatsApp, Discord o X.

También puedes agregar datos estructurados para que los buscadores entiendan quién eres:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tu Nombre",
  "jobTitle": "Desarrollador Fullstack",
  "url": "https://<tu-subdominio>.is-a.dev/",
  "sameAs": [
    "https://github.com/<tu-usuario>",
    "https://www.linkedin.com/in/<tu-perfil>/"
  ]
}
</script>
```

### 6.3 Script del tema antes del CSS

El tema claro/oscuro debe aplicarse antes del primer renderizado para evitar un destello blanco. Coloca este script en el `<head>`, antes de la hoja de estilos:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = stored === 'light' || stored === 'dark'
        ? stored
        : (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (error) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    document.documentElement.classList.add('js');
  })();
</script>
```

La clase `js` permite aplicar animaciones solo cuando JavaScript está disponible. Si falla, el contenido se ve igual.

### 6.4 Accesibilidad desde el inicio

Incluye un enlace para saltar al contenido:

```html
<a class="skip-link" href="#contenido">Saltar al contenido</a>
```

Y usa HTML semántico:

```html
<header>...</header>
<main id="contenido">
  <section aria-labelledby="sobre-mi-title">
    <h2 id="sobre-mi-title">Sobre mí</h2>
  </section>
</main>
<footer>...</footer>
```

Buenas prácticas:

- Un solo `<h1>` por página.
- Jerarquía de encabezados sin saltos.
- `alt` descriptivo en imágenes con contenido.
- `aria-label` en botones que solo tienen íconos.
- `aria-expanded` en el botón del menú móvil.
- `aria-live="polite"` en el estado del formulario.
- No uses `div` para todo: `nav`, `main`, `section`, `article`, `footer` comunican estructura.

### 6.5 Formulario

```html
<form id="contact-form"
      action="https://api.web3forms.com/submit"
      method="POST"
      data-fallback-email="tu@email.com">
  <input type="hidden" name="access_key" value="REEMPLAZA_CON_TU_ACCESS_KEY">
  <input type="hidden" name="subject" value="Nuevo mensaje desde mi portafolio">
  <input type="checkbox" name="botcheck" hidden>

  <label for="name">Nombre</label>
  <input id="name" name="name" type="text" autocomplete="name" required>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="email" required>

  <label for="message">Mensaje</label>
  <textarea id="message" name="message" rows="5" required></textarea>

  <button type="submit">Enviar mensaje</button>
  <p id="form-status" role="status" aria-live="polite"></p>
</form>
```

Cada campo tiene su `<label>`. El `checkbox` oculto es un honeypot: si un bot lo marca, el mensaje se descarta.

---

## 7. CSS: diseño, temas y responsive

### 7.1 Variables y temas

Define los colores y tipografías en `:root` y sobreescríbelos en `[data-theme="dark"]`:

```css
:root {
  color-scheme: light;
  --bg: #ffffff;
  --text: #1f2328;
  --text-muted: #59636e;
  --accent: #0969da;
  --border: #d8dee4;
  --surface: #ffffff;
  --radius: 1rem;
}

[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0d1117;
  --text: #e6edf3;
  --text-muted: #9aa4af;
  --accent: #58a6ff;
  --border: #30363d;
  --surface: #161b22;
}
```

Ventajas:

- Cambiar el tema es cambiar un atributo en `<html>`.
- Todos los componentes usan las mismas variables.
- No hay que duplicar reglas para cada tema.

`color-scheme` hace que los controles nativos (scrollbars, inputs) se adapten.

### 7.2 Reset y base

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
}

img {
  display: block;
  max-width: 100%;
}
```

No uses alturas fijas para bloques de texto: el contenido debe poder crecer.

### 7.3 Layout

```css
.container {
  width: min(1120px, calc(100% - 2.5rem));
  margin-inline: auto;
}

.section {
  padding-block: clamp(4rem, 8vw, 7rem);
}
```

`min()` y `clamp()` permiten que el diseño se adapte sin escribir muchas media queries.

### 7.4 Responsive

Un enfoque simple:

```css
.hero__grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 4rem;
}

@media (max-width: 980px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }
}
```

Buenas prácticas:

- Diseña primero para móvil o al menos prueba en 360 px.
- Usa `minmax(0, 1fr)` en grids para evitar desbordes.
- No escondas contenido importante solo por espacio; reorganízalo.
- Prueba en 360, 390, 768, 1024 y 1440 px.

### 7.5 Menú móvil

En escritorio, la navegación es una fila. En móvil se convierte en un panel:

```css
@media (max-width: 780px) {
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .nav.is-open {
    display: flex;
  }

  .nav-toggle {
    display: inline-flex;
  }
}
```

El botón cambia `aria-expanded` y la clase `is-open`. El JavaScript se encarga de cerrar el menú al hacer clic en un enlace o al presionar `Escape`.

### 7.6 Animaciones de entrada

```css
.js .reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.js .reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

La clase `.js` se agrega en el `<head>`. Si JavaScript no carga, los elementos no se ocultan.

Respeta la preferencia de movimiento reducido:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .js .reveal {
    opacity: 1;
    transform: none;
  }
}
```

### 7.7 Foco visible

Nunca elimines el foco sin reemplazarlo:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

Esto es clave para quienes navegan con teclado.

### 7.8 El atributo `hidden`

Si usas `hidden` en un elemento que también tiene `display: grid` o `display: flex`, el CSS puede ganarle al estilo del navegador. Agrega:

```css
[hidden] {
  display: none !important;
}
```

Es un detalle pequeño que evita bugs difíciles de encontrar.

---

## 8. JavaScript: interacción sin frameworks

Organiza el código en una IIFE para no contaminar el scope global:

```js
(() => {
  'use strict';

  // ...
})();
```

### 8.1 Tema claro/oscuro

```js
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

const getTheme = () => root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

const syncUI = () => {
  const isDark = getTheme() === 'dark';
  toggle.setAttribute('aria-pressed', String(isDark));
  toggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
};

toggle.addEventListener('click', () => {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncUI();
});

syncUI();
```

Además, escucha los cambios del sistema si el usuario nunca eligió manualmente:

```js
const system = window.matchMedia('(prefers-color-scheme: dark)');

system.addEventListener('change', (event) => {
  if (!localStorage.getItem('theme')) {
    root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    syncUI();
  }
});
```

### 8.2 Menú móvil accesible

```js
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');

const closeNav = () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
};

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNav();
});
```

### 8.3 Animaciones con IntersectionObserver

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});
```

Si el navegador no soporta `IntersectionObserver`, agrega la clase `is-visible` a todos los elementos. El contenido nunca debe quedar invisible.

### 8.4 Proyectos desde JSON

```js
async function loadProjects() {
  const response = await fetch('data/projects.json');
  const projects = await response.json();

  if (!Array.isArray(projects) || projects.length === 0) {
    return; // se mantiene el estado vacío
  }

  // renderizar tarjetas...
}
```

Dos detalles importantes:

1. **Escapa el HTML** antes de insertarlo con `innerHTML`. Si un proyecto tiene `<script>` en el título, no debe ejecutarse.
2. **Maneja errores**: si el JSON no existe o es inválido, muestra el estado vacío y revisa la consola.

### 8.5 Formulario

El flujo es:

1. Detener el envío por defecto con `preventDefault()`.
2. Validar que los campos no estén vacíos.
3. Revisar el honeypot.
4. Si hay `access_key`, enviar con `fetch`.
5. Si no hay clave, abrir un `mailto:` como respaldo.
6. Mostrar el resultado en un `role="status"`.

```js
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = new FormData(form);

  if (data.get('botcheck')) return;

  const response = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' }
  });

  const result = await response.json();

  if (response.ok && result.success) {
    form.reset();
    status.textContent = '¡Mensaje enviado!';
  } else {
    status.textContent = 'No se pudo enviar. Intenta de nuevo.';
  }
});
```

No confíes solo en la validación del navegador: valida también en el servidor o servicio que recibe el formulario.

### 8.6 Año del footer

```js
document.getElementById('year').textContent = new Date().getFullYear();
```

Así no tienes que actualizar el año manualmente cada enero.

### 8.7 ¿Por qué no un framework?

Para esta escala, un framework agrega:

- Dependencias.
- Build y configuración.
- Más superficie de error.
- Más peso para el usuario.

Si el sitio crece, migrar a Astro es razonable. Para una landing, JavaScript vanilla es suficiente.

---

## 9. Prueba el sitio en local

No abras `index.html` haciendo doble clic. El navegador usa el protocolo `file://` y bloquea `fetch('data/projects.json')` por seguridad. Levanta un servidor:

```bash
# Opción 1: Node.js
npx serve .

# Opción 2: Python
python3 -m http.server 8000
```

Abre la URL que indique la terminal.

### Checklist de prueba

- [ ] La consola no muestra errores.
- [ ] La pestaña Network no tiene archivos 404.
- [ ] El tema cambia y se mantiene al recargar.
- [ ] El menú móvil abre, cierra y responde a `Escape`.
- [ ] El sitio se ve bien en 360, 390, 768, 1024 y 1440 px.
- [ ] Los enlaces abren en una pestaña nueva cuando corresponde.
- [ ] El formulario muestra un mensaje de éxito o error.
- [ ] La navegación con teclado funciona.
- [ ] `prefers-reduced-motion` desactiva las animaciones.

### Herramientas útiles

- **Lighthouse** en Chrome DevTools: rendimiento, accesibilidad, buenas prácticas y SEO.
- **W3C Validator**: <https://validator.w3.org/>
- **Responsive Design Mode** en Firefox o DevTools de Chrome.

---

## 10. Publica en GitHub Pages

### 10.1 Crea el repositorio

1. Entra a <https://github.com/new>.
2. Nombre: `<tu-usuario>.github.io` (exacto, en minúsculas si tu usuario lo está).
3. Visibilidad: **Public**. GitHub Pages gratuito para repositorios privados requiere plan Pro.
4. No marques "Add a README", "Add .gitignore" ni "Choose a license". Ya tienes archivos locales.

### 10.2 Conecta Git con GitHub

**Opción A: SSH (recomendada)**

Genera una clave si no tienes:

```bash
ssh-keygen -t ed25519 -C "tu@email.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
pbcopy < ~/.ssh/id_ed25519.pub
```

En GitHub: **Settings → SSH and GPG keys → New SSH key**, pega la clave y guarda.

Prueba la conexión:

```bash
ssh -T git@github.com
```

Debe responder con un mensaje como `Hi <tu-usuario>! You've successfully authenticated`.

Agrega el remoto:

```bash
git remote add origin git@github.com:<tu-usuario>/<tu-usuario>.github.io.git
git push -u origin main
```

**Opción B: HTTPS**

```bash
git remote add origin https://github.com/<tu-usuario>/<tu-usuario>.github.io.git
git push -u origin main
```

GitHub ya no acepta tu contraseña normal. Debes usar un **Personal Access Token** como contraseña. Créalo en **Settings → Developer settings → Personal access tokens**.

### 10.3 Activa GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En **Source**, elige **Deploy from a branch**.
3. Branch: `main`; carpeta: `/ (root)`.
4. Guarda.
5. Espera uno o dos minutos. La URL aparecerá en la misma pantalla.

Verifica que `https://<tu-usuario>.github.io` cargue el sitio.

### 10.4 Errores comunes

- El repositorio no se llama exactamente `<tu-usuario>.github.io`.
- `index.html` no está en la raíz.
- Elegiste la carpeta incorrecta en Pages.
- El repositorio es privado y tu plan no incluye Pages.
- Todavía no terminó el build; revisa la pestaña **Actions**.

---

## 11. Consigue un subdominio gratis con is-a.dev

### 11.1 Antes de solicitar

is-a.dev pide:

- Un sitio ya publicado y con contenido real.
- Que sea personal o un proyecto de software, no comercial.
- Una solicitud escrita por ti, no generada con IA.

Por eso el orden correcto es: **primero GitHub Pages, después is-a.dev**.

### 11.2 Comprueba disponibilidad

Puedes probar con `dig`:

```bash
dig +short <tu-subdominio>.is-a.dev CNAME
```

Si no devuelve nada, probablemente esté libre, pero la confirmación real ocurre al revisar el repositorio de registro. También puedes abrir `https://<tu-subdominio>.is-a.dev` y ver si redirige a la página de disponibilidad.

### 11.3 Crea el archivo de solicitud

1. Haz fork de <https://github.com/is-a-dev/register>.
2. En tu fork, entra a la carpeta `domains/`.
3. Crea un archivo llamado `<tu-subdominio>.json`.
4. Contenido:

```json
{
  "owner": {
    "username": "<tu-usuario>"
  },
  "records": {
    "CNAME": "<tu-usuario>.github.io"
  }
}
```

Ejemplo real:

```json
{
  "owner": {
    "username": "GGallegosO"
  },
  "records": {
    "CNAME": "ggallegoso.github.io"
  }
}
```

El CNAME apunta al dominio de GitHub Pages, **sin** el nombre del repositorio.

### 11.4 Abre el Pull Request

1. Haz commit y push en tu fork.
2. Abre un PR contra `is-a-dev/register`.
3. Completa la plantilla del PR.
4. Incluye la URL de tu sitio y una captura de pantalla.
5. Explica brevemente qué es el sitio.

No reemplaces la plantilla por un texto genérico. No uses IA para redactar la solicitud: la comunidad revisa que sea coherente y clara. Si hay cambios solicitados, respóndelos en el mismo PR.

### 11.5 Después del merge

Cuando el PR sea aprobado y fusionado:

1. Ve a tu repositorio en GitHub.
2. **Settings → Pages → Custom domain**.
3. Escribe `<tu-subdominio>.is-a.dev` y guarda.
4. GitHub creará un archivo `CNAME` en la raíz del repositorio.
5. Marca **Enforce HTTPS**. Puede tardar hasta 24 horas en estar disponible.

Verifica el DNS:

```bash
dig +short <tu-subdominio>.is-a.dev CNAME
```

Debería devolver algo como:

```text
<tu-usuario>.github.io.
```

### 11.6 Verificación opcional del dominio

GitHub recomienda verificar el dominio para evitar que otra persona lo use en otro repositorio si tu sitio se desactiva.

1. En GitHub: **Settings → Pages → Add a domain**.
2. Copia el hostname y el valor TXT.
3. Crea otro archivo en `domains/` del fork de is-a.dev con ese registro TXT.
4. Abre otro PR.
5. Cuando se fusione, vuelve a GitHub y presiona **Verify**.

### 11.7 Errores comunes con is-a.dev

- **404 después del merge**: todavía no configuraste el custom domain en GitHub Pages.
- **El sitio sigue en github.io**: el DNS puede tardar; espera y revisa el CNAME.
- **HTTPS no disponible**: espera; GitHub debe emitir el certificado.
- **"Domain already taken"**: el dominio está configurado en otro repositorio. Remuévelo allí primero.
- **PR rechazado**: sitio incompleto, uso comercial, JSON inválido o falta de screenshot.
- **No agregues un CNAME comodín** (`*.is-a.dev`): aumenta el riesgo de domain takeover.

---

## 12. Configura el formulario con Web3Forms

### 12.1 Obtén la clave

1. Entra a <https://web3forms.com/>.
2. Ingresa tu correo.
3. Recibirás un `access_key`.

### 12.2 Reemplaza el placeholder

En `index.html`:

```html
<input type="hidden" name="access_key" value="REEMPLAZA_CON_TU_ACCESS_KEY">
```

Cámbialo por:

```html
<input type="hidden" name="access_key" value="TU_ACCESS_KEY_REAL">
```

### 12.3 Cómo funciona

- El formulario hace `POST` a `https://api.web3forms.com/submit`.
- Web3Forms valida la clave y reenvía el mensaje a tu correo.
- El campo `botcheck` es un honeypot.
- El JavaScript muestra el resultado sin recargar la página.

### 12.4 Prueba

1. Publica el sitio o usa el servidor local.
2. Envía un mensaje real.
3. Revisa tu correo y la carpeta de spam.
4. Revisa la consola y la pestaña Network si algo falla.

### 12.5 Privacidad

La `access_key` es pública: está en el HTML. No la uses para datos sensibles ni para enviar correos masivos. Para un formulario de contacto personal, es suficiente.

Alternativas: Formspree, Netlify Forms (si usas Netlify), o una API propia con Express y Nodemailer/Resend.

---

## 13. Agrega tus proyectos

### 13.1 Formato del JSON

`data/projects.json` debe ser un array:

```json
[
  {
    "title": "Nombre del proyecto",
    "description": "Qué problema resuelve, qué hiciste y qué aprendiste.",
    "tech": ["Node.js", "Express", "MySQL"],
    "repo": "https://github.com/<tu-usuario>/<repo>",
    "demo": "https://demo.com",
    "image": "assets/img/projects/<repo>.webp"
  }
]
```

Reglas:

- `title` y `description` son obligatorios.
- `tech` es un array de strings.
- `repo` y `demo` son opcionales.
- `image` es opcional; si falta, se genera una portada con las iniciales.

### 13.2 Imágenes

- Formato recomendado: WebP o JPEG.
- Relación de aspecto: 16:9.
- Tamaño: 1280 × 720 px aproximadamente.
- Peso: idealmente menos de 300 KB.
- Guarda las imágenes en `assets/img/projects/`.

Si usas capturas, evita datos personales, correos, tokens o credenciales visibles.

### 13.3 Publica los cambios

```bash
git add data/projects.json assets/img/projects/
git commit -m "feat: agrega proyecto X"
git push
```

GitHub Pages se actualiza automáticamente al hacer push a `main`.

### 13.4 SEO de los proyectos

Las tarjetas se renderizan con JavaScript. Google suele ejecutar JavaScript, pero no es tan fiable como el HTML estático. Si necesitas SEO fuerte para cada proyecto, considera:

- Escribir las tarjetas directamente en el HTML.
- Migrar a Astro y generar páginas estáticas por proyecto.
- Agregar un paso de build que convierta el JSON en HTML.

Para un portafolio personal, el enfoque actual es suficiente.

---

## 14. Mantenimiento y mejoras

### Actualiza el contenido

- Cambia el texto de "Sobre mí" cuando avances.
- Agrega proyectos cuando los termines.
- Actualiza `sitemap.xml` con la fecha `lastmod`.
- Revisa los enlaces de GitHub y LinkedIn.

### Mejoras posibles

- Agregar un blog con Astro o Markdown.
- Agregar una página de "detalle" por proyecto.
- Agregar modo de idioma ES/EN.
- Agregar analítica respetuosa de la privacidad (Plausible, Umami).
- Agregar un botón para descargar el CV en PDF.
- Agregar un tema con más acentos visuales.
- Migrar a un dominio propio (`tudominio.dev`) si quieres más control.

### Cuándo migrar a un framework

- Tienes un blog o contenido que crece.
- Necesitas decenas de páginas.
- Quieres componentes reutilizables.
- Quieres generar páginas de proyecto con SEO estático.

Astro es la opción más natural porque sigue produciendo un sitio estático y despliega igual en GitHub Pages, pero con un paso de build.

---

## 15. Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| 404 en GitHub Pages | Repo mal nombrado, branch incorrecta o falta `index.html` | Revisa Settings → Pages y la pestaña Actions |
| CSS o JS no cargan | Ruta incorrecta o mayúsculas distintas | Usa rutas relativas y respeta mayúsculas/minúsculas |
| Destello de tema al cargar | El tema se aplica después del CSS | Mantén el script inline en el `<head>` antes del stylesheet |
| Proyectos no aparecen | JSON vacío, inválido o `fetch` bloqueado | Usa un servidor local y valida el JSON |
| Formulario no envía | Falta la `access_key` o hay error de red | Revisa el valor, la consola y la pestaña Network |
| HTTPS no disponible | El certificado aún no se emitió | Espera hasta 24 h y verifica el DNS |
| El dominio no resuelve | DNS no propagado | Espera y ejecuta `dig` |
| is-a.dev rechaza el PR | Sitio incompleto o solicitud generada con IA | Completa el sitio y escribe el PR tú mismo |
| `git push` rechazado | El remoto tiene commits que no tienes | `git pull --rebase origin main` y vuelve a intentar |
| El sitio se ve distinto en producción | Caché del navegador o rutas absolutas | Recarga sin caché y usa rutas relativas |
| El menú móvil no cierra | Falta el listener de `Escape` o de clic fuera | Revisa `main.js` y el estado `aria-expanded` |
| Las animaciones no se ven | `.js` no se agregó o `IntersectionObserver` no existe | Verifica la consola y el fallback |

---

## 16. Checklist final

### Contenido

- [ ] Nombre, rol y pitch actualizados.
- [ ] Email correcto.
- [ ] GitHub y LinkedIn correctos.
- [ ] Texto de "Sobre mí" revisado.
- [ ] Stack actualizado.
- [ ] Formación y enfoque actualizados.
- [ ] Avatar optimizado.
- [ ] Imagen Open Graph creada.

### Técnica

- [ ] Sin errores en la consola.
- [ ] Sin archivos 404 en Network.
- [ ] Tema claro/oscuro persistente.
- [ ] Menú móvil accesible.
- [ ] Responsive probado en varios tamaños.
- [ ] Navegación por teclado.
- [ ] Foco visible.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Metadatos, canonical y JSON-LD.
- [ ] `robots.txt` y `sitemap.xml`.
- [ ] Formulario probado con un envío real.
- [ ] `data/projects.json` válido.

### Publicación

- [ ] Repositorio `<tu-usuario>.github.io` público.
- [ ] Sitio funcionando en `https://<tu-usuario>.github.io`.
- [ ] PR de is-a.dev fusionado.
- [ ] Custom domain configurado.
- [ ] Enforce HTTPS activo.
- [ ] Dominio verificado en GitHub (opcional pero recomendado).
- [ ] Lighthouse revisado.

---

## 17. Recursos

- **MDN Web Docs**: <https://developer.mozilla.org/es/>
- **GitHub Pages**: <https://docs.github.com/en/pages>
- **is-a.dev**: <https://is-a.dev/> · <https://docs.is-a.dev>
- **Repositorio de registro**: <https://github.com/is-a-dev/register>
- **Web3Forms**: <https://web3forms.com/>
- **Schema.org Person**: <https://schema.org/Person>
- **W3C Validator**: <https://validator.w3.org/>
- **web.dev**: <https://web.dev/>
- **Lighthouse**: <https://developer.chrome.com/docs/lighthouse/overview/>

---

## Nota final

Este proyecto prioriza claridad sobre cantidad de herramientas. La combinación de HTML, CSS, JavaScript y GitHub Pages es suficiente para un portafolio personal, y deja espacio para crecer cuando haga falta.

Si algo no funciona, abre la consola, revisa la pestaña Network y comprueba el HTML generado. La mayoría de los problemas en un sitio estático están en una ruta mal escrita, un archivo que no se subió o un JSON inválido.
