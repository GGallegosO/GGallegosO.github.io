# Portafolio personal — Gustavo Gallegos

Landing page minimalista para un perfil de desarrollador fullstack. Construida con HTML, CSS y JavaScript puro, sin frameworks ni paso de build. Incluye tema claro/oscuro, diseño responsive, sección de proyectos escalable y formulario de contacto.

## Demo

- Sitio final: <https://gustavog.is-a.dev> (se configura después de publicar)
- GitHub Pages: <https://ggallegoso.github.io> (se publica en el paso de GitHub Pages)

## Stack

- HTML5 semántico
- CSS3 con custom properties y media queries
- JavaScript vanilla (ES6+)
- GitHub Pages para hosting
- Web3Forms para el formulario de contacto

## Estructura

```text
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
│       ├── avatar.jpg
│       ├── og-image.png
│       ├── apple-touch-icon.png
│       └── projects/
├── data/
│   └── projects.json
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── README.md
└── GUIA.md
```

## Desarrollo local

El sitio no necesita instalación de dependencias. Para verlo correctamente, usa un servidor local (no abras `index.html` directamente, porque `fetch` de `data/projects.json` se bloquea en `file://`):

```bash
# Opción 1: con Node.js
npx serve .

# Opción 2: con Python
python3 -m http.server 8000
```

Luego abre <http://localhost:3000> o <http://localhost:8000>.

## Agregar proyectos

Edita `data/projects.json` con un array de objetos:

```json
[
  {
    "title": "Nombre del proyecto",
    "description": "Qué problema resuelve y qué hiciste.",
    "tech": ["Node.js", "Express", "MySQL"],
    "repo": "https://github.com/GGallegosO/repo",
    "demo": "https://demo.com",
    "image": "assets/img/projects/repo.webp"
  }
]
```

Los campos `demo` e `image` son opcionales. Si no hay imagen, la tarjeta genera una portada con las iniciales del proyecto. Si el array está vacío, se muestra el estado "Portafolio en construcción".

## Formulario de contacto

El formulario usa [Web3Forms](https://web3forms.com/). Para activarlo:

1. Entra a Web3Forms y genera una `access_key` con tu correo.
2. Reemplaza el valor `REEMPLAZA_CON_TU_ACCESS_KEY` en `index.html`.
3. Prueba el formulario desde el sitio publicado.

Mientras no configures la clave, el JavaScript abre el cliente de correo con un `mailto:` como respaldo.

## Publicación en GitHub Pages

1. Crea un repositorio público llamado `GGallegosO.github.io`.
2. Sube el contenido de este proyecto a la rama `main`.
3. En GitHub, ve a **Settings → Pages** y elige **Deploy from a branch → main → / (root)**.
4. Espera a que GitHub Pages publique el sitio en <https://ggallegoso.github.io>.

## Dominio gratuito con is-a.dev

El sitio está preparado para usar `gustavog.is-a.dev`. El proceso completo, incluyendo el PR y la configuración de DNS, está explicado en [GUIA.md](GUIA.md).

## Documentación

- [GUIA.md](GUIA.md): guía educativa paso a paso para replicar el proyecto sin IA.
- [web3forms.com](https://web3forms.com/)
- [docs.github.com/pages](https://docs.github.com/en/pages)
- [docs.is-a.dev](https://docs.is-a.dev)

## Licencia

Proyecto personal de Gustavo Gallegos. Puedes tomar la estructura y adaptarla a tu propio portafolio.
