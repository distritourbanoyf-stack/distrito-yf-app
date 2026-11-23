'use strict';
/* ══════════════════════════════════════════════════════════════
   DATOS DEL NEGOCIO — lo único que cambia de una tienda a otra.
   Para armar la app de otra tienda, se cambia este archivo (y nada más del código).
   Lo que se guarde en ⚙️ Config (tabla config de la base) gana sobre estos valores:
     · config.negocio = { nombre, marca, tel, rut, ciudad }
     · config.tarifaEnvio · config.mpRecargo · config.cuentasPago (el agente también los lee)
     · config.extraCobroCadete (solo la app)
   Lo usan Pedidos (index.html), Gestión (gestion.html) y los .js de la app.
   ══════════════════════════════════════════════════════════════ */
const NEGOCIO_DEF = {
  nombre: 'Distrito YF',              // mensajes, comprobantes, hoja del cadete
  marca: 'DISTRITO YF',               // etiquetas (en mayúsculas)
  tel: '',                            // etiqueta de agencia · se carga en ⚙️ Config
  rut: '',                            // etiqueta de agencia · se carga en ⚙️ Config
  ciudad: 'Montevideo, Uruguay',      // pie del PDF de compras (Gestión)
  tarifaEnvio: 250,                   // envío por cadetería ($) · el agente también
  mpRecargo: 10,                      // recargo de Mercado Pago (%) · el agente también
  extraCobroCadete: 0,                // lo que suma el cadete cuando cobra en la puerta ($)
  costoMensaje: '$0,45',              // costo aproximado de cada plantilla de WhatsApp (solo el aviso)
  cuentasPago: ['Prex', 'Mercado Pago', 'Efectivo']   // solo nombres; nunca números de cuenta (repo público)
};
// Horarios de corte. NO se editan en Config porque el agente tiene las mismas horas en su código (tools.ts):
// si se cambian, se cambian en los dos lados a la vez.
const CORTES = {
  horaLiberar: 16,   // el pedido sin pagar se puede liberar desde esta hora del día siguiente a la fecha de pago
  horaR1: 20,        // recordatorio 1 (día de pago)
  horaR2: 10         // recordatorio 2 (día siguiente)
};
/** Un dato del negocio: lo de Config si está, si no el de arriba. */
function negocio(k) {
  const c = (typeof DB !== 'undefined' && DB.config && DB.config.negocio) || {};
  const v = c[k];
  return v === undefined || v === null || v === '' ? NEGOCIO_DEF[k] : v;
}
// Barrios de la cadetería. Vacío: Distrito YF todavía no tiene cadetería propia.
const BARRIOS_GRISAL = [];   // sin cadetería propia por ahora (la de la otra tienda no aplica)
