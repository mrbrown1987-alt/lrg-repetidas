# LRG Duplicates

Web estática (HTML/CSS/JS, sin build ni dependencias) con un **catálogo solo de cartas repetidas** de Limited Run Games, para que otros usuarios puedan consultar precios y contactar contigo.

## Qué incluye

- **826 cartas repetidas** sacadas de `Repetidas_LRG_todas_con_unidades_2026-11-11_sin_vendidas_final.xlsx`:
  - Serie 1: 318 · Serie 2: 254 · Serie 3: 139 · **Dreamcast: 115**.
- **Una entrada por carta y acabado**: si una carta existe en oro y plata, aparecen las dos; si hay varias unidades del mismo color, solo una.
- **Título y marco negros** por defecto; al seleccionar una carta se añade un **anillo metálico** plateado o dorado según el acabado, con globo **GOLD/SILVER**. Las Dreamcast llevan imagen genérica (logo sobre fondo blanco) y globo DREAMCAST hasta que hagas las fotos.
- **Globo de precio** arriba a la derecha de cada carta: precio final en **$**, convertido desde € (×1,10) y redondeado hacia arriba a múltiplos de 5.
- **Tema**: catálogo normal en negro/gris, con las pestañas de serie en rosa; el modo **Seleccionar cartas** y la vista **Selected** recuperan el rosa.
- **Orientación**: TC Manager marca 400 cartas apaisadas en `orientation.js`; 197 están en esta lista. El zoom las gira (`cw`/`ccw`) y las muestra en horizontal; el catálogo las mantiene verticales, como la app original.
- **Filtros**: serie (Todas / Serie 1 / 2 / 3 / **Dreamcast**), acabado (Todos / Oro / Plata), buscador y columnas.
- **Selección del visitante**: pulsa **Seleccionar cartas** y haz clic en las cartas para añadirlas; vuelve a pulsar el botón para terminar. Sin ese modo, al pulsar una carta se abre el **zoom** de la imagen; las cartas apaisadas etiquetadas en TC Manager se giran 90° y se muestran en formato ancho. Vista **Selected** con total, última seleccionada primero, vaciar y exportar CSV.
- **Solicitar precios**: formulario con email + Instagram o Reddit + comprobación humana. Envía el CSV de la selección a tu email vía **FormSubmit** (el email va en el action del formulario oculto; no se muestra en la interfaz).
- **Vista iPhone**: `preview-iphone.html`, un marco de iPhone con la web dentro (enlace en el pie).
- **Sin logo** dentro de la web.

## Ver en local

Sirve la carpeta por HTTP (necesario para probar la exportación CSV y el envío de emails):

```bash
cd lrg-repetidas
python3 -m http.server 8000
```

Abre <http://localhost:8000>. También puedes doble clic en `serve.command`.

> El catálogo y las imágenes funcionan abriendo `index.html` directamente; la exportación CSV y el envío de email necesitan `http(s)`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube **todo el contenido** de esta carpeta (incluye `images/`, `duplicates_data.js`, `config.js`, `vendor/`…).
   ```bash
   cd lrg-repetidas
   git init
   git add .
   git commit -m "LRG Duplicates"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main / (root) → Save**.
4. En unos minutos: `https://TU_USUARIO.github.io/TU_REPO/`.

> **Tamaño**: `images/` ocupa ~394 MB. GitHub Pages admite 1 GB, pero el primer push puede tardar. Solo se usan ~711 imágenes + el logo genérico de Dreamcast; si quieres, se puede recortar la carpeta para dejar únicamente las usadas.

## Configurar el envío de emails (FormSubmit)

El botón **Solicitar precios** envía el CSV a `kuharesma@gmail.com` con **FormSubmit**, sin backend ni cuenta.

El email ya está puesto en [`config.js`](config.js):

```js
window.LRG_CONFIG = {
  formsubmitEmail: 'kuharesma@gmail.com'
};
```

**Importante**: la primera vez que se envía, FormSubmit manda un correo de **confirmación** a `kuharesma@gmail.com`. Abre ese correo y pulsa el enlace de activación. A partir de ahí llegan todas las solicitudes.

El email aparece en el `action` del formulario oculto (código fuente), no en la interfaz.

**Qué recibe el email**: tu email de contacto (`kuharesma@gmail.com`) recibe un correo con el email del visitante, su Instagram/Reddit y el listado CSV completo (serie, número, acabado, rareza, nombre e imagen).

**Filtro anti-bots**: el visitante debe indicar un email válido + al menos un perfil (Instagram o Reddit) + resolver una suma sencilla. Además hay un campo trampa oculto (honeypot).

## Datos

- [`duplicates_data.js`](duplicates_data.js) — catálogo de repetidas (826 entradas). Es el archivo que carga la web.
- [`cards.json`](cards.json) — catálogo completo original (1.401 cartas), solo como referencia para regenerar.
- [`images/`](images/) — imágenes de las cartas y dorsos (`Back 1/2/3.jpeg`). Las Dreamcast usan `images/dreamcast-placeholder.svg`.

Si cambias la lista de repetidas, hay que regenerar `duplicates_data.js` a partir del Excel.

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página principal (catálogo + selección) |
| `styles.css` | Estilos, barras oro/plata/Dreamcast, sticky opaco |
| `app.js` | Lógica: filtros, carrito, visor, exportación, formulario |
| `config.js` | Email de FormSubmit |
| `duplicates_data.js` | Datos de las 826 repetidas |
| `preview-iphone.html` | Vista previa en marco de iPhone |
| `images/` | Imágenes de cartas, dorsos y logo genérico Dreamcast |

## Notas

- GitHub Pages distingue mayúsculas/minúsculas: las imágenes `197_s.jpg` y `279_s.jpg` se renombraron a `197_S.jpg` y `279_S.jpg`.
- La cabecera, la barra de filtros y la barra de selección son **opacas**: al hacer scroll no se ven cartas por debajo.
- No hay backend ni cuentas. La selección se guarda en `localStorage` del navegador del visitante.
- Los dorsos se buscan como `Back 1.jpeg`, `Back 2.jpeg`, `Back 3.jpeg`. Las Dreamcast no tienen dorso.
