'use strict';
/* ══════════════════════════════════════════════════════════════
   DISTRITO YF · VENTAS DIRECTAS (22/11)
   La venta principal es por WhatsApp / catálogo, no por live.
   - La pestaña "🛒 Ventas" (la de siempre, data-t="live") abre en un registro fijo por mes:
     un "live" con tipo 'ventas' (ej. "Ventas · noviembre 2026") donde entran los pedidos de todo el mes.
     Así se reusa todo lo que ya funciona: pedido con código, mensaje de pago, pagos, despacho, guardados.
   - Los lives de verdad se hacen cada tanto con "🎥 Hacer un live"; al terminar, "🛒 Volver a ventas".
   - La fecha de pago del registro de ventas se renueva sola: siempre "mañana".
   ══════════════════════════════════════════════════════════════ */
const MESES_V = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const esVentas = l => !!(l && l.tipo === 'ventas');

/** Registro de ventas del mes actual (lo crea si no existe y crear = true). */
function ventasDelMes(crear) {
  const ym = hoyISO().slice(0, 7);
  let l = DB.lives.find(x => esVentas(x) && x.mes === ym);
  if (!l && crear) {
    const primera = !DB.lives.some(esVentas);
    const iso = sumarDias(hoyISO(), 1);
    l = { id: uid('l'), tipo: 'ventas', mes: ym, nombre: 'Ventas · ' + MESES_V[+ym.slice(5) - 1] + ' ' + ym.slice(0, 4),
      fecha: hoyISO(), fechaPago: fechaPagoTexto(iso), fechaPagoISO: iso, descuento: 0, pedidoCounter: 0, pedidos: [] };
    // La primera vez: el live vacío que la app creaba sola al abrir no sirve, se archiva
    if (primera) for (let i = DB.lives.length - 1; i >= 0; i--) {
      const x = DB.lives[i];
      if (!esVentas(x) && !(x.pedidos || []).length && !(x.pedidoCounter > 0) && /^Live \d/.test(x.nombre || '')) DB.lives.splice(i, 1);
    }
    DB.lives.push(l);
    saveLives();
  }
  return l;
}
/** La fecha de pago de Ventas es siempre "mañana" (en un live se elige a mano). */
function ventasFechaAlDia(l) {
  if (!esVentas(l)) return;
  const iso = sumarDias(hoyISO(), 1);
  if (l.fechaPagoISO !== iso) ponerFechaPago(l, iso);
}
/** Al abrir: si no hay un live de hoy en curso, la app arranca en Ventas del mes. */
function ventasAlAbrir() {
  const v = ventasDelMes(true);
  const act = liveById(cfg('liveActualId'));
  if (!act || (esVentas(act) && act.id !== v.id) || (!esVentas(act) && act.fecha !== hoyISO())) {
    saveConfig({ liveActualId: v.id });
    if (typeof guardarLiveVer === 'function') guardarLiveVer(null);
  }
  ventasFechaAlDia(v);
}
const _iniciarAppV = iniciarApp;
iniciarApp = function () {
  try { ventasAlAbrir(); } catch (e) { console.error('Ventas al abrir', e); }
  _iniciarAppV();
};

// Crear un live (cada tanto) o volver a Ventas
ACT.volverVentas = () => {
  const v = ventasDelMes(true);
  saveConfig({ liveActualId: v.id });
  if (typeof guardarLiveVer === 'function') guardarLiveVer(null);
  UI.cargaId = null; UI.abiertos.clear();
  ventasFechaAlDia(v);
  toast('🛒 Volviste a ventas directas');
  render();
};

// Encabezado de la pestaña según sea Ventas o un live
const _renderLiveV = renderLive;
renderLive = function () {
  const l = liveActual();
  if (esVentas(l)) ventasFechaAlDia(l);
  _renderLiveV();
  pintarCabeceraVentas(l);
};
function pintarCabeceraVentas(l) {
  const btn = document.querySelector('#p-live [data-act="nuevoLive"]');
  if (btn) btn.textContent = '🎥 Hacer un live';
  const desc = document.getElementById('live-desc');
  const lbDesc = desc && desc.previousElementSibling;
  if (lbDesc) lbDesc.textContent = esVentas(l) ? '🎉 Descuento general del mes (%)' : '🎉 Descuento general del live (%)';
  let volver = document.getElementById('btn-volver-ventas');
  if (!esVentas(l)) {
    if (!volver && btn) {
      volver = document.createElement('button');
      volver.id = 'btn-volver-ventas'; volver.className = 'b ok'; volver.dataset.act = 'volverVentas';
      volver.textContent = '🛒 Volver a ventas';
      btn.insertAdjacentElement('afterend', volver);
    }
  } else if (volver) volver.remove();
  const tit = document.getElementById('ped-tit'); if (tit) tit.textContent = esVentas(l) ? 'Pedidos del mes' : 'Pedidos del live';
  // Envíos masivos de plantillas (totales, recordatorios R1/R2): son del live; en Ventas cada pedido se manda solo
  for (const id of ['live-tot-bar', 'live-rec-bar']) { const x = document.getElementById(id); if (x) x.hidden = esVentas(l); }
  // En Ventas la fecha de pago es automática (mañana): se muestra como dato, no se edita
  const fpLb = document.getElementById('live-fpago'); const fpLabel = fpLb && fpLb.previousElementSibling;
  if (fpLabel) fpLabel.hidden = esVentas(l);
  const fpBox = document.getElementById('live-fp-box');
  let fpInfo = document.getElementById('ventas-fp-info');
  if (esVentas(l)) {
    if (fpBox) fpBox.hidden = true;
    if (!fpInfo && fpBox) { fpInfo = document.createElement('div'); fpInfo.id = 'ventas-fp-info'; fpInfo.className = 'small muted'; fpBox.insertAdjacentElement('afterend', fpInfo); }
    if (fpInfo) fpInfo.innerHTML = '📅 Pagan hasta <b>' + esc(l.fechaPago || 'mañana') + '</b> · se renueva sola cada día';
  } else {
    if (fpBox) fpBox.hidden = false;
    if (fpInfo) fpInfo.remove();
  }
}
