# Distrito YF App

Distrito YF Pedidos (`index.html`) y Distrito YF Gestión (`gestion.html`). Marca de ropa de hombre, Uruguay.
Copia del molde de otra app en producción, con cuentas y base propias.

Las reglas de trabajo y publicación están en `CLAUDE.md`.

## Archivos
- `index.html` y `gestion.html`: se editan directo.
- `negocio.js`: datos del negocio (nombre, tarifas, nombres de cuentas de cobro, horarios). Lo que se guarde en ⚙️ Config gana.
- `nube.js`: sincroniza con Supabase. `despacho.js`: pestaña Despacho. `pagos.js`: control de pagos del día. `escaner.js`: cámara y QR. `etiquetas.js`, `live.js`, `promos.js`, `pedidos4.js`, `mabel.js`, `mabeltab.js`: el resto de Pedidos.

## Versión
`version.js` (`EMMA_VERSION`, nombre interno) la muestran Pedidos y Gestión. En cada publicación: cambiarla y subir `CACHE` en `sw.js` (`dyf-app-vN`).
