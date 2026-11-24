# CLAUDE.md · Distrito YF App

App de **Distrito YF** (ropa de hombre, Uruguay, venta online: catálogo web + redes + pedido por código por WhatsApp): **Distrito YF Pedidos** (`index.html`) y **Distrito YF Gestión** (`gestion.html`).
Es una copia del molde de la app de otra tienda, con **cuentas, base y datos propios**. Los dos negocios son totalmente independientes: nunca mezclar datos, cuentas, claves ni números.

## Con quién trabajás
- Yoan (socio, con su primo Fernando) maneja todo y **no es técnico**. Respuestas cortas, en español rioplatense: qué hiciste y qué tiene que hacer él, paso a paso y muy simple. Términos en inglés, con su explicación en español entre paréntesis.
- Todo lo técnico que se pueda hacer con los accesos dados lo hace Claude. Yoan solo hace lo obligatorio (contraseñas, aprobar cosas en su cuenta).
- El plan y los datos están en el Project de claude.ai "Marca Ropa De Hombre": `receta-etapa-A.md`, `traspaso-marca-hombre (2).md`, `claude/distrito-datos-tecnicos.md`.
- Antes de borrar algo que no está en el plan, o de cualquier cambio que toque plata, preguntale a Yoan.

## Etapas
- **Etapa A (ahora):** Gestión: prendas, compras, stock con código de 4 cifras (0001…), etiquetas con código de barras. Base vacía.
- **Etapa B:** agente de WhatsApp con instrucciones propias (no se copia el de la otra tienda), plantillas propias, pedidos sin live, catálogo web público y "pedir por código" hacia WhatsApp.
- El módulo de live queda en el código pero no es la base del negocio. La cadetería (GrisalExpress) es de la otra tienda: no aplica (barrios vacíos, sin URL en Config).

## Reglas que no se rompen
1. **El repo es público.** Nunca claves, contraseñas, números de cuenta, RUT, teléfonos personales ni datos de clientes. En `negocio.js` las cuentas de cobro van solo por nombre (Prex, Mercado Pago, Efectivo); teléfono y RUT se cargan en ⚙️ Config (quedan en la base).
2. **Base:** Supabase `distrito-yf` (`bhtwuunoxkwesnjombuw`, São Paulo). Es la ÚNICA base de esta app. Nunca usar ni nombrar la base de la otra tienda. Las migraciones aplicadas: `base_esquema`, `base_stock`, `permisos_tablas_app`, `catalogo_fotos_y_lectura_publica` , `catalogo_contador_y_secciones` y `catalogo_eventos_qr_tarjeta` (proyectos nuevos de Supabase no dan permisos de tabla por defecto: toda tabla nueva necesita su `grant`) (copias en `supabase/migraciones/`; el esquema completo está en el Project como `base-esquema.txt`).
3. Todo cambio se prueba antes de publicar y queda en GitHub para poder volver atrás.

## Cómo se publica la app
Estática, servida por **GitHub Pages desde `main`** (`https://distritourbanoyf-stack.github.io/distrito-yf-app/`). Publicar = commit a `main` + push.
En cada publicación:
1. Cambiar el texto de `version.js` (`EMMA_VERSION`: fecha y qué cambió). Se ve en Config de Pedidos y Gestión.
2. Subir el número de `CACHE` en `sw.js` (`dyf-app-vNN`). Si se agrega un archivo, sumarlo a `ARCHIVOS` en `sw.js` y a los `<script>` de la página.
3. Probar antes (ver "Cómo probar").
4. Volver atrás: `git revert` del commit, subir `CACHE` y push.

## Cómo está armado el código
- `index.html` y `gestion.html` se editan **directo**.
- Orden de carga en Pedidos: `vendor/supabase` → `version.js` → `negocio.js` → `impresora.js` → `nube.js` → script de `index.html` → `despacho.js` → `pagos.js` → `vendor/qrcode` → `escaner.js` → `etiquetas.js` → `live.js` → `promos.js` → `pedidos4.js` → `mabel.js` → `mabeltab.js` → `stock.js` → `ventas.js`. Gestión: `vendor/supabase` → `qrcode` → `version.js` → `negocio.js` → `impresora.js` → `promos.js` → `nube.js` → script de `gestion.html`.
- Los `.js` **extienden** lo anterior: `const _x = f; f = function () { _x(); … }` y `Object.assign(ACT, {…})`. Antes de arreglar algo, buscá la última definición.
- Botones: `data-act` → `ACT`, `data-chg` → `CHG`, `data-inp` → `INP`.
- Nombres internos heredados (`emma_…` en `put()`/localStorage, `EMMA_VERSION`, tabla `clientas`, columna `clienta_id`, ajustes `emma.stock_mov`) quedan así: no se ven. Los textos visibles dicen "cliente" (es ropa de hombre).
- Datos: todo vive en Supabase. `nube.js` carga las tablas al entrar, detecta qué filas cambiaron cuando la app llama a `put('emma_…')` y las sube; si no hay internet, encola. Una fila que falta en memoria se sube como `borrado: true`: **nunca reemplazar `DB.lives`, `DB.clientes`, etc. por una copia vieja**.
- Si la base rechaza una fila, `nube.js` la aparta ("⚠️ N cambios sin guardar · tocá") y sigue con el resto.

## Ventas directas (la venta principal)
- `ventas.js`: la pestaña "🛒 Ventas" (internamente `data-t="live"`) abre en un registro fijo por mes: un live con `tipo: 'ventas'` y `mes: 'AAAA-MM'` ("Ventas · noviembre 2026"). Reusa todo el flujo de pedidos (código, pago, despacho). La fecha de pago se renueva sola (mañana). En Ventas se ocultan los envíos masivos de plantillas del live.
- Los lives son ocasionales: "🎥 Hacer un live" crea uno; "🛒 Volver a ventas" vuelve. Al abrir la app, si no hay un live de hoy, arranca en Ventas del mes.
- Pestañas: Ventas, Despacho, 💬 WhatsApp (antes Mabel; los textos dicen "el agente"), Clientes, Guardados, 🤝 En mano (antes Mostrador), Config.
- Colores: negro/blanco/gris (`--ac:#f2f2f2`); botones primarios con texto oscuro.

## Fotos y catálogo web
- Fotos: bucket público `fotos` de Supabase (solo fotos de prendas). Se suben desde Gestión → Stock → ficha del modelo → 📷 (la app las achica a 1400 px JPG). En el modelo se guardan las rutas en `m.fotos` (la primera es la portada); se ordenan arrastrando. Drive NO se usa para mostrar fotos.
- Estados: sin fotos → ✅ listo (fotos + nombre + precio) → 🌐 publicado (`m.publicado`). Botones Publicar / Despublicar. Aviso en la lista de los que tienen stock y no tienen fotos.
- Antes de que llegue la mercadería: en Historial, cada línea de una importación pedida tiene 📷 → crea el modelo (`m.porLlegar` = id de la compra, `l.mid` en la línea) para cargarle fotos, nombre y precio. La recepción usa ese modelo en la primera fila; al confirmar, los modelos listos se publican solos.
- Catálogo (`catalogo/index.html`): lee `catalogo_publico()` (rpc pública con la clave publishable): SOLO modelos publicados, activos, con fotos, con precio y con stock; devuelve num, nombre, categoría, precio, fotos y talles con disponible. Con `?demo=1` muestra datos de ejemplo. Falta: número de WhatsApp (`WHATSAPP` en el archivo).
- Toda tabla o función nueva expuesta a `anon` hay que revisarla: hoy `anon` solo puede insertar (tipo, modelo_id) en `catalogo_eventos` (tipos agregar_bolsa, pedir_whatsapp y qr_tarjeta; este último lo usa `ig/index.html`, el QR de la tarjeta que redirige a Instagram) y llamar `catalogo_publico()` y `catalogo_mas_pedidos()`.

## Compras traídas de afuera
- `config.importacionPendiente` (sin cifrar): al abrir Gestión con el código se convierte en compra "pedida" cifrada y se borra. `config.preciosPendientes` = { compraId, blue, uyu, costoImp, lineas: { lid: { precioImp, precioReal } } } carga precios a una compra ya convertida.
- Cada línea puede traer `sugerido` (nombre para el cliente), `cat` y `tt` (tipo de talle): la recepción los propone y se pueden editar. El nombre interno (`descripcion`) queda como alias del modelo; el cliente no lo ve.
- Catálogo: código de modelo con D adelante (D12) + talle.

## Stock
- **El número de stock lo maneja la base.** Cada fila de `movimientos` suma o resta en su fila de `stock` (trigger `aplicar_movimiento`). La app no puede escribir `datos.stock`; una fila nueva arranca en 0. Todo cambio de stock va con su movimiento (`mov()` en Gestión, `moverStock()` en Pedidos).
- Nunca menos de 0. Si se vende algo sin stock, la base agrega un movimiento `sin_stock` que la deja en 0.
- **Código de prenda:** 4 cifras, uno por talle, sube solo (0001, 0002…). Código de barras Code 128 con "P" adelante (`P0001`).
- Copia diaria dentro de la base: cron `copia-diaria` (06:17 UTC) → `privado.hacer_copia()`. Pendiente: copia también fuera de la base (Google Drive).

## Datos del negocio
- `negocio.js`: nombre, nombre en etiquetas, tarifa, recargo de Mercado Pago (10%), nombres de cuentas de cobro, horarios. Lo que se guarda en ⚙️ Config gana (`config.negocio` = { nombre, marca, tel, rut, ciudad }, `config.tarifaEnvio`, `config.mpRecargo`, `config.cuentasPago`).
- Etiqueta de agencia 10×15: logo de Distrito YF (`ETQ_IMG.logo`, negro). Íconos de la app: monograma YF blanco sobre negro.
- Categorías y talles (en `gestion.html`): `CATEGORIAS`, `TALLES` (letras S–XXXL, números 38–50, único) y `ORDEN_T` en `pedidos4.js`.
- Pruebas en la base real: la base es de prueba hasta que se cargue mercadería real. Borrar solo por id lo de prueba; nunca tocar `config.gestionAcceso` (es el código de acceso de Gestión).

## Cómo probar sin tocar la base
Servir la carpeta con un servidor local y, con Playwright, reemplazar `vendor/supabase-2.45.4.js` por un Supabase falso que devuelva datos de ejemplo y anote los `upsert`. Así se prueba que abren todas las pestañas sin errores. Además: `node --check` de cada `.js` y del script de cada `.html`.
