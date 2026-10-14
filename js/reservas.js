/* ===== Asistente de reservas ===== */
document.addEventListener('DOMContentLoaded', () => {
  /* ===== PARTE 1/2 · Datos, cálculo de precios y resumen de la reserva ===== */
  const EXTRAS = [
    { id:'seguro',   n:'🛡️ Seguro de viaje', d:'Cobertura médica y equipaje', p:45 },
    { id:'traslado', n:'🚐 Traslados privados', d:'Aeropuerto ⇄ hotel', p:30 },
    { id:'guia',     n:'🧑‍🏫 Guía privado', d:'Un día de tour exclusivo', p:60 },
    { id:'hotel',    n:'⭐ Upgrade de hotel', d:'Categoría superior', p:120 }
  ];
  const CUPONES = { VIAJA10: 0.10, HORIZONTE5: 0.05 };

  const st = { step: 1, id: '', fecha: '', adultos: 2, ninos: 0, extras: new Set(), cupon: '', done: false };
  const $f = $('#bookForm');

  /* Opciones iniciales */
  $('#destino').innerHTML = '<option value="">Selecciona un destino…</option>' +
    DESTINOS.map(d => `<option value="${d.id}">${d.nombre} — ${d.pais} (${d.dias} días · ${money(d.precio)})</option>`).join('');
  const hoy = new Date(); hoy.setDate(hoy.getDate() + 3);
  $('#fecha').min = hoy.toISOString().slice(0, 10);
  $('#extras').innerHTML = EXTRAS.map(x => `
    <label class="opt"><input type="checkbox" value="${x.id}"><span><b>${x.n}</b><small>${x.d} · +${money(x.p)} p/p</small></span></label>`).join('');

  const pid = new URLSearchParams(location.search).get('id');
  if (pid && byId(pid)) { st.id = pid; $('#destino').value = pid; }

  /* Cálculo de precios */
  function calc() {
    const d = byId(st.id);
    if (!d) return null;
    const pax = st.adultos + st.ninos;
    const base = d.precio * st.adultos + d.precio * 0.6 * st.ninos;
    const extras = [...st.extras].reduce((s, id) => s + EXTRAS.find(x => x.id === id).p * pax, 0);
    const sub = base + extras;
    const pagoTotal = ($f.querySelector('[name=pago]:checked') || {}).value === '100';
    const dtoCupon = sub * (CUPONES[st.cupon] || 0);
    const dtoTotal = pagoTotal ? (sub - dtoCupon) * 0.05 : 0;
    const total = Math.round(sub - dtoCupon - dtoTotal);
    const hoyPaga = pagoTotal ? total : Math.round(total * 0.3);
    return { d, pax, base, extras, sub, dtoCupon, dtoTotal, total, hoyPaga, pagoTotal };
  }

  function renderSummary() {
    const c = calc(), d = c && c.d;
    const img = $('#sumImg');
    if (d) { img.src = imgUrl(d, 700); img.alt = d.nombre; img.style.display = ''; } else { img.style.display = 'none'; }
    $('#sumName').textContent = d ? d.nombre : 'Elige un destino';
    $('#sumMeta').textContent = d ? `${d.pais} · ${d.dias} días${st.fecha ? ' · salida ' + fmtDate(st.fecha) : ''}` : 'Tu resumen aparecerá aquí.';
    if (!c) { $('#sumLines').innerHTML = ''; return; }
    const L = (a, b, cls = '') => `<div class="line ${cls}"><span>${a}</span><span>${b}</span></div>`;
    $('#sumLines').innerHTML =
      L(`${st.adultos} adulto${st.adultos > 1 ? 's' : ''} × ${money(c.d.precio)}`, money(c.d.precio * st.adultos)) +
      (st.ninos ? L(`${st.ninos} niño${st.ninos > 1 ? 's' : ''} × ${money(Math.round(c.d.precio * 0.6))}`, money(Math.round(c.d.precio * 0.6 * st.ninos))) : '') +
      (c.extras ? L('Extras', money(c.extras)) : '') +
      (c.dtoCupon ? L(`Cupón ${st.cupon}`, '− ' + money(Math.round(c.dtoCupon))) : '') +
      (c.dtoTotal ? L('Pago total (5%)', '− ' + money(Math.round(c.dtoTotal))) : '') +
      L('Total', `<b>${money(c.total)}</b>`, 'total') +
      L(c.pagoTotal ? 'A pagar hoy' : 'A pagar hoy (30%)', `<b>${money(c.hoyPaga)}</b>`);
  }

  const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  renderSummary();
});