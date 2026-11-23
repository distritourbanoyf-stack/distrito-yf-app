'use strict';
/* ══════════════════════════════════════════════════════════════
   DISTRITO YF · DESPACHO (reemplaza a Salidas)
   Buscás o escaneás → ves los pedidos abiertos de el cliente → tildás →
   elegís cómo sale (Retiro / Agencia / Cadetería / Guardado / Liberado) → listo.
   Cada salida queda como un "paquete" (tabla paquetes) y lleva una sola etiqueta.
   Si un pedido no figura pagado, avisa y deja marcar "Pagó" con la cuenta (tabla pagos).
   ══════════════════════════════════════════════════════════════ */

(() => {
  const st = document.createElement('style');
  st.textContent = `
.dsp-q{font-size:18px;padding:14px}
.dsp-p{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--bd);border-radius:12px;background:var(--s1);margin-bottom:8px;cursor:pointer;user-select:none}
.dsp-p.on{border-color:var(--ac);background:var(--ac2)}
.dsp-chk{width:26px;height:26px;border:2px solid var(--mu);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;flex:none;color:#fff}
.dsp-p.on .dsp-chk{background:var(--ac);border-color:var(--ac)}
.dsp-p .pc-tot{font-size:16px}
.dsp-segs{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.dsp-segs .b{padding:11px 4px;font-size:13px;white-space:normal;text-align:center}
.dsp-sal{border:2px solid var(--ac)}
#dsp-go{white-space:normal;text-align:center;line-height:1.25}
.dsp-a{display:flex;gap:8px;align-items:center;padding:10px 2px;border-bottom:1px solid var(--bd);cursor:pointer}
.dsp-a:last-child{border-bottom:none}
.dsp-a:hover{background:var(--s2)}
.dsp-a .nm{font-weight:700;font-size:15px}
.dsp-k{display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--bd);flex-wrap:wrap}
.dsp-k:last-child{border-bottom:none}
.dsp-fil{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
.dsp-fil .b{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px;font-size:13px;white-space:normal;text-align:center}
.dsp-fil .b b{font-size:22px;line-height:1}
.dsp-fil .b.on{border-color:var(--ac);background:var(--ac2);color:var(--ac)}
.dsp-vistas{grid-template-columns:repeat(3,1fr);position:sticky;top:0;z-index:5;background:var(--bg,#fff);padding:6px 0 8px;margin-bottom:6px}
.dsp-vistas .b.warn:not(.on){border-color:var(--li);color:var(--li)}
.dsp-ag-h{font-weight:800;font-size:13px;letter-spacing:.5px;color:var(--ac);padding:10px 2px 2px;text-transform:uppercase}
.sheet-t.a4ag{margin:2mm 0 0 2mm;page-break-after:auto;break-after:auto}
@media print{body{min-height:0!important}#print-area{display:flow-root!important}}
.sheet-t.a4ag+.sheet-t.a4ag{page-break-before:always;break-before:page}
@font-face{font-family:'Poppins';font-weight:400;font-display:block;src:url(fonts/Poppins-Regular.woff) format('woff')}
@font-face{font-family:'Poppins';font-weight:500;font-display:block;src:url(fonts/Poppins-Medium.woff) format('woff')}
@font-face{font-family:'Poppins';font-weight:700;font-display:block;src:url(fonts/Poppins-Bold.woff) format('woff')}
@font-face{font-family:'Poppins';font-weight:900;font-display:block;src:url(fonts/Poppins-Black.woff) format('woff')}
.lbl.ag2,.sheet-t>.lbl.ag2{--u:.096639mm;position:relative;flex:none;align-self:flex-start;box-sizing:border-box;width:calc(var(--u)*952);height:calc(var(--u)*1444);padding:0;border:calc(var(--u)*8) solid #000;border-radius:calc(var(--u)*22);overflow:hidden;background:#fff;color:#000;font-family:'Poppins','DM Sans',Arial,sans-serif;line-height:1}
.ag2 *{box-sizing:border-box}
.ag2-in{position:absolute;left:calc(var(--u)*-8);top:calc(var(--u)*-8);width:calc(var(--u)*952);height:calc(var(--u)*1444)}
.ag2-c{position:absolute;left:0;width:100%;text-align:center;white-space:pre}
.ag2-c img{display:block;margin:0 auto}
.ag2-hr{position:absolute;height:calc(var(--u)*4);background:#000}
.ag2-fl{position:absolute;left:calc(var(--u)*77);top:calc(var(--u)*512);width:calc(var(--u)*860)}
.ag2-lab{margin-left:calc(var(--u)*2);height:calc(var(--u)*40);font-size:calc(var(--u)*40);font-weight:400;letter-spacing:.12em;line-height:1}
.ag2-nom{margin-top:calc(var(--u)*19);font-weight:700;white-space:nowrap}
.ag2-r{display:flex;align-items:center}
.ag2-ic{flex:none;width:calc(var(--u)*58);display:flex;justify-content:center}
.ag2-rt{margin-left:calc(var(--u)*37);font-weight:400;white-space:pre;line-height:1}
.ag2-dir{margin-left:calc(var(--u)*95);width:calc(var(--u)*735);font-weight:400;font-size:calc(var(--u)*44);line-height:calc(var(--u)*46);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ag2-box{position:absolute;left:calc(var(--u)*59);top:calc(var(--u)*1189);width:calc(var(--u)*835);height:calc(var(--u)*200);border:calc(var(--u)*6) solid #000;border-radius:calc(var(--u)*22);display:flex;align-items:center;justify-content:center;font-weight:700;white-space:nowrap}
@media (max-width:520px){.dsp-segs{grid-template-columns:repeat(3,1fr)}.dsp-p{gap:8px;padding:10px}}
`;
  document.head.appendChild(st);
})();

UI.desp = { filtro: 'todos', q: '', idx: 0, items: [], cid: null, sel: new Set(), salida: null, f: {}, sinPago: false, aviso: '', res: null };

const CUENTAS_DEF = NEGOCIO_DEF.cuentasPago;
const extraCobroCadete = () => { const v = cfg('extraCobroCadete'); return v == null || v === '' ? NEGOCIO_DEF.extraCobroCadete : (+v || 0); };
const cuentasPago = () => { const c = cfg('cuentasPago'); return Array.isArray(c) && c.length ? c : CUENTAS_DEF; };
const SALIDAS = [['retiro', '🏠 Retiro'], ['agencia', '📦 Agencia'], ['cadeteria', '🚴 Cadetería'], ['guardado', '⏸️ Guardado'], ['liberado', '❌ Liberado'], ['pago', '💸 Solo pago']];
const conPago = t => ENVIOS.has(t) || t === 'pago';
const esTactil = () => !!(window.matchMedia && matchMedia('(pointer:coarse)').matches);
const ENVIOS = new Set(['retiro', 'agencia', 'cadeteria']);
const savePaquetes = () => put('emma_paquetes', DB.paquetes);
const savePagos = () => put('emma_pagos', DB.pagos);
const paqById = id => (DB.paquetes || []).find(k => k.id === id);

// ─── Reglas ───────────────────────────────────────────────────
/** Pagado = marcado con "Pagó", o en estado listo (así se marcaba hasta ahora). Un cambio no se cobra acá. */
const pagado = p => !!p.cambio || !!p.pago || p.estado === 'listo';
/** En Despacho se pide la cuenta de todo pedido que no tenga un pago marcado (los cambios no se cobran acá). */
const porCobrar = p => !p.cambio && !p.pago;
/** Código de la etiqueta de GrisalExpress: EMMA + su N Orden (letras y números, con algún número; ej. EMMAHMGU5CMH). Un nombre como "Emma Pérez" no lo es. */
const esGrisal = q => /^(ema)?emma(?=[a-z]*\d)[a-z0-9]{6,16}$/i.test(String(q).trim());
/** Pedidos de un cliente que todavía no salieron, del más viejo al más nuevo. */
function abiertosDe(cid) {
  return todosPedidos().filter(p => p.clienteId === cid && sinSalir(p))
    .sort((a, b) => (a.fechas.creado || '').localeCompare(b.fechas.creado || '') || a.num - b.num);
}
/** 7/11: lo que deja Mabel en el pedido. avisoDespacho = aviso corto para el momento de cerrar ("tiene paquete de Yharol"); retiroCuando = cuándo dijo que pasa a retirar {fecha, hora, texto}. Se ven solo mientras el pedido no salió. */
const avisosDe = ps => [...new Set(ps.map(p => String(p.avisoDespacho || '').trim()).filter(Boolean))];
const DIA_CORTO = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
function retiroDiaTxt(fecha) {
  const h = hoyISO(); if (!fecha) return 'Sin horario';
  const d = DIA_CORTO[new Date(fecha + 'T12:00:00').getDay()] + ' ' + fechaUY(fecha, 1);
  return fecha === h ? 'Hoy · ' + d : fecha === sumarDias(h, 1) ? 'Mañana · ' + d : fecha < h ? 'Pasó · ' + d : d;
}
/** Texto corto de cuándo pasa: "Hoy 18:00", "vie 7/11 18:00" o lo que escribió el cliente si no se pudo ordenar. */
function retiroCuandoTxt(p) {
  const r = p.retiroCuando; if (!r) return '';
  if (!r.fecha) return r.texto ? String(r.texto) : '';
  const h = hoyISO(), d = r.fecha === h ? 'Hoy' : r.fecha === sumarDias(h, 1) ? 'Mañana' : DIA_CORTO[new Date(r.fecha + 'T12:00:00').getDay()] + ' ' + fechaUY(r.fecha, 1);
  return d + (r.hora ? ' ' + r.hora : '');
}
const retiroClave = p => { const r = p.retiroCuando; return r && r.fecha ? r.fecha + ' ' + (r.hora || '99:99') : '9999-99-99 99:99'; };
/** Retiros anotados (pagados o que pagan al llegar), por cliente, ordenados por cuándo dijeron que pasan; los sin horario, al final. */
function retirosLista() {
  const G = new Map();
  for (const p of todosPedidos()) {
    if (!sinSalir(p) || p.estado === 'guardado' || entregaEf(p) !== 'retiro') continue;
    if (!G.has(p.clienteId)) G.set(p.clienteId, []);
    G.get(p.clienteId).push(p);
  }
  const creado = ps => ps.map(p => p.fechas.creado || '').sort()[0] || '';
  return [...G.entries()].map(([cid, ps]) => ({ cid, ps: ps.sort((a, b) => (a.fechas.creado || '').localeCompare(b.fechas.creado || '') || a.num - b.num), k: ps.map(retiroClave).sort()[0] }))
    .sort((a, b) => a.k.localeCompare(b.k) || creado(a.ps).localeCompare(creado(b.ps)));
}
const listaTipo = t => t === 'retiro' ? retirosLista() : (paraArmar()[t] || []);
/** El pedido "principal" del paquete: el más nuevo (su número y código van en la etiqueta). */
const principal = ps => [...ps].sort((a, b) => (b.fechas.creado || '').localeCompare(a.fechas.creado || '') || b.num - a.num)[0];
const numsTxt = ps => ps.map(p => '#' + p.num).join(' · ');

/** Medio del pago según la cuenta: Mercado Pago (transferencia/link) lleva recargo; Efectivo y los POS (Mercado Pago, Scantech) son al retirar, sin recargo; el resto, transferencia. */
const medioDe = cuenta => /^pos\b/i.test((cuenta || '').trim()) ? 'efectivo' : /mercado\s*pago/i.test(cuenta || '') ? 'mercadopago' : /efectivo|d[eé]bito|cr[eé]dito/i.test(cuenta || '') ? 'efectivo' : 'transferencia';
const recargoMP = () => { const v = DB.config.mpRecargo; return v === undefined || v === null || v === '' ? NEGOCIO_DEF.mpRecargo : Math.max(0, +v || 0); };
/** Lo que tiene que transferir: pedidos + envío (si lo transfiere) + recargo de Mercado Pago. */
function esperadoDe(base, env, cuenta) { const rec = medioDe(cuenta) === 'mercadopago' ? Math.round((base + env) * recargoMP() / 100) : 0; return { base, env, rec, total: base + env + rec }; }
/** Pago con 2 medios. x = lo que entró por el 2º medio (ya con el recargo si ese medio es Mercado Pago). El recargo va solo sobre la parte que pagó por Mercado Pago. */
function esperadoDos(base, env, c1, c2, x) {
  const T = base + env, r = recargoMP() / 100, mp1 = medioDe(c1) === 'mercadopago', mp2 = medioDe(c2) === 'mercadopago';
  x = Math.max(0, Math.round(+x || 0));
  const part2 = Math.min(T, mp2 ? Math.round(x / (1 + r)) : x), part1 = T - part2;
  const rec1 = mp1 ? Math.round(part1 * r) : 0, rec2 = mp2 ? Math.max(0, x - part2) : 0;
  return { T, part1, part2, rec1, rec2, tot1: part1 + rec1, tot2: part2 + rec2, rec: rec1 + rec2, total: T + rec1 + rec2, ok: part1 > 0 && part2 > 0 && !!c2 && c2 !== c1 };
}
function marcarPago(p, cuenta, origen) {
  const g = { id: uid('g'), pedidoId: p.id, clienteId: p.clienteId, cuenta, medio: medioDe(cuenta), monto: p.cambio ? (p.cambio.cobrar || 0) : calc(p).total, fecha: ahoraISO(), origen: origen || 'despacho', antes: p.estado };
  DB.pagos.push(g);
  p.pago = { id: g.id, cuenta, fecha: g.fecha };
  if (p.estado === 'pendiente') setEstado(p, 'listo');
  return g;
}
/** Anula un pago marcado por error: el pedido vuelve a "sin pagar" (y a pendiente si estaba pendiente). */
function anularPago(id) {
  const g = DB.pagos.find(x => x.id === id); if (!g) return;
  const p = pedById(g.pedidoId);
  // Pago con 2 medios: las dos filas de ese pedido se anulan juntas
  const ids = g.splitId ? DB.pagos.filter(x => x.splitId === g.splitId && x.pedidoId === g.pedidoId).map(x => x.id) : [id];
  DB.pagos = DB.pagos.filter(x => !ids.includes(x.id));
  if (p && p.pago && ids.includes(p.pago.id)) {
    delete p.pago;
    if (g.antes === 'pendiente' && p.estado === 'listo') setEstado(p, 'pendiente');
  }
}

/** Pagados que esperan salir, por tipo de entrega (sin retiro: esos se entregan cuando vienen). */
function paraArmar() {
  const G = { cadeteria: new Map(), agencia: new Map(), retiro: new Map(), sin_definir: new Map() };
  for (const p of todosPedidos()) {
    if (!sinSalir(p) || p.estado === 'guardado' || !pagado(p)) continue;
    const t = entregaEf(p); if (!G[t]) continue;
    if (!G[t].has(p.clienteId)) G[t].set(p.clienteId, []);
    G[t].get(p.clienteId).push(p);
  }
  const orden = m => [...m.entries()].map(([cid, ps]) => ({ cid, ps: ps.sort((a, b) => (a.fechas.creado || '').localeCompare(b.fechas.creado || '') || a.num - b.num) }))
    .sort((a, b) => (a.ps[0].fechas.creado || '').localeCompare(b.ps[0].fechas.creado || ''));
  return { cadeteria: orden(G.cadeteria), agencia: orden(G.agencia), retiro: orden(G.retiro), sin_definir: orden(G.sin_definir) };
}
function despBadge() {
  const el = document.getElementById('bdg-desp'); if (!el) return;
  const a = paraArmar(), n = a.cadeteria.length + a.agencia.length;
  el.innerHTML = n ? ` <span class="bdg">${n}</span>` : '';
}

// ─── Pantalla ─────────────────────────────────────────────────
function renderDespacho() {
  const el = $('#p-despacho'); if (!el) return;
  if (!el.dataset.ok) {
    el.innerHTML = `<div class="card"><div class="row" style="flex-wrap:nowrap"><div class="sw" style="flex:1;min-width:0"><input id="dsp-q" class="dsp-q" data-inp="despQ" placeholder="🔎 Nombre, teléfono o código" autocomplete="off" autocapitalize="off" enterkeyhint="search"><div class="sug" id="dsp-sug"></div></div><button class="b lg" data-act="camDesp" title="Escanear con la cámara" style="padding:14px 16px">📷</button></div></div>
      <div id="dsp-res"></div><div id="dsp-body"></div>`;
    el.dataset.ok = '1';
  }
  $('#dsp-res').innerHTML = resHTML();
  $('#dsp-body').innerHTML = UI.desp.cid && cliById(UI.desp.cid) ? clientaHTML() : inicioHTML();
}
function resHTML() {
  const r = UI.desp.res; if (!r) return '';
  const k = r.paqId && paqById(r.paqId);
  if (k) {
    const c = cliById(k.clienteId) || { nombre: '?' };
    const txt = { retiro: '🏠 Entregado', agencia: '📦 Sale por agencia', cadeteria: '🚴 Sale por cadetería' }[k.tipo];
    return `<div class="card"><div class="big-alert ok" style="margin-top:0">${txt} · ${esc(c.nombre)}<div style="font-size:15px;font-weight:700;margin-top:4px">${esc(k.nums.map(n => '#' + n).join(' · '))}${k.tipo === 'cadeteria' ? ' · ' + (k.cobro ? 'cobra ' + fmt(k.cobro) : 'envío pago') : ''}</div></div>
      <div class="row mt">${k.tipo !== 'retiro' ? `<button class="b pri" id="dsp-print" data-act="despPrint" data-k="${k.id}">🖨️ Imprimir etiqueta</button>` : ''}<button class="b sm" data-act="waCli" data-cid="${k.clienteId}" title="Abrir el chat vacío">💬 Chat</button><span class="grow"></span><button class="b sm gh" data-act="despDeshacer" data-k="${k.id}">↩️ Deshacer</button><button class="b sm gh" data-act="despResX">✕</button></div></div>`;
  }
  return `<div class="card"><div class="big-alert ${r.cls || 'mu'}" style="margin-top:0">${r.html}</div><div class="row mt"><span class="grow"></span>${r.pagos && r.pagos.some(id => DB.pagos.some(g => g.id === id)) ? '<button class="b sm gh" data-act="despDeshacerPago">↩️ Deshacer</button>' : ''}${r.cid ? `<button class="b sm" data-act="waCli" data-cid="${r.cid}" title="Abrir el chat vacío">💬 Chat</button><button class="b sm" data-act="despAbrir" data-cid="${r.cid}">Ver cliente</button>` : ''}<button class="b sm gh" data-act="despResX">✕</button></div></div>`;
}

// ── Inicio: pagados para armar + lo que salió hoy ──
function inicioHTML() {
  const a = paraArmar(), m = stats();
  a.retiro = retirosLista();
  const grupo = (tipo, titulo, ayuda) => {
    let gs = a[tipo]; if (!gs.length) return '';
    const agKey = cid => ((cliById(cid) || {}).agencia || '').trim().toUpperCase();
    if (tipo === 'agencia') gs = [...gs].sort((x, y) => (!agKey(x.cid)) - (!agKey(y.cid)) || agKey(x.cid).localeCompare(agKey(y.cid)));
    let agAnt = null;
    if (tipo === 'retiro') gs = gs.map(g => ({ ...g, dia: (g.ps.map(p => p.retiroCuando && p.retiroCuando.fecha).filter(Boolean).sort()[0]) || '' }));
    return `<div class="card"><div class="card-t">${titulo} <span class="bdg">${gs.length}</span></div>${ayuda ? `<div class="small muted mb">${ayuda}</div>` : ''}
      ${gs.map(({ cid, ps }) => {
        const c = cliById(cid) || { nombre: '?' }, art = ps.reduce((s, p) => s + (p.cambio ? p.cambio.art : calc(p).art), 0);
        const marcas = [];
        if (tipo === 'cadeteria' && !(c.direccion || '').trim()) marcas.push('<span class="chip li">⚠️ sin dirección</span>');
        if (tipo === 'agencia' && !(c.agencia || '').trim()) marcas.push('<span class="chip li">⚠️ sin agencia</span>');
        if ((m[cid] || ST0).guardados.length) marcas.push('<span class="chip gu">⏸️ tiene guardado</span>');
        if (tipo === 'retiro') {
          if (ps.some(p => !pagado(p))) marcas.push('<span class="chip pe">💵 paga al llegar</span>');
          if (avisosDe(ps).length) marcas.push('<span class="chip li">📌 tiene aviso</span>');
        }
        if (ps.some(p => p.cambio)) marcas.push('<span class="chip ac">🔄 cambio</span>');
        const g0 = gs.find(x => x.cid === cid), rcTxt = tipo === 'retiro' ? ps.map(retiroCuandoTxt).filter(Boolean)[0] || '' : '';
        const k = tipo === 'agencia' ? agKey(cid) || 'SIN AGENCIA' : tipo === 'retiro' ? retiroDiaTxt(g0.dia) : null, cab = k && k !== agAnt ? `<div class="dsp-ag-h">${esc(k)} · ${tipo === 'retiro' ? gs.filter(x => retiroDiaTxt(x.dia) === k).length : gs.filter(x => (agKey(x.cid) || 'SIN AGENCIA') === k).length}</div>` : '';
        if (k) agAnt = k;
        return cab + `<div class="dsp-a" data-act="despArmar" data-cid="${cid}" data-t="${tipo}">
          <div style="flex:1;min-width:0"><div class="nm">${esc(c.nombre)}${rcTxt ? ` <span class="chip ac">🕒 ${esc(rcTxt)}</span>` : ''}</div><div class="small muted">${numsTxt(ps)} · ${art} art. · ${fechaUY(ps[0].fechas.creado, 1)}${tipo === 'agencia' && c.agencia ? ' · ' + esc(c.agencia) : ''}${tipo === 'cadeteria' && c.barrio ? ' · ' + esc(c.barrio) : ''}</div>${marcas.length ? `<div class="pc-sub">${marcas.join(' ')}</div>` : ''}</div>
          <span class="muted">›</span></div>`;
      }).join('')}</div>`;
  };
  const sinPagar = todosPedidos().filter(p => p.estado === 'pendiente' && !p.cambio).length, F = UI.desp.filtro || 'todos', ver = t => F === 'todos' || F === t;
  const fil = [['todos', 'Todos', a.cadeteria.length + a.agencia.length + a.retiro.length + a.sin_definir.length], ['cadeteria', '🚴 Cadetería', a.cadeteria.length], ['agencia', '📦 Agencias', a.agencia.length], ['retiro', '🏠 Retiros', a.retiro.length]]
    .map(([t, txt, n]) => `<button class="b${F === t ? ' on' : ''}" data-act="despFiltro" data-t="${t}"><b>${n}</b>${txt}</button>`).join('');
  let h = (ver('cadeteria') ? grupo('cadeteria', '🚴 Pagados para armar · Cadetería') : '') + (ver('agencia') ? grupo('agencia', '📦 Pagados para armar · Agencias') : '')
    + (ver('retiro') ? grupo('retiro', '🏠 Para retirar', 'Por orden de horario que dijeron: las que pasan antes, arriba. Las que no dijeron hora, al final.') : '')
    + (F === 'todos' ? grupo('sin_definir', '❓ Pagados sin entrega definida', 'Tocá el cliente y elegí cómo sale.') : '');
  if (!h) h = '<div class="empty">No hay pedidos pagados esperando salir 🎉</div>';
  h = `<div class="row mb" style="justify-content:flex-end"><button class="b sm" data-act="tab" data-t="pagos">📊 Pagos del día</button></div><div class="dsp-fil">${fil}</div>` + h;
  if (sinPagar) h += `<div class="small muted" style="margin:-4px 2px 12px">⏳ ${sinPagar} pedido${sinPagar > 1 ? 's' : ''} todavía sin pagar.</div>`;
  // Subpestañas (28/10): cada cosa en su pantalla, sin bajar hasta el final
  const nArmar = a.cadeteria.length + a.agencia.length + a.retiro.length + a.sin_definir.length;
  const nLib = typeof paraLiberar === 'function' ? paraLiberar().length : 0, nHoy = paquetesDeHoy().length;
  let V = UI.desp.vista || 'armar'; if (V === 'liberar' && typeof liberarHTML !== 'function') V = 'armar';
  const vs = [['armar', '📦 Para armar', nArmar], ['liberar', '⏳ Para liberar', nLib], ['hoy', '🚚 Salió hoy', nHoy]]
    .map(([k, txt, n]) => `<button class="b${V === k ? ' on' : ''}${k === 'liberar' && n ? ' warn' : ''}" data-act="despVista" data-v="${k}"><b>${n}</b>${txt}</button>`).join('');
  const pes = `<div class="dsp-fil dsp-vistas">${vs}</div>`;
  if (V === 'liberar') return pes + liberarHTML();
  if (V === 'hoy') return pes + (hoyHTML() || '<div class="empty">Todavía no salió nada hoy</div>');
  return pes + h;
}
function paquetesDeHoy() {
  const hoy = hoyISO();
  return (DB.paquetes || []).filter(k => localISO(new Date(k.fecha)) === hoy).sort((a, b) => b.fecha.localeCompare(a.fecha));
}
function hoyHTML() {
  // Pestañas propias de "Salió hoy" (27/10): tocar Cadetería / Agencias / Retiros muestra solo eso. Si no se eligió, sigue el filtro de arriba.
  const todos = paquetesDeHoy(); if (!todos.length) return '';
  const F = UI.desp.filtroHoy || UI.desp.filtro || 'todos', ks = todos.filter(k => F === 'todos' || k.tipo === F);
  const n = t => todos.filter(k => k.tipo === t).length, cad = ks.filter(k => k.tipo === 'cadeteria').length;
  const hora = iso => { const d = new Date(iso); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
  const ico = { retiro: '🏠', agencia: '📦', cadeteria: '🚴' };
  const pes = [['todos', 'Todo', todos.length], ['cadeteria', '🚴 Cadetería', n('cadeteria')], ['agencia', '📦 Agencias', n('agencia')], ['retiro', '🏠 Retiros', n('retiro')]]
    .map(([t, txt, c]) => `<button class="b${F === t ? ' on' : ''}" data-act="despFiltroHoy" data-t="${t}"${c || t === 'todos' ? '' : ' disabled'}><b>${c}</b>${txt}</button>`).join('');
  return `<div class="card"><div class="card-t">Salió hoy</div><div class="dsp-fil">${pes}</div>
    ${ks.length ? '' : '<div class="empty">Nada de esto salió hoy</div>'}
    ${cad ? `<div class="row mb">${grisalConectado() ? `<button class="b sm pri" data-act="despGrisalPasar">🚴 Pasar a Grisal${grisalPendientes().length ? ' (' + grisalPendientes().length + ')' : ' ✓'}</button>` : ''}<button class="b sm" data-act="despGrisal">📋 Copiar para GrisalExpress</button><button class="b sm" data-act="despHoja">🖨️ Hoja del cadete</button></div>` : ''}
    ${ks.map(k => { const c = cliById(k.clienteId) || { nombre: '?' }; return `<div class="dsp-k"><span class="mono small muted">${hora(k.fecha)}</span><span>${ico[k.tipo]}</span><span style="flex:1;min-width:120px"><b>${esc(c.nombre)}</b> <span class="small muted">${esc(k.nums.map(x => '#' + x).join(' · '))}</span>${k.grisalCopiado ? ' <span class="chip ac">📋 copiada</span>' : ''}</span>${k.tipo !== 'retiro' ? `<button class="b sm" data-act="despPrint" data-k="${k.id}" title="Reimprimir etiqueta">🖨️</button>` : ''}<button class="b sm gh" data-act="despDeshacer" data-k="${k.id}" title="Deshacer">↩️</button></div>`; }).join('')}
  </div>`;
}

// ── Clienta: pedidos abiertos y cómo salen ──
function chipPago(p) {
  if (p.cambio) return `<span class="chip ac">🔄 Cambio${p.cambio.cobrar ? ' · cobrar ' + fmt(p.cambio.cobrar) : ''}</span>`;
  const g = p.estado === 'guardado' ? '<span class="chip gu">⏸️ Guardado</span> ' : '';
  return g + (pagado(p) ? `<span class="chip ok">✓ Pagado${p.pago ? ' · ' + esc(p.pago.cuenta) : ''}</span>` : '<span class="chip pe">⏳ Sin pagar</span>');
}
function clientaHTML() {
  const D = UI.desp, c = cliById(D.cid), m = stats(), h = m[c.id] || ST0, ab = abiertosDe(c.id);
  for (const id of [...D.sel]) if (!ab.some(p => p.id === id)) D.sel.delete(id);
  const alertas = [];
  if (D.aviso) alertas.push(`<div class="alert pe">${D.aviso}</div>`);
  // 7/11: avisos de Mabel (lo que el cliente le dijo) y cuándo pasa a retirar: arriba de todo, para verlos al cerrar
  const rcs = [...new Set(ab.filter(p => entregaEf(p) === 'retiro').map(retiroCuandoTxt).filter(Boolean))];
  if (rcs.length) alertas.unshift(`<div class="alert pe">🕒 Dijo que pasa a retirar: <b>${rcs.map(esc).join(' · ')}</b></div>`);
  avisosDe(ab).reverse().forEach(t => alertas.unshift(`<div class="alert" style="background:#fff3bf;border:1px solid #e0b400;color:#5a4300;font-weight:700">📌 ${esc(t)}</div>`));
  if (h.deudas.length) { const d = h.deudas[h.deudas.length - 1]; alertas.push(`<div class="alert li">⚠️ DEUDORA: pedido sin pagar del ${fechaUY(d.fecha)} por ${fmt(d.total)}${h.deudas.length > 1 ? ' (+' + (h.deudas.length - 1) + ' más)' : ''}</div>`); }
  if (c.saldoFavor > 0) alertas.push(`<div class="alert ok">💰 Tiene ${fmt(c.saldoFavor)} a favor</div>`);
  const filas = ab.map(p => {
    const l = liveById(p.liveId) || { nombre: '?' }, t = calc(p), on = D.sel.has(p.id), ent = entregaEf(p);
    return `<div class="dsp-p${on ? ' on' : ''}" data-act="despTog" data-id="${p.id}">
      <span class="dsp-chk">${on ? '✓' : ''}</span><span class="num">#${p.num}</span>
      <div class="pc-main"><div class="small"><b>${esc(l.nombre)}</b> · ${fechaUY(p.fechas.creado || l.fecha, 1)} · ${p.cambio ? p.cambio.art : t.art} art.</div>
        <div class="pc-sub">${chipPago(p)}${ent !== 'sin_definir' ? ` <span>${ENTREGA_TXT[ent]}</span>` : ''}</div></div>
      <div class="pc-tot">${p.cambio ? (p.cambio.cobrar ? fmt(p.cambio.cobrar) : '🔄') : fmt(t.total)}</div>
      <button class="b sm gh" data-act="despVer" data-id="${p.id}" title="Ver detalle">👁️</button></div>`;
  }).join('');
  const todos = ab.length > 1 ? `<button class="b sm" data-act="despTodos">${D.sel.size === ab.length ? '☐ Ninguno' : '☑ Todos'}</button>` : '';
  // "Más plazo" se maneja desde Despacho (30/10): sobre los tildados, o sobre todos los que pueden si no hay ninguno tildado
  const conPlazo = typeof plazoBtnHTML === 'function' ? ab.filter(p => plazoBtnHTML(p)) : [], selPlazo = conPlazo.filter(p => D.sel.has(p.id)), usaPlazo = selPlazo.length ? selPlazo : conPlazo;
  const btnPlazo = usaPlazo.length ? `<button class="b sm" data-act="masPlazo" data-ids="${usaPlazo.map(p => p.id).join(',')}" title="Pasa a Guardado sin pagar con fecha límite">📅 ${usaPlazo.every(p => p.guardadoSinPagar) ? 'Cambiar plazo' : 'Más plazo'}${selPlazo.length && selPlazo.length < conPlazo.length ? ' (' + selPlazo.length + ')' : ''}</button>` : '';
  const ultimos = !ab.length ? (DB.paquetes || []).filter(k => k.clienteId === c.id).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 3) : [];
  return `<div class="card">
      <div class="row" style="align-items:flex-start"><div class="grow" style="flex:1;min-width:0"><div class="pc-nom" style="white-space:normal">${nomAlias(c)}</div><div class="pc-sub">${histHTML(h)} ${c.tel ? '<span class="mono">' + esc(c.tel) + '</span>' : '<span class="chip pe">⚠️ sin tel</span>'}</div></div><button class="b sm gh" data-act="despCerrar" title="Volver (Esc)">✕</button></div>
      <div class="row mt"><button class="b sm" data-act="verFicha" data-cid="${c.id}">👤 Ficha</button>${c.tel ? `<button class="b sm" data-act="waCli" data-cid="${c.id}" title="Abrir el chat vacío">💬 Chat</button>` : ''}${(() => { const u = ultimoPedidoDe(c.id); return u ? `<button class="b sm" data-act="irPedido" data-id="${u.id}">🛍️ Último pedido #${u.num} · ${esc((liveById(u.liveId) || {}).nombre || '')}</button>` : ''; })()}</div>
      ${alertas.join('')}
    </div>
    <div class="list-h"><span class="t">Sin salida <span class="bdg">${ab.length}</span></span><span class="row" style="gap:6px">${btnPlazo}${todos}</span></div>
    ${filas || `<div class="empty">No tiene pedidos sin salida</div>`}
    ${salidasRecientesHTML(c)}
    ${D.sel.size ? salidaHTML(c, ab.filter(p => D.sel.has(p.id))) : (ab.length ? '<div class="small muted" style="text-align:center;margin:6px 0 14px">Tildá los pedidos que salen</div>' : '')}`;
}
/** 10/11: salidas recientes de el cliente (últimos 14 días): cuándo se marcó, por dónde salió y con qué pago. Con ↩️ Deshacer. */
function salidasRecientesHTML(c) {
  const lim = Date.now() - 14 * 864e5, hh = iso => { const x = new Date(iso); return pad2(x.getHours()) + ':' + pad2(x.getMinutes()); };
  const ks = (DB.paquetes || []).filter(k => k.clienteId === c.id && new Date(k.fecha).getTime() >= lim).sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 4);
  if (!ks.length) return '';
  const tipoTxt = { retiro: '🏠 Entregado (retiro)', agencia: '📦 Salió por agencia', cadeteria: '🚴 Salió por cadetería' };
  return `<div class="list-h"><span class="t">Salidas recientes <span class="bdg">${ks.length}</span></span></div>` + ks.map(k => {
    const ps = (k.pedidos || []).map(pedById).filter(Boolean);
    const pagos = ps.map(p => p.pago ? `#${p.num} ✓ ${esc(p.pago.cuenta)}${p.pago.fecha ? ' · pagó ' + fechaUY(localISO(new Date(p.pago.fecha)), 1) + ' ' + hh(p.pago.fecha) : ''}` : `#${p.num} ⏳ sin pago marcado`).join(' · ');
    const extra = k.tipo === 'cadeteria' ? (k.cobro ? ' · cobra ' + fmt(k.cobro) : ' · envío pago') : k.tipo === 'agencia' && k.envio && k.envio.agencia ? ' · ' + esc(k.envio.agencia) + (k.envio.ciudad ? ' (' + esc(k.envio.ciudad) + ')' : '') : '';
    return `<div class="card" style="margin:6px 0"><div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div style="flex:1;min-width:0"><div><b>${tipoTxt[k.tipo] || esc(k.tipo)}</b> <span class="small muted">${esc(k.nums.map(x => '#' + x).join(' · '))}</span></div>
      <div class="small muted">Marcado el ${fechaUY(localISO(new Date(k.fecha)), 1)} a las ${hh(k.fecha)}${extra}</div><div class="small">${pagos}</div></div>
      ${k.tipo !== 'retiro' ? `<button class="b sm" data-act="despPrint" data-k="${k.id}" title="Reimprimir etiqueta">🖨️</button>` : ''}<button class="b sm gh" data-act="despDeshacer" data-k="${k.id}" title="Deshacer la salida">↩️ Deshacer</button></div></div>`;
  }).join('');
}
/** Último pedido de el cliente (cualquier estado), por fecha y número. */
function ultimoPedidoDe(cid) {
  return todosPedidos().filter(p => p.clienteId === cid).sort((a, b) => (b.fechas.creado || '').localeCompare(a.fechas.creado || '') || b.num - a.num)[0] || null;
}
function campoD(k, label, ph, extra) {
  const v = esc(UI.desp.f[k] || '');
  if (k === 'barrio') return `<div class="sw"><label class="lb">${label}</label><input id="dsf-${k}" data-inp="despF" data-f="${k}" data-barrio="1" autocomplete="off" value="${v}" placeholder="${esc(ph || '')}"><div class="sug"></div></div>`;
  return `<div><label class="lb">${label}</label><input id="dsf-${k}" data-inp="despF" data-f="${k}" value="${v}" placeholder="${esc(ph || '')}" ${extra || ''}></div>`;
}
/** Bloque "Pagó con 2 medios": 2º medio + cuánto entró por ese medio. */
function dosHTML(f, ctas, v) {
  if (!f.dos) return '<div class="row mt"><button class="b sm gh" data-act="despDos">＋ Pagó con 2 medios</button></div>';
  const bs = ctas.filter(c => c !== f.cuenta).map(cta => `<button class="b sm seg${f.cuenta2 === cta ? ' on' : ''}" data-act="despCuenta2" data-c="${esc(cta)}">${esc(cta)}</button>`).join('');
  let h = `<div class="mt"><label class="lb">2º medio *</label><div class="row">${bs}<button class="b sm gh" data-act="despDos">✕ Quitar</button></div></div>`;
  if (f.cuenta2) h += `<div class="row mt"><label class="small muted" for="dsf-monto2">Entró por ${esc(f.cuenta2)}</label><input id="dsf-monto2" type="number" inputmode="numeric" data-inp="despF" data-f="monto2" value="${esc(f.monto2 || '')}" placeholder="$" style="width:130px"><span class="small muted" id="dsf-dos-res">${dosResTxt(f, v)}</span></div>`;
  return h;
}
function dosResTxt(f, v) {
  if (!v || !(num(f.monto2) > 0)) return 'Poné cuánto pagó por este medio';
  if (!v.ok) return '⚠️ Ese monto no cierra con el total';
  return `✓ ${esc(f.cuenta)} ${fmt(v.tot1)} + ${esc(f.cuenta2)} ${fmt(v.tot2)}`;
}
/** Cálculo del 2º medio desde el estado del formulario (para validar sin redibujar). */
function dosV0(porCob, t, f) {
  const tar = +cfg('tarifaEnvio') || 0, base = porCob.reduce((s2, p) => s2 + calc(p).total, 0), env = (t === 'cadeteria' || t === 'pago') && f.conEnvio ? tar : 0;
  return f.dos && f.cuenta && f.cuenta2 ? esperadoDos(base, env, f.cuenta, f.cuenta2, f.monto2) : null;
}
function salidaHTML(c, ps) {
  const D = UI.desp, f = D.f, t = D.salida, n = ps.length;
  const segs = SALIDAS.map(([k, txt]) => `<button class="b seg${t === k ? ' on' : ''}" data-act="despSal" data-k="${k}">${txt}</button>`).join('');
  let form = '';
  if (t === 'retiro') form = '<div class="small muted mt">Se entrega en mano: los pedidos quedan como entregados.</div>';
  if (t === 'agencia') form = `<div class="grid2 mt">${campoD('agencia', 'Agencia *', 'DAC, Mirtrans…')}${campoD('nombreEnvio', 'Nombre real', c.nombre)}${campoD('ci', 'C.I.', '', 'inputmode="numeric"')}${campoD('ciudad', 'Ciudad *')}${campoD('depto', 'Departamento')}${campoD('direccion', 'Dirección (opcional)')}</div>`;
  if (t === 'cadeteria') {
    const b = (fk, v, txt) => `<button class="b sm seg${f[fk] === v ? ' on' : ''}" data-act="despFv" data-f="${fk}" data-v="${v}">${txt}</button>`;
    form = `<div class="mt">${campoD('nombreEnvio', 'Nombre para la etiqueta (opcional)', 'Si queda vacío va ' + c.nombre)}</div>
      <div class="grid2 mt">${campoD('direccion', 'Dirección *', 'Calle, número, apto')}${campoD('barrio', 'Barrio (opcional)', 'Escribí y elegí de la lista')}</div>
      <div class="mt">${campoD('notaCadete', 'Nota para el cadete (opcional)', 'Horario, referencia…')}</div>
      <label class="lb mt">Tipo de envío</label><div class="row">${b('tipo', 'comun', '📦 Común')}${b('tipo', 'cambio', '🔄 Cambio')}</div>
      <label class="lb mt">Cobro del envío *</label><div class="row">${b('cobro', 'cobrar', 'Cobrar ' + fmt(cfg('tarifaEnvio')))}${b('cobro', 'pago', '✓ Envío pago')}${b('cobro', 'monto', '✏️ Otro monto')}<button class="b sm" data-act="despCobraTodo" title="El cliente le paga todo al cadete (pedido + envío + extra de cobro). Lo autoriza el equipo.">💵 Cobra todo (+${fmt(extraCobroCadete())})</button>${f.cobro === 'monto' ? `<input id="dsf-monto" type="number" inputmode="numeric" data-inp="despF" data-f="monto" value="${esc(f.monto || '')}" placeholder="$ total" style="width:110px">` : ''}</div>`;
  }
  if (t === 'guardado') form = '<div class="small muted mt">Si no elegís nada abajo, quedan guardados con el plazo normal de 30 días (pestaña Guardados). Si ya pagó, marcá el pago; si todavía no, elegí "Sin pagar · con plazo".</div>';
  if (t === 'liberado') form = '<div class="alert li">La ropa vuelve al stock y el pedido cuenta como ❌ (queda como deuda en la ficha).</div>';
  if (t === 'pago') form = '<div class="small muted mt">Marca el pago sin despachar (para hacerlo desde el celular cuando llega el comprobante). Al despachar en la compu ya figura pagado.</div>';
  // Pago: se marca acá mismo, junto con la salida
  const conP = conPago(t) || t === 'guardado';
  const porCob = conP ? ps.filter(porCobrar) : [];
  const yaPag = conP ? ps.filter(p => p.pago) : [];
  let pago = '';
  if (yaPag.length) pago += `<div class="small mt" style="color:var(--ok)">✓ Ya pagó: ${yaPag.map(p => '#' + p.num + ' (' + esc(p.pago.cuenta) + (p.pago.conEnvio ? ', con envío' : '') + ')').join(' · ')}</div>`;
  if (porCob.length) {
    const tar = +cfg('tarifaEnvio') || 0, base = porCob.reduce((s2, p) => s2 + calc(p).total, 0), env = (t === 'cadeteria' || t === 'pago') && f.conEnvio ? tar : 0, esp = esperadoDe(base, env, f.cuenta), dosV = f.dos && f.cuenta2 ? esperadoDos(base, env, f.cuenta, f.cuenta2, f.monto2) : null, auto = dosV && dosV.ok ? dosV.tot1 : esp.total;
    const ctas = cuentasPago(), extra = f.cuenta && f.cuenta !== 'sin' && !ctas.includes(f.cuenta) ? [f.cuenta] : [];
    pago += `<label class="lb mt">¿Cómo pagó${porCob.length < ps.length ? ' ' + numsTxt(porCob) : ''}? *</label>
      <div class="row">${ctas.concat(extra).map(cta => `<button class="b sm seg${f.cuenta === cta ? ' on' : ''}" data-act="despCuenta" data-c="${esc(cta)}">${esc(cta)}</button>`).join('')}<button class="b sm gh" data-act="despCuenta" data-c="">Otra…</button>${t === 'pago' ? '' : `<button class="b sm seg${f.cuenta === 'sin' ? ' on' : ''}" data-act="despCuenta" data-c="sin">${t === 'guardado' ? '⏳ Sin pagar · con plazo' : 'Sin confirmar'}</button>`}</div>`;
    if (t === 'cadeteria' || t === 'pago') pago += `<div class="row mt"><button class="b sm seg${f.conEnvio ? ' on' : ''}" data-act="despConEnvio">${f.conEnvio ? '✓' : '＋'} La transferencia incluye el envío de cadetería (${fmt(tar)})</button></div>`;
    if (f.cuenta && f.cuenta !== 'sin') pago += `<div class="row mt"><label class="small muted" for="dsf-transf">${f.dos ? 'Entró por ' + esc(f.cuenta) : 'Monto transferido'}</label><input id="dsf-transf" type="number" inputmode="numeric" data-inp="despF" data-f="transf" value="${esc(f.transfEdit ? f.transf : String(auto))}" style="width:130px"><span class="small muted">${dosV && dosV.ok ? 'su parte ' + fmt(dosV.part1) : 'pedido ' + fmt(base)}${env ? ' + envío ' + fmt(env) : ''}${(dosV && dosV.ok ? dosV.rec1 : esp.rec) ? ' + Mercado Pago ' + recargoMP() + '% ' + fmt(dosV && dosV.ok ? dosV.rec1 : esp.rec) : ''}</span></div>`;
    if (f.cuenta && f.cuenta !== 'sin') pago += dosHTML(f, ctas, dosV);
    if (f.cuenta === 'sin' && t === 'guardado') { const plz = f.plazo || sumarDias(hoyISO(), 3); pago += `<div class="row mt"><label class="small muted" for="dsf-plazo">Guardado sin pagar hasta</label><input type="date" id="dsf-plazo" min="${hoyISO()}" data-inp="despF" data-f="plazo" value="${esc(plz)}" style="width:auto"><button class="b sm" data-act="despPlazo" data-d="3">+3 días</button><button class="b sm" data-act="despPlazo" data-d="7">+7 días</button></div><div class="small muted mt">No recibe recordatorios. Al vencer aparece en "Para liberar" para que decidas vos.</div>`; }
    else if (f.cuenta === 'sin') pago += '<div class="small muted mt">Sale sin pago marcado: queda anotado en el paquete.</div>';
  }
  if (t === 'pago' && !porCob.length) pago += '<div class="small muted mt">Los pedidos tildados ya tienen el pago marcado.</div>';
  const bloqueado = !t || (porCob.length && !f.cuenta && t !== 'guardado') || (porCob.length && f.cuenta !== 'sin' && f.dos && !(f.cuenta2 && (dosV0(porCob, t, f) || {}).ok)) || (t === 'pago' && (!porCob.length || f.cuenta === 'sin'));
  const cobro = t === 'cadeteria' ? (f.cobro === 'pago' ? ' · envío pago' : f.cobro === 'monto' ? (num(f.monto) > 0 ? ' · cobra ' + fmt(num(f.monto)) : '') : f.cobro === 'cobrar' ? ' · cobra ' + fmt(cfg('tarifaEnvio')) : '') : '';
  const txt = !t ? 'Elegí cómo sale' : { retiro: `✓ Entregar ${n > 1 ? n + ' pedidos' : 'el pedido'}`, agencia: `📦 Despachar por agencia${n > 1 ? ' · ' + n + ' pedidos, 1 etiqueta' : ''}`, cadeteria: `🚴 Despachar por cadetería${cobro}`, guardado: porCob.length && f.cuenta === 'sin' ? `⏸️ Guardar sin pagar hasta el ${fechaUY(f.plazo || sumarDias(hoyISO(), 3), 1)}` : porCob.length && f.cuenta ? `⏸️ Guardar y marcar pago · ${esc(f.cuenta)}` : `⏸️ Guardar ${n > 1 ? n + ' pedidos' : 'el pedido'}`, liberado: `❌ Liberar ${n > 1 ? n + ' pedidos' : 'el pedido'}`, pago: '💸 Marcar pago' }[t];
  return `<div class="card dsp-sal"><div class="card-t">${t === 'pago' ? 'Pago' : '¿Cómo sale' + (n > 1 ? 'n' : '') + '?'} · ${numsTxt(ps)}</div>
    <div class="dsp-segs">${segs}</div>${form}${pago}
    <button class="b ${t === 'liberado' ? 'dan' : 'ok'} lg blk mt" id="dsp-go" data-act="despGo"${bloqueado ? ' disabled' : ''}>${txt}</button></div>`;
}

// ─── Acciones ─────────────────────────────────────────────────
/** Abre el cliente. ids = pedidos a tildar; tipo = salida sugerida. */
function abrirClientaDesp(cid, ids, tipo) {
  const D = UI.desp, ab = abiertosDe(cid);
  D.cid = cid; D.sinPago = false; D.aviso = '';
  D.sel = new Set(ids ? ids.filter(id => ab.some(p => p.id === id)) : ab.length === 1 ? [ab[0].id] : []);
  if (ids && ab.length > D.sel.size) { const otros = ab.filter(p => !D.sel.has(p.id)); D.aviso = `🔗 Tiene ${otros.length > 1 ? otros.length + ' pedidos más abiertos' : 'otro pedido abierto'}: ${numsTxt(otros)}. Tildalos si van juntos.`; }
  if (!tipo && D.sel.size) { const ts = new Set([...D.sel].map(id => entregaEf(pedById(id)))); if (ts.size === 1) tipo = [...ts][0]; }
  elegirSalida(ENVIOS.has(tipo) ? tipo : null);
  if (esTactil() && D.sel.size && [...D.sel].map(pedById).some(p => p && porCobrar(p))) D.salida = 'pago';
  D.q = ''; const q = $('#dsp-q'); if (q) q.value = '';
  cerrarSug();
  render();
  window.scrollTo(0, 0);
}
function elegirSalida(t) {
  const D = UI.desp, c = cliById(D.cid) || {}, ps = [...D.sel].map(pedById).filter(Boolean);
  D.salida = t;
  const m = ps.length ? principal(ps) : null;
  D.f = { agencia: c.agencia || '', nombreEnvio: c.nombreEnvio || '', ci: c.ci || '', ciudad: c.ciudad || '', depto: c.depto || '', direccion: c.direccion || '', barrio: c.barrio || '', notaCadete: c.notaCadete || '',
    tipo: ps.some(p => tipoEnvioDe(p) === 'cambio') ? 'cambio' : 'comun',
    cobro: m && m.cobroEnvio && m.entrega === 'cadeteria' ? m.cobroEnvio : null, monto: m && m.cobroMonto ? String(m.cobroMonto) : '',
    cuenta: (D.f && D.f.cuenta) || null, plazo: '', dos: !!(D.f && D.f.dos), cuenta2: (D.f && D.f.cuenta2) || null, monto2: (D.f && D.f.monto2) || '', conEnvio: false, transf: '', transfEdit: false };
}
function cerrarClientaDesp() { const D = UI.desp; D.cid = null; D.sel = new Set(); D.salida = null; D.f = {}; D.aviso = ''; D.sinPago = false; }
function focoBuscar() { setTimeout(() => { const q = $('#dsp-q'); if (q && UI.tab === 'despacho') q.focus(); }, 30); }

/** Crea el paquete, pasa los pedidos a enviado y guarda todo. Devuelve el paquete. */
function crearPaquete(c, ps, tipo, f, sinPago) {
  const m = principal(ps);
  const cobro = tipo === 'cadeteria' ? (f.cobro === 'pago' ? 0 : f.cobro === 'monto' ? num(f.monto) : +cfg('tarifaEnvio') || 0) : null;
  const envio = tipo === 'agencia' ? { nombre: c.nombreEnvio || c.nombre, tel: c.tel || '', agencia: c.agencia, ci: c.ci || '', ciudad: c.ciudad || '', depto: c.depto || '', direccion: c.direccion || '' }
    : tipo === 'cadeteria' ? { nombre: c.nombreEnvio || c.nombre, tel: c.tel || '', direccion: c.direccion || '', barrio: c.barrio || '', nota: c.notaCadete || '' }
    : { nombre: c.nombre, tel: c.tel || '' };
  const k = { id: uid('k'), tipo, fecha: ahoraISO(), pedidos: ps.map(p => p.id), nums: ps.map(p => p.num), clienteId: c.id, principal: m.id, codigo: m.codigo,
    cobro, tipoEnvio: tipo === 'cadeteria' ? (f.tipo || 'comun') : null, envio, sinPago: sinPago || [], grisalOrden: null,
    antes: ps.map(p => ({ id: p.id, estado: p.estado, entrega: p.entrega || 'sin_definir', cobroEnvio: p.cobroEnvio ?? null, cobroMonto: p.cobroMonto ?? 0, tipoEnvio: p.tipoEnvio ?? null, fechas: Object.assign({}, p.fechas) })) };
  for (const p of ps) {
    p.entrega = tipo;
    if (tipo === 'cadeteria') { p.cobroEnvio = f.cobro; p.cobroMonto = f.cobro === 'monto' ? num(f.monto) : 0; p.tipoEnvio = k.tipoEnvio; }
    setEstado(p, 'enviado');
    p.salida = { id: k.id, ts: k.fecha, tipo };
    p.paqueteId = k.id;
    if (p !== m) p.salioCon = m.id; else delete p.salioCon;
  }
  DB.paquetes.push(k);
  savePaquetes(); guardar();
  return k;
}
/** Marca el pago de estos pedidos con la cuenta elegida. El pedido más nuevo lleva el envío (si la transferencia lo incluye)
 *  y la diferencia con lo calculado, así la suma da lo transferido. */
function registrarPagos(ps, f, conEnvio, paquete) {
  const tar = +cfg('tarifaEnvio') || 0, env = conEnvio ? tar : 0;
  const base = ps.reduce((s2, p) => s2 + calc(p).total, 0);
  let dos = f.cuenta2 && f.cuenta2 !== f.cuenta && num(f.monto2) > 0 ? esperadoDos(base, env, f.cuenta, f.cuenta2, f.monto2) : null;
  if (dos && !dos.ok) dos = null;
  const esp = dos ? { rec: dos.rec1, total: dos.tot1 } : esperadoDe(base, env, f.cuenta);
  const transf = f.transfEdit || f.transf !== undefined && f.transf !== '' && f.origen === 'mabel' ? num(f.transf) : esp.total;
  const orden = [...ps].sort((a, b) => (a.fechas.creado || '').localeCompare(b.fechas.creado || '') || a.num - b.num);
  const gs = orden.map(p => marcarPago(p, f.cuenta, f.origen || (paquete ? 'despacho' : 'pago')));
  const g0 = gs[gs.length - 1];
  const extra = [];
  if (dos) {
    // Reparte: lo que pagó por el 2º medio se saca de las filas, de la última hacia atrás (el envío entra en la última fila)
    const splitId = uid('s');
    g0.monto = (+g0.monto || 0) + env;
    let falta = dos.part2;
    for (const g of [...gs].reverse()) {
      if (falta <= 0) break;
      const m = Math.min(falta, +g.monto || 0); if (m <= 0) continue;
      const h = { id: uid('g'), pedidoId: g.pedidoId, clienteId: g.clienteId, cuenta: f.cuenta2, medio: medioDe(f.cuenta2), monto: m, fecha: g.fecha, origen: g.origen, antes: g.antes, splitId };
      g.monto -= m; falta -= m; DB.pagos.push(h); extra.push(h);
    }
    if (extra[0]) extra[0].monto += dos.rec2;
    gs.forEach(g => { g.splitId = splitId; });
    orden.forEach(p => { p.pago.cuenta = f.cuenta + ' + ' + f.cuenta2; });
    g0.envio = env; g0.recargo = dos.rec; g0.esperado = dos.total; g0.ajuste = transf - dos.tot1; g0.monto = (+g0.monto || 0) + dos.rec1 + g0.ajuste;
  } else {
    // envio = lo que incluye de cadetería · recargo = Mercado Pago · ajuste = diferencia contra lo esperado · monto = lo realmente transferido (sumando las filas)
    g0.envio = env; g0.recargo = esp.rec; g0.esperado = esp.total; g0.ajuste = transf - esp.total; g0.monto = (+g0.monto || 0) + env + esp.rec + g0.ajuste;
  }
  if (f.nota) g0.nota = String(f.nota).slice(0, 200);
  gs.push(...extra);
  if (f.cobroId) gs.forEach(g => { g.cobroId = f.cobroId; });
  if (f.comprobante) g0.comprobante = f.comprobante;
  if (paquete) gs.forEach(g => { g.paqueteId = paquete.id; });
  if (conEnvio && !paquete) orden.forEach(p => { p.pago.conEnvio = true; p.entrega = 'cadeteria'; p.cobroEnvio = 'pago'; p.cobroMonto = 0; }); // pagó el envío de cadetería: sale por cadetería
  savePagos(); guardar();
  return gs;
}
function despGo() {
  const D = UI.desp, c = cliById(D.cid), t = D.salida, f = D.f;
  const ps = [...D.sel].map(pedById).filter(p => p && sinSalir(p));
  if (!c || !ps.length || !t) return;
  if (t === 'guardado' || t === 'liberado') {
    if (t === 'liberado' && !confirm(`¿Liberar ${numsTxt(ps)} de ${c.nombre}?\n\nLa ropa vuelve al stock y queda como deuda en la ficha.`)) return;
    let extra = '', gsId = [];
    if (t === 'guardado') {
      const pc = ps.filter(porCobrar);
      if (pc.length && f.cuenta && f.cuenta !== 'sin') { gsId = registrarPagos(pc, f, false, null).map(g => g.id); extra = ' · pagó por ' + esc(f.cuenta) + (f.dos && f.cuenta2 ? ' + ' + esc(f.cuenta2) : ''); }
      if (pc.length && f.cuenta === 'sin') { const hasta = f.plazo || sumarDias(hoyISO(), 3); if (hasta < hoyISO()) return toast('La fecha ya pasó'); aplicarPlazo(pc.map(p => p.id), hasta); extra = ' · sin pagar hasta el ' + fechaUY(hasta, 1); }
    }
    ps.filter(p => p.estado !== t).forEach(p => setEstado(p, t));
    guardar();
    D.res = t === 'guardado' ? { cls: 'mu', html: `⏸️ Guardado${ps.length > 1 ? 's' : ''} ${numsTxt(ps)} · ${esc(c.nombre)}${extra}`, cid: c.id, pagos: gsId } : { cls: 'li', html: `❌ Liberado${ps.length > 1 ? 's' : ''} ${numsTxt(ps)} · ${esc(c.nombre)}`, cid: c.id };
    cerrarClientaDesp(); render(); focoBuscar(); return;
  }
  const porCob = ps.filter(porCobrar);
  if (t === 'pago') {
    if (!porCob.length || !f.cuenta || f.cuenta === 'sin') return toast('Elegí la cuenta');
    const gs = registrarPagos(porCob, f, f.conEnvio);
    const tot = gs.reduce((s2, g) => s2 + (+g.monto || 0), 0);
    D.res = { cls: 'ok', html: `💸 ${esc(c.nombre)} pagó ${fmt(tot)}<div style="font-size:15px;margin-top:4px">${numsTxt(porCob)} · ${esc(f.cuenta)}${f.dos && f.cuenta2 ? ' + ' + esc(f.cuenta2) : ''}${f.conEnvio ? ' · con envío' : ''}</div>`, cid: c.id, pagos: gs.map(g => g.id) };
    cerrarClientaDesp(); render(); focoBuscar(); window.scrollTo(0, 0); return;
  }
  if (porCob.length && !f.cuenta) return toast('Elegí cómo pagó (o "Sin confirmar") antes de despachar');
  if (t === 'agencia') {
    const falta = []; if (!String(f.agencia || '').trim()) falta.push('la agencia'); if (!String(f.ciudad || '').trim()) falta.push('la ciudad');
    if (falta.length) return alert('⚠️ No salió.\n\nFalta cargar ' + falta.join(' y ') + '.');
    editarClienta(c, { agencia: f.agencia, nombreEnvio: f.nombreEnvio, ci: f.ci, ciudad: f.ciudad, depto: f.depto, direccion: f.direccion });
  }
  if (t === 'cadeteria') {
    const falta = faltaCadeteria(f.direccion, f.cobro, f.monto);
    if (falta.length) return alert('⚠️ No salió.\n\nFalta cargar ' + falta.join(' y ') + '.');
    if (f.barrio && !barrioCanon(f.barrio)) return alert('⚠️ "' + f.barrio + '" no está en la lista de barrios de GrisalExpress.\n\nElegilo de las sugerencias o dejalo vacío.');
    editarClienta(c, { nombreEnvio: f.nombreEnvio, direccion: f.direccion, barrio: f.barrio, notaCadete: f.notaCadete });
  }
  const k = crearPaquete(c, ps, t, f, f.cuenta === 'sin' ? porCob.map(p => p.id) : []);
  if (porCob.length && f.cuenta !== 'sin') {
    const gs = registrarPagos(porCob, f, t === 'cadeteria' && f.conEnvio, k);
    k.pagos = gs.map(g => g.id); k.transferido = gs.reduce((s2, g) => s2 + (+g.monto || 0), 0); k.cuenta = f.dos && f.cuenta2 ? f.cuenta + ' + ' + f.cuenta2 : f.cuenta;
    savePaquetes();
  }
  D.res = { paqId: k.id };
  cerrarClientaDesp(); render();
  if (t === 'retiro') focoBuscar(); else setTimeout(() => { const b = $('#dsp-print'); if (b) b.focus(); }, 30);
}
function deshacerPaquete(id) {
  const k = paqById(id); if (!k) return;
  const c = cliById(k.clienteId) || { nombre: '?' };
  if (!confirm(`¿Deshacer la salida de ${c.nombre} (${k.nums.map(n => '#' + n).join(' · ')})?\n\nLos pedidos vuelven a como estaban y se anula el pago marcado al despachar.`)) return;
  (k.pagos || []).forEach(anularPago);
  if ((k.pagos || []).length) savePagos();
  for (const a of k.antes || []) {
    const p = pedById(a.id); if (!p || p.paqueteId !== k.id) continue;
    setEstado(p, a.estado);
    p.entrega = a.entrega; p.cobroEnvio = a.cobroEnvio; p.cobroMonto = a.cobroMonto;
    if (a.tipoEnvio == null) delete p.tipoEnvio; else p.tipoEnvio = a.tipoEnvio;
    p.fechas = Object.assign({}, a.fechas);
    delete p.salida; delete p.paqueteId; delete p.salioCon;
  }
  DB.paquetes = DB.paquetes.filter(x => x.id !== id);
  savePaquetes(); guardar();
  UI.desp.res = { cls: 'mu', html: `↩️ Se deshizo la salida de ${esc(c.nombre)}`, cid: c.id };
  render();
}
/** Una etiqueta por paquete: la del pedido principal, con el número y los artículos de todo el paquete. */
function etqPaqueteHTML(k) {
  const ps = k.pedidos.map(pedById).filter(Boolean), m = pedById(k.principal) || ps[0];
  if (!m) return '';
  const v = Object.assign({}, m, { num: ps.length > 1 ? ps.map(p => p.num).join('+') : m.num, prendas: ps.flatMap(p => p.prendas || []) });
  if (!ps.every(p => p.cambio)) v.cambio = null;
  if (k.tipo === 'cadeteria') { v.cobroEnvio = k.cobro ? 'monto' : 'pago'; v.cobroMonto = k.cobro || 0; v.tipoEnvio = k.tipoEnvio || 'comun'; return etqCadeteHTML(v); }
  if (k.tipo === 'agencia') return etqAgenciaHTML(Object.assign({}, cliById(k.clienteId) || {}, k.envio || {}));
  return etqHTML(v);
}
/** Etiqueta 10×15 de agencia (diseño aprobado el 29/10): logo de la marca, Tel y RUT del negocio, destinatario, datos con
 *  íconos (el pin va una sola vez: ciudad + departamento si es distinto; dirección solo si hay) y abajo SOLO el nombre de la agencia.
 *  Medidas en "px del diseño" (1024×1536); ETQ_U las pasa a mm. Sin QR, sin número ni artículos. */
const ETQ_U = 0.096639;
const _eu = n => (n * ETQ_U).toFixed(3) + 'mm';
function etqAncho(txt, peso, px) {
  try {
    if (document.fonts && document.fonts.check(peso + ' 100px Poppins')) {
      const cv = etqAncho.cv || (etqAncho.cv = document.createElement('canvas').getContext('2d'));
      cv.font = peso + ' ' + px + 'px Poppins';
      return cv.measureText(txt).width;
    }
  } catch (e) { /* cae al cálculo aproximado */ }
  return txt.length * px * (peso >= 700 ? 0.72 : 0.68);
}
function etqFit(txt, peso, max, maxW) { const w = etqAncho(txt, peso, max); return w > maxW ? max * maxW / w : max; }
function etqNombre2(nombre) {
  const ws = String(nombre || '').trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (ws.length <= 1) return [ws.join(' ')];
  let best = [ws.join(' ')], bd = 1e9;
  for (let i = 1; i < ws.length; i++) {
    const a = ws.slice(0, i).join(' '), b = ws.slice(i).join(' '), d = Math.abs(a.length - b.length);
    if (d < bd) { bd = d; best = [a, b]; }
  }
  return best;
}
function etqAgenciaHTML(d) {
  const ciudad = String(d.ciudad || '').trim(), depto = String(d.depto || '').trim();
  let ub = ciudad;
  if (depto && depto.toLowerCase() !== ciudad.toLowerCase()) ub = ciudad ? ciudad + ', ' + depto : depto;
  ub = (ub || '________').toUpperCase();
  const lineas = etqNombre2(d.nombre || d.nombreEnvio || '');
  const nomS = Math.min(128, ...lineas.map(l => etqFit(l || ' ', 700, 128, 830)));
  const nomL = nomS * 0.7 + 30;
  const dir = String(d.direccion || '').trim(), conDir = !!dir, pitch = conDir ? 80 : 98;
  const ubS = etqFit(ub, 400, 54, 730);
  const ag = String(d.agencia || '________').toUpperCase();
  const agS = etqFit(ag, 700, 128, 740);
  const telRut = 'Tel ' + negocio('tel') + '  ·  RUT ' + negocio('rut');
  const conS = etqFit(telRut, 500, 34, 672);
  const im = k => `<img src="${ETQ_IMG[k].src}" style="width:${_eu(ETQ_IMG[k].w)};height:${_eu(ETQ_IMG[k].h)}" alt="">`;
  const fila = (k, txt, sz) => `<div class="ag2-r" style="height:${_eu(pitch)}"><div class="ag2-ic">${im(k)}</div><div class="ag2-rt" style="font-size:${_eu(sz)}">${esc(txt)}</div></div>`;
  return `<div class="lbl ag2"><div class="ag2-in">
    <div class="ag2-c" style="top:${_eu(52)}">${im('logo')}</div>
    <div class="ag2-c" style="top:${_eu(361.1)};font-size:${_eu(conS)};font-weight:500">${esc(telRut)}</div>
    <div class="ag2-hr" style="left:${_eu(72)};top:${_eu(434)};width:${_eu(347)}"></div>
    <div class="ag2-hr" style="left:${_eu(533)};top:${_eu(434)};width:${_eu(347)}"></div>
    <div class="ag2-c" style="top:${_eu(436 - 30)};font-size:${_eu(48)};font-weight:900">YF</div>
    <div class="ag2-fl">
      <div class="ag2-lab">DESTINATARIO</div>
      <div class="ag2-nom" style="font-size:${_eu(nomS)};line-height:${_eu(nomL)}">${lineas.map(l => esc(l)).join('<br>')}</div>
      <div style="margin-top:${_eu(conDir ? 19 : 45)}">
        ${fila('person', 'C.I. ' + (d.ci || '________'), 54)}
        ${fila('phone', 'Tel  ' + (d.tel || '________'), 54)}
        ${fila('pin', ub, ubS)}
        ${conDir ? `<div class="ag2-dir">${esc(dir)}</div>` : ''}
      </div>
    </div>
    <div class="ag2-box" style="font-size:${_eu(agS)}">${esc(ag)}</div>
  </div></div>`;
}
// En hoja A4, cada etiqueta de agencia sale sola en su hoja, con el mismo tamaño y diseño que la térmica 10×15
const _hojasHTMLbase = hojasHTML;
hojasHTML = function (etiquetas) {
  if (impEnviosTermica()) return _hojasHTMLbase(etiquetas);
  const sola = e => e.includes('lbl ag2') || e.includes('lbl grs'), ag = etiquetas.filter(sola), resto = etiquetas.filter(e => !sola(e));
  return (resto.length ? _hojasHTMLbase(resto) : '') + ag.map(e => `<div class="sheet-t a4ag">${e}</div>`).join('');
};
// Etiqueta de pedido con agencia (desde Pedidos): el mismo diseño nuevo
const _etqHTMLbase = etqHTML;
etqHTML = function (p) {
  const c = cliById(p.clienteId);
  return c && c.agencia ? etqAgenciaHTML(Object.assign({}, c, { nombre: c.nombreEnvio || c.nombre })) : _etqHTMLbase(p).replace(`<div class="l-num">#${p.num}</div>`, `<div class="l-num">#${p.num}${otrosAbiertosMarca(p)}</div>`);
};
async function imprimirPaquete(id) {
  const k = paqById(id); if (!k) return;
  // Cadetería con Grisal conectado: primero pasa la fila a la planilla (si no está) y después imprime SU etiqueta, con el QR que lee el cadete
  if (k.tipo === 'cadeteria' && grisalConectado()) {
    if (!k.grisalEnviado && !k.grisalCopiado) { const ok = await pasarAGrisal([k]); if (!ok) return; }
    if (k.grisalOrden) return imprimir(hojasHTML([etqGrisalHTML(k)]), 'etiquetas');
  }
  imprimir(hojasHTML([etqPaqueteHTML(k)]), 'etiquetas');
}
// ── GrisalExpress: filas de los paquetes de cadetería de hoy, listas para pegar ──
async function copiarGrisalHoy() {
  const ks = paquetesDeHoy().filter(k => k.tipo === 'cadeteria').reverse();
  if (!ks.length) return toast('Hoy no salió nada por cadetería');
  let usar = ks.filter(k => !k.grisalCopiado);
  if (!usar.length) { if (!confirm(`Las ${ks.length} de hoy ya se copiaron. ¿Copiarlas todas de nuevo?`)) return; usar = ks; }
  const [y, mo, d] = hoyISO().split('-'), fecha = d + '/' + mo + '/' + y.slice(2);
  const filas = usar.map(k => {
    const c = cliById(k.clienteId) || {}, e = k.envio || {};
    return ['', k.tipoEnvio === 'cambio' ? 'Cambio' : 'Común', e.nombre || c.nombreEnvio || c.nombre || '', telLegible(e.tel || c.tel), e.direccion || c.direccion || '', e.barrio || c.barrio || '', k.cobro || 0, 'Paquete chico', fecha, e.nota || c.notaCadete || ''].map(limpioTSV);
  });
  const txt = filas.map(f => f.join('\t')).join('\n');
  const ok = await copiarTexto(txt);
  if (!ok) showModal(`<h3>📋 Copiá a mano</h3><p class="small muted mb">El navegador no dejó copiar solo. Seleccioná todo y copiá:</p><textarea style="min-height:200px;font-family:var(--mono);font-size:12px" onfocus="this.select()">${esc(txt)}</textarea><div class="row mt"><span class="grow"></span><button class="b pri" data-act="closeModal">Listo</button></div>`);
  const ts = ahoraISO(); usar.forEach(k => { k.grisalCopiado = ts; });
  savePaquetes();
  if (ok) toast(`📋 ${filas.length} fila${filas.length > 1 ? 's' : ''} copiada${filas.length > 1 ? 's' : ''} · pegalas en la columna N Orden de GrisalExpress`, 5000);
  render();
}
function hojaCadeteHoy() {
  const ids = paquetesDeHoy().filter(k => k.tipo === 'cadeteria').reverse().flatMap(k => k.pedidos);
  if (!ids.length) return toast('Hoy no salió nada por cadetería');
  imprimir(hojaCadeteHTML({ escaneados: ids }, false), 'hoja');
}
function verPedidoDesp(id) {
  const p = pedById(id); if (!p) return;
  const c = cliById(p.clienteId) || { nombre: '?' }, l = liveById(p.liveId) || { nombre: '?' }, t = calc(p);
  const cuerpo = p.cambio
    ? `<div class="box small"><div>⬅️ <b>Entró:</b> ${esc(p.cambio.entra.join(', ') || '—')}</div><div style="margin-top:4px">➡️ <b>Sale:</b> ${esc(p.cambio.sale.join(', ') || '—')}</div></div>`
    : (p.prendas.length ? p.prendas.map(pr => `<div class="pr"><div class="pr-n">${esc(pr.nombre)}${pr.codigo ? '<small>' + esc(pr.codigo) + '</small>' : ''}</div><span class="mono">x${pr.qty || 1}</span><div class="pr-p">${precioHTML(pr)}</div></div>`).join('') : '<div class="small muted">Sin prendas</div>')
      + (typeof descLineasHTML === 'function' ? descLineasHTML(t) : t.descMonto ? `<div class="tot-l" style="color:var(--ac)"><span>🎉 Descuento ${t.desc}%</span><span>−${fmt(t.descMonto)}</span></div>` : '')
      + (t.saldo ? `<div class="tot-l" style="color:var(--ok)"><span>💰 Saldo a favor</span><span>−${fmt(t.saldo)}</span></div>` : '')
      + `<div class="tot-l big"><span>Total</span><span>${fmt(t.total)}</span></div>`;
  showModal(`<h3>#${p.num} · ${esc(c.nombre)}</h3>
    <div class="small muted mb">${esc(l.nombre)} · ${fechaUY(p.fechas.creado || l.fecha)} · código <span class="mono">${p.codigo}</span> · ${ESTADO_TXT[p.estado]}</div>
    ${cuerpo}
    ${p.pago ? `<div class="alert ok">✓ Pagó por ${esc(p.pago.cuenta)} el ${fechaUY(localISO(new Date(p.pago.fecha)))}</div>` : ''}
    ${p.notas ? `<div class="alert pe">📝 ${esc(p.notas)}</div>` : ''}
    <div class="row mt"><button class="b gh" data-act="irPedido" data-id="${p.id}">Abrir en Live</button><span class="grow"></span><button class="b pri" data-act="closeModal">Cerrar</button></div>`);
}

// ── Búsqueda y escaneo ──
function cerrarSug() { const s = $('#dsp-sug'); if (s) s.classList.remove('on'); UI.desp.items = []; }
function despSug() {
  const D = UI.desp, q = D.q.trim(), sug = $('#dsp-sug'); if (!sug) return;
  if (!q) return cerrarSug();
  const items = [];
  const dig = q.replace(/\D/g, '');
  if (/^\d{3,6}$/.test(q)) { const p = todosPedidos().find(x => x.codigo === dig.padStart(5, '0')); if (p) items.push({ p }); }
  if (!esGrisal(q)) {
    const cs = buscarClientas(q).map(c => ({ c, n: abiertosDe(c.id).length }));
    cs.sort((a, b) => (b.n > 0) - (a.n > 0));
    items.push(...cs);
  }
  D.items = items; D.idx = 0;
  if (!items.length) { sug.innerHTML = `<div class="si" style="cursor:default;color:var(--mu)">${esGrisal(q) ? 'Enter para buscar la etiqueta de GrisalExpress' : 'Sin resultados'}</div>`; sug.classList.add('on'); return; }
  const m = stats();
  sug.innerHTML = items.map((it, i) => it.p
    ? `<div class="si${i === 0 ? ' hi' : ''}" data-act="despPick" data-i="${i}">🏷️ Pedido <b>#${it.p.num}</b> · ${esc((cliById(it.p.clienteId) || {}).nombre || '?')} <span class="chip ${ESTADO_CHIP[it.p.estado]}">${ESTADO_TXT[it.p.estado]}</span><div class="sub">código ${it.p.codigo} · ${esc((liveById(it.p.liveId) || {}).nombre || '')}</div></div>`
    : `<div class="si${i === 0 ? ' hi' : ''}" data-act="despPick" data-i="${i}"><b>${nomAlias(it.c)}</b> ${histHTML(m[it.c.id])}<div class="sub">${it.c.tel ? esc(it.c.tel) : 'sin tel'} · ${it.n ? `<span style="color:var(--pe)">${it.n} sin salida</span>` : 'nada pendiente'}</div></div>`).join('');
  sug.classList.add('on');
}
function despPick(i) {
  const it = UI.desp.items[i]; if (!it) return;
  if (it.p) return abrirPorCodigo(it.p);
  abrirClientaDesp(it.c.id);
}
/** Escaneo o código: si es un retiro pagado y no tiene otros abiertos, se entrega directo. */
function abrirPorCodigo(p) {
  const D = UI.desp, c = cliById(p.clienteId) || { nombre: '?', id: null };
  D.q = ''; const q = $('#dsp-q'); if (q) q.value = '';
  cerrarSug();
  if (p.estado === 'enviado') {
    const k = p.paqueteId && paqById(p.paqueteId);
    const como = k ? { retiro: '🏠 se entregó', agencia: '📦 salió por agencia', cadeteria: '🚴 salió por cadetería' }[k.tipo] : '🚚 salió';
    D.res = { cls: 'mu', html: `#${p.num} ${esc(c.nombre)}: ya ${como} el ${fechaUY(p.fechas.enviado)}${k && k.nums.length > 1 ? ' (junto con ' + esc(k.nums.filter(n => n !== p.num).map(n => '#' + n).join(' · ')) + ')' : ''}`, cid: c.id };
    cerrarClientaDesp(); render(); focoBuscar(); return;
  }
  if (!esActivo(p.estado)) {
    D.res = { cls: 'li', html: `⚠️ #${p.num} ${esc(c.nombre)} está ${ESTADO_TXT[p.estado].toUpperCase()}`, cid: c.id };
    cerrarClientaDesp(); render(); focoBuscar(); return;
  }
  const ab = abiertosDe(p.clienteId);
  if (entregaEf(p) === 'retiro' && !porCobrar(p) && ab.length === 1 && !avisosDe(ab).length) {
    const k = crearPaquete(c, [p], 'retiro', {}, []);
    D.res = { paqId: k.id };
    cerrarClientaDesp(); render(); focoBuscar(); return;
  }
  abrirClientaDesp(p.clienteId, [p.id]);
}
function buscarEnter() {
  const D = UI.desp, q = D.q.trim(); if (!q) return;
  if (esGrisal(q)) {
    const Q = q.trim().toUpperCase(), orden = Q.replace(/^(EMA)?EMMA/, ''), sinEma = Q.replace(/^EMA(?=EMMA)/, '');
    const k = (DB.paquetes || []).find(x => x.grisalOrden && [Q, orden, sinEma].includes(x.grisalOrden.toUpperCase()));
    D.q = ''; $('#dsp-q').value = ''; cerrarSug();
    if (k) { const p = pedById(k.principal); if (p) return abrirPorCodigo(p); }
    D.res = { cls: 'pe', html: `Etiqueta de GrisalExpress ${esc(orden)}: todavía no está vinculada a un paquete` };
    render(); focoBuscar(); return;
  }
  const dig = q.replace(/\D/g, '');
  if (/^\d{4,6}$/.test(q)) {
    const p = todosPedidos().find(x => x.codigo === dig.padStart(5, '0'));
    if (p) return abrirPorCodigo(p);
    D.q = ''; $('#dsp-q').value = ''; cerrarSug();
    D.res = { cls: 'li', html: `❌ ${esc(dig.padStart(5, '0'))}: no hay ningún pedido con ese código` };
    render(); focoBuscar(); return;
  }
  if (!D.items.length) despSug();
  if (D.items.length) despPick(Math.min(D.idx, D.items.length - 1));
}

Object.assign(ACT, {
  despPick: d => despPick(+d.i),
  despDarSalida: d => {
    const ids = String(d.ids || '').split(',').filter(Boolean); UI.desp.res = null;
    abrirClientaDesp(d.cid, ids, d.t);
    if (ENVIOS.has(d.t)) { elegirSalida(d.t); render(); }   // en el celu abre en "Solo pago": acá queremos la salida
  },
  despArmar: d => { const a = listaTipo(d.t), g = a.find(x => x.cid === d.cid); UI.desp.res = null; abrirClientaDesp(d.cid, g ? g.ps.map(p => p.id) : null, d.t); },
  despAbrir: d => { UI.desp.res = null; abrirClientaDesp(d.cid); },
  despCerrar: () => { cerrarClientaDesp(); render(); focoBuscar(); },
  despTog: (d, el, e) => {
    const D = UI.desp; D.sel.has(d.id) ? D.sel.delete(d.id) : D.sel.add(d.id);
    D.sinPago = false;
    if (D.sel.size && !D.salida) { const ts = new Set([...D.sel].map(id => entregaEf(pedById(id)))); if (ts.size === 1 && ENVIOS.has([...ts][0])) elegirSalida([...ts][0]); }
    render();
  },
  despTodos: () => { const D = UI.desp, ab = abiertosDe(D.cid); D.sel = D.sel.size === ab.length ? new Set() : new Set(ab.map(p => p.id)); D.sinPago = false; render(); },
  despVer: (d, el, e) => { if (e) e.stopPropagation(); verPedidoDesp(d.id); },
  despSal: d => {
    elegirSalida(d.k); render();
    setTimeout(() => { const el = d.k === 'agencia' ? $('#dsf-agencia') : d.k === 'cadeteria' ? $('#dsf-direccion') : $('#dsp-go'); if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'center' }); } }, 30);
  },
  // 9/11: la cadetería cobra todo (pedido + envío + extra de cobro, hoy $70) a clientes de confianza que autoriza el equipo. Sale sin pago marcado y la planilla de Grisal lleva el monto en "Cobrar".
  despCobraTodo: () => {
    const f = UI.desp.f, ps = [...UI.desp.sel].map(pedById).filter(p => p && porCobrar(p));
    if (!ps.length) return toast('Estos pedidos ya tienen el pago marcado');
    const base = ps.reduce((s, p) => s + calc(p).total, 0), tar = +cfg('tarifaEnvio') || 0;
    f.cobro = 'monto'; f.monto = String(base + tar + extraCobroCadete()); f.conEnvio = false; f.cuenta = 'sin'; f.transfEdit = false;
    toast('Cobra la cadetería ' + fmt(base + tar + extraCobroCadete()) + ' (pedido ' + fmt(base) + ' + envío ' + fmt(tar) + ' + extra ' + fmt(extraCobroCadete()) + ')'); render();
  },
  despFv: d => { UI.desp.f[d.f] = d.v; if (d.f === 'cobro' && d.v !== 'pago') UI.desp.f.conEnvio = false; render(); if (d.f === 'cobro' && d.v === 'monto') setTimeout(() => { const el = $('#dsf-monto'); if (el) el.focus(); }, 20); },
  despCuenta: d => {
    let cta = d.c;
    if (!cta) { cta = (prompt('¿En qué cuenta entró la transferencia?') || '').trim(); if (!cta) return; }
    const f = UI.desp.f; f.cuenta = f.cuenta === cta ? null : cta; if (f.cuenta2 === f.cuenta) f.cuenta2 = null; f.transfEdit = false; render();
  },
  despPlazo: d => { UI.desp.f.plazo = sumarDias(hoyISO(), +d.d); render(); },
  despDos: () => { const f = UI.desp.f; f.dos = !f.dos; if (!f.dos) { f.cuenta2 = null; f.monto2 = ''; } f.transfEdit = false; render(); },
  despCuenta2: d => { const f = UI.desp.f; f.cuenta2 = f.cuenta2 === d.c ? null : d.c; f.transfEdit = false; render(); setTimeout(() => { const el = $('#dsf-monto2'); if (el) el.focus(); }, 20); },
  despDeshacerPago: () => {
    const r = UI.desp.res; if (!r || !r.pagos) return;
    if (!confirm('¿Deshacer este pago?')) return;
    r.pagos.forEach(id => { const g = DB.pagos.find(x => x.id === id), p = g && pedById(g.pedidoId);
      if (p && p.pago && p.pago.conEnvio && p.estado !== 'enviado' && p.cobroEnvio === 'pago') { p.cobroEnvio = null; }
      anularPago(id); });
    savePagos(); guardar(); UI.desp.res = { cls: 'mu', html: '↩️ Pago deshecho', cid: r.cid }; render();
  },
  despConEnvio: () => {
    const f = UI.desp.f; f.conEnvio = !f.conEnvio;
    if (f.conEnvio) { f._cobroAntes = f.cobro; f.cobro = 'pago'; } else if (f.cobro === 'pago') f.cobro = f._cobroAntes === 'pago' ? 'pago' : (f._cobroAntes || null);
    f.transfEdit = false; render();
  },
  despVista: d => { UI.desp.vista = d.v; render(); },
  despFiltro: d => { UI.desp.filtro = UI.desp.filtro === d.t ? 'todos' : d.t; UI.desp.filtroHoy = null; render(); },
  despFiltroHoy: d => { UI.desp.filtroHoy = d.t; render(); },
  despGo: () => despGo(),
  despPrint: d => imprimirPaquete(d.k),
  despDeshacer: d => deshacerPaquete(d.k),
  despResX: () => { UI.desp.res = null; render(); focoBuscar(); },
  despGrisal: () => copiarGrisalHoy(),
  despGrisalPasar: () => pasarAGrisal(),
  despHoja: () => hojaCadeteHoy()
});
Object.assign(INP, {
  despQ: el => { UI.desp.q = el.value; despSug(); },
  despF: el => {
    UI.desp.f[el.dataset.f] = el.value;
    if (el.dataset.f === 'transf') UI.desp.f.transfEdit = true;
    if (el.dataset.f === 'plazo') { const b = $('#dsp-go'); if (b && el.value) b.textContent = '⏸️ Guardar sin pagar hasta el ' + fechaUY(el.value, 1); }
    if (el.dataset.f === 'monto2') {
      const D = UI.desp, f = D.f, porCob = [...D.sel].map(pedById).filter(p => p && sinSalir(p) && porCobrar(p)), v = dosV0(porCob, D.salida, f);
      const r = $('#dsf-dos-res'); if (r) r.innerHTML = dosResTxt(f, v);
      const b = $('#dsp-go'); if (b) b.disabled = !(v && v.ok);
      const tr = $('#dsf-transf'); if (tr && !f.transfEdit && v && v.ok) tr.value = String(v.tot1);
    }
    // El texto del botón de cadetería muestra el monto: se actualiza sin re-dibujar la pantalla
    if (el.dataset.f === 'monto') { const b = $('#dsp-go'); if (b && UI.desp.salida === 'cadeteria') b.textContent = '🚴 Despachar por cadetería' + (num(el.value) > 0 ? ' · cobra ' + fmt(num(el.value)) : ''); }
  }
});
document.addEventListener('keydown', e => {
  if (UI.tab !== 'despacho' || $('#modal').classList.contains('on')) return;
  const el = e.target;
  if (el.id === 'dsp-q') {
    const D = UI.desp, sug = $('#dsp-sug');
    if (e.key === 'ArrowDown' && D.items.length) { e.preventDefault(); D.idx = Math.min(D.idx + 1, D.items.length - 1); marcarSug(); }
    else if (e.key === 'ArrowUp' && D.items.length) { e.preventDefault(); D.idx = Math.max(D.idx - 1, 0); marcarSug(); }
    else if (e.key === 'Enter') { e.preventDefault(); buscarEnter(); }
    else if (e.key === 'Escape') { if (sug.classList.contains('on')) cerrarSug(); else if (D.cid) { cerrarClientaDesp(); render(); } }
    return;
  }
  if (e.key === 'Escape' && UI.desp.cid && !el.closest('.sw')) { cerrarClientaDesp(); render(); focoBuscar(); return; }
  // Lector de códigos: si el foco no está en un campo, lo que se escanea va al buscador
  const libre = el === document.body || el.tagName === 'BUTTON' || el.classList.contains('dsp-p');
  if (libre && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && /[\w]/.test(e.key) && e.key !== ' ') { const q = $('#dsp-q'); if (q) q.focus(); }
}, true);
function marcarSug() { document.querySelectorAll('#dsp-sug .si').forEach((x, i) => { x.classList.toggle('hi', i === UI.desp.idx); if (i === UI.desp.idx) x.scrollIntoView({ block: 'nearest' }); }); }
document.addEventListener('click', e => { if (!e.target.closest('#p-despacho .sw')) { const s = document.getElementById('dsp-sug'); if (s) s.classList.remove('on'); } });
window.addEventListener('afterprint', () => { if (UI.tab === 'despacho') focoBuscar(); });
// Al entrar a Despacho en la compu, el cursor queda listo para el lector (en el celular no, para no abrir el teclado)
const _actTab = ACT.tab;
ACT.tab = d => { _actTab(d); if (d.t === 'despacho' && window.matchMedia && matchMedia('(pointer:fine)').matches) focoBuscar(); };

// ── Etiqueta de agencia: logo e íconos (PNG negro con transparencia, embebidos) y precarga de fuente e imágenes ──
// Se cargan antes de imprimir para que la etiqueta salga completa (el área de impresión está oculta y no los pediría sola).
const ETQ_IMG = {"logo":{"w":436,"h":285,"src":"data:image/png;base64,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"},"person":{"w":59,"h":66,"src":"data:image/png;base64,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"},"phone":{"w":62,"h":64,"src":"data:image/png;base64,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"},"pin":{"w":58,"h":78,"src":"data:image/png;base64,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"}};
try {
  Object.values(ETQ_IMG).forEach(o => { const i = new Image(); i.src = o.src; if (i.decode) i.decode().catch(() => {}); });
  if (document.fonts && document.fonts.load) ['400', '500', '700', '900'].forEach(w => document.fonts.load(w + ' 20px Poppins').catch(() => {}));
} catch (e) { /* si falla, imprime igual */ }

// ─── Pasar a Grisal directo a la planilla (31/10) ──────────────
// La app manda las cadeterías de hoy a un Apps Script de Yoan (app web) que escribe en la hoja "ingresos" de Grisal.
// URL y clave en config (grisalUrl, grisalClave): nunca en el código (el repo es público).
const GRISAL_LETRAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function grisalOrdenNuevo() {
  for (;;) {
    let c = ''; const r = crypto.getRandomValues(new Uint32Array(8));
    for (let i = 0; i < 8; i++) c += GRISAL_LETRAS[r[i] % GRISAL_LETRAS.length];
    if (/\d/.test(c) && /[A-Z]/.test(c) && !(DB.paquetes || []).some(k => k.grisalOrden === c)) return c;   // 8 caracteres: el QR de Grisal es "EMMA" + N Orden
  }
}
const grisalConectado = () => !!(cfg('grisalUrl') && cfg('grisalClave'));
const grisalPendientes = () => paquetesDeHoy().filter(k => k.tipo === 'cadeteria' && !k.grisalEnviado && !k.grisalCopiado);   // las copiadas a mano ya están en la planilla
let _grisalOcupado = false;
async function pasarAGrisal(solo) {
  if (_grisalOcupado) return false;
  const ks = solo || grisalPendientes().reverse();
  if (!ks.length) return toast('Las cadeterías de hoy ya están en Grisal ✓');
  const [y, mo, d] = hoyISO().split('-'), fecha = d + '/' + mo + '/' + y.slice(2);
  ks.forEach(k => { if (!k.grisalOrden) k.grisalOrden = grisalOrdenNuevo(); });
  savePaquetes();   // el código queda guardado antes de mandar: si se reintenta, no se duplica la fila
  const filas = ks.map(k => {
    const c = cliById(k.clienteId) || {}, e = k.envio || {};
    return { orden: k.grisalOrden, tipo: k.tipoEnvio === 'cambio' ? 'Cambio' : 'Común', nombre: e.nombre || c.nombreEnvio || c.nombre || '', tel: telLegible(e.tel || c.tel), direccion: e.direccion || c.direccion || '', zona: e.barrio || c.barrio || '', cobrar: k.cobro || 0, producto: 'Paquete chico', fecha, detalles: e.nota || c.notaCadete || '' };
  });
  _grisalOcupado = true; toast('🚴 Pasando ' + filas.length + ' a Grisal…', 3000);
  try {
    const r = await fetch(cfg('grisalUrl'), { method: 'POST', body: JSON.stringify({ clave: cfg('grisalClave'), filas, marcar: !!cfg('grisalMarcar') }) });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || 'error');
    const ts = ahoraISO(); let n = 0;
    j.filas.forEach(f => { const k = ks.find(x => x.grisalOrden === f.orden); if (k && f.fila) { k.grisalEnviado = ts; k.grisalFila = f.fila; k.grisalCopiado = k.grisalCopiado || ts; n++; } });
    savePaquetes();
    toast(n === filas.length ? `✓ ${n} cadetería${n > 1 ? 's' : ''} en la planilla de Grisal` : `⚠️ Pasaron ${n} de ${filas.length}: probá de nuevo`, 5000);
    return n === filas.length;
  } catch (err) {
    toast('⚠️ No se pudo pasar a Grisal (' + String(err.message || err).slice(0, 60) + '). Probá de nuevo o usá "Copiar".', 7000);
    return false;
  } finally { _grisalOcupado = false; render(); }
}

// ─── Etiqueta 10×15 de GrisalExpress (31/10) ──────────────────
// Copia de la plantilla de Grisal ("Tablas ETIQUETA10X15"). El QR es "EMMA" + N Orden, igual que el que genera Grisal (verificado con una etiqueta real).
const GRISAL_LOGO = '';   // cadetería de la otra tienda: no aplica
// Remitente de la etiqueta de Grisal: nombre en etiquetas y teléfono del negocio (negocio.js / Config)
const _gIco = {
  casa: '<svg viewBox="0 0 24 24"><path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>',
  tel: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path fill="#fff" d="M9.2 6.5 7.7 7.4c-.6.4-.8 1.3-.4 2.4a13 13 0 0 0 6.9 6.9c1.1.4 2 .2 2.4-.4l.9-1.5-2.4-1.6-1.1 1a7 7 0 0 1-3.2-3.2l1-1.1z"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.2 1.1 4.2 3 5.6L4 21l4.6-2.4c1.1.3 2.2.4 3.4.4 5.5 0 10-3.6 10-8s-4.5-8-10-8zM7.5 12.3a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm4.5 0a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" fill="#000"/></svg>'
};
(function () {
  const st = document.createElement('style');
  st.textContent = `
.sheet-t:has(>.lbl.grs){padding:0}
.lbl.grs,.sheet-t>.lbl.grs{flex:none;align-self:flex-start;box-sizing:border-box;width:100mm;height:149mm;padding:2mm 2.3mm 3mm;font-family:'Poppins',Arial,sans-serif;color:#000;background:#fff;display:flex;flex-direction:column;gap:1.6mm;overflow:hidden;line-height:1.15}
.grs-top{display:flex;align-items:flex-start;gap:2mm;height:27mm;flex:none}
.grs-logo{width:52mm;text-align:center;padding-top:3mm}.grs-logo img{width:45mm;display:block;margin:0 auto}.grs-web{font-weight:700;font-size:8.2pt;margin-top:.6mm;white-space:nowrap}
.grs-der{flex:1;display:flex;flex-direction:column;align-items:center;gap:4mm;padding-top:5mm}.grs-fecha{font-weight:500;font-size:10.5pt}
.grs-tipo{background:#000;color:#fff;border-radius:5mm;font-weight:700;font-size:11pt;width:36mm;height:9.6mm;display:flex;align-items:center;justify-content:center}
.grs-box{border:.55mm solid #000;border-radius:2.6mm;padding:2mm 2.5mm}
.grs-lab{font-weight:700;font-size:7.5pt}
.grs-d{flex:none}
.grs-dest{font-weight:700;text-align:center;line-height:1.05;margin:2mm 0 2.5mm;word-break:break-word}
.grs-mid{flex:1;display:flex;flex-direction:column;gap:2.4mm;min-height:0;padding-top:2.5mm}.grs-fila{flex:1;display:flex;gap:1.5mm;min-height:0}
.grs-dat{flex:1;display:flex;flex-direction:column;gap:2.4mm;min-width:0}
.grs-f{display:flex;align-items:center;gap:2mm;font-size:12.5pt;word-break:break-word}.grs-f svg{width:3.8mm;height:3.8mm;flex:none}
.grs-f.dir,.grs-f.tel,.grs-f .vacio{font-weight:700}.grs-f.chat{font-size:9pt;align-items:center;margin-top:auto;margin-bottom:6mm}.grs-f.chat svg{width:4.4mm;height:4.4mm}
.grs-pago{background:#eef1f5;border-radius:1.6mm;font-weight:700;font-size:12.5pt;height:10.4mm;display:flex;align-items:center;justify-content:center}
.grs-qr{width:30mm;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:1.5mm}.grs-qr svg{width:29mm;height:29mm;display:block}
.grs-qr .t{font-weight:700;font-size:7.5pt;margin-top:1.4mm}.grs-qr .n{font-weight:700;font-size:13pt;letter-spacing:.2mm;line-height:1.1}
.grs-rem{text-align:center;flex:none;height:32mm;box-sizing:border-box;padding-top:1.5mm}.grs-rem .grs-lab{text-align:left}.grs-rem b{display:block;font-weight:900;font-size:30pt;line-height:.86;letter-spacing:-.2mm;margin-top:-1.4mm}.grs-rem .s{font-size:9.5pt;margin-top:-.6mm;position:relative}.grs-rem i{display:block;font-size:9pt;margin-top:2.8mm}`;
  document.head.appendChild(st);
})();
function etqGrisalHTML(k) {
  const c = cliById(k.clienteId) || {}, e = k.envio || {};
  const nom = String(e.nombre || c.nombreEnvio || c.nombre || '').trim();
  const [y, mo, d] = localISO(new Date(k.fecha || Date.now())).split('-');
  const cobro = +k.cobro || 0, pago = cobro ? 'A cobrar ' + fmt(cobro) : 'Pagado';
  const det = String(e.nota || c.notaCadete || '').trim(), zona = String(e.barrio || c.barrio || '').trim();
  const nomS = nom.length > 26 ? 14 : nom.length > 16 ? 17 : 22;
  return `<div class="lbl grs">
    <div class="grs-top"><div class="grs-logo"><img src="${GRISAL_LOGO}" alt=""><div class="grs-web">www.GrisalExpress.com.uy</div></div>
      <div class="grs-der"><div class="grs-fecha">${d}/${mo}/${y}</div><div class="grs-tipo">${k.tipoEnvio === 'cambio' ? 'Cambio' : 'Común'}</div></div></div>
    <div class="grs-box grs-d"><div class="grs-lab">DESTINATARIO/A</div><div class="grs-dest" style="font-size:${nomS}pt">${esc(nom || '________')}</div></div>
    <div class="grs-box grs-mid">
      <div class="grs-f dir">${_gIco.casa}<span>${esc(e.direccion || c.direccion || '________')}</span></div>
      <div class="grs-fila"><div class="grs-dat">
        <div class="grs-f">${_gIco.pin}<span${zona ? '' : ' class="vacio"'}>${esc(zona || '...')}</span></div>
        <div class="grs-f tel">${_gIco.tel}<span>${esc(telLegible(e.tel || c.tel) || '—')}</span></div>
        <div class="grs-pago">${pago}</div>
        <div class="grs-f chat">${_gIco.chat}<span${det ? '' : ' class="vacio"'}>${esc(det || '...')}</span></div>
      </div>
      <div class="grs-qr">${barcodeSVG('EMMA' + k.grisalOrden)}<div class="t">Nro de Orden</div><div class="n">${esc(k.grisalOrden)}</div></div></div>
    </div>
    <div class="grs-box grs-rem"><div class="grs-lab">REMITENTE</div><b>${esc(negocio('marca')).replace(' ', '<br>')}</b><div class="s">${esc(negocio('tel'))}</div><i>¡Gracias por tu compra!</i></div>
  </div>`;
}
