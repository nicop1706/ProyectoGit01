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
 
  
 const setErr = (el, bad) => { const f = el.closest('.field'); f && f.classList.toggle('err', bad); return !bad; };
const validators = {
  1() {
    let ok = true;
    ok = setErr($('#destino'), !$('#destino').value) && ok;
    const f = $('#fecha').value, min = $('#fecha').min;
    ok = setErr($('#fecha'), !f || f < min) && ok;
    return ok;
  },
  2() {
    let ok = true;
    ok = setErr($('#nombre'), $('#nombre').value.trim().length < 3) && ok;
    ok = setErr($('#doc'), !/^[A-Za-z0-9]{6,15}$/.test($('#doc').value.trim())) && ok;
    ok = setErr($('#email'), !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#email').value.trim())) && ok;
    ok = setErr($('#tel'), $('#tel').value.replace(/\D/g, '').length < 7) && ok;
    return ok;
  },
  3() { return setErr($('#terms'), !$('#terms').checked); } };  /* Navegación */ function goTo(n) { st.step = n; $$('.wstep').forEach(s => s.classList.toggle('on', +s.dataset.step === n));$$('.pstep').forEach((p, i) => { p.classList.toggle('on', i + 1 === n); p.classList.toggle('done', i + 1 < n); if (i + 1 < n) p.querySelector('i').textContent = '✓'; else p.querySelector('i').textContent = i + 1; });$('#prev').style.visibility = n > 1 && n < 4 ? 'visible' : 'hidden';
  $('#next').textContent = n === 3 ? '✅ Confirmar reserva' : 'Continuar →';
  $('#wnav').style.display = n === 4 ? 'none' : 'flex';
  $('#wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

$('#next').addEventListener('click', () => {
  if (!validators[st.step]()) { toast('⚠️ Revisa los campos marcados'); const e = $('.field.err input,.field.err select'); e && e.focus(); return; }
  if (st.step === 3) { confirmar(); return; }
  goTo(st.step + 1);
});
$('#prev').addEventListener('click', () => goTo(st.step - 1));

/* Eventos de formulario */
$('#destino').addEventListener('change', e => { st.id = e.target.value; setErr(e.target, false); renderSummary(); });
$('#fecha').addEventListener('change', e => { st.fecha = e.target.value; setErr(e.target, false); renderSummary(); });
$f.addEventListener('click', e => {
  const b = e.target.closest('[data-c]'); if (!b) return;
  const k = b.dataset.c, v = st[k] + +b.dataset.d;
  const min = k === 'adultos' ? 1 : 0;
  if (v < min || st.adultos + st.ninos + +b.dataset.d > 12 && +b.dataset.d > 0) { if (v >= min) toast('Para grupos de más de 12 personas, contáctanos 😉'); return; }
  st[k] = v; $('#' + k + 'V').textContent = v; renderSummary();
});
$('#extras').addEventListener('change', e => { e.target.checked ? st.extras.add(e.target.value) : st.extras.delete(e.target.value); renderSummary(); });
$f.querySelectorAll('[name=pago]').forEach(r => r.addEventListener('change', renderSummary));$('#applyCoupon').addEventListener('click', () => {
  const c = $('#cupon').value.trim().toUpperCase();
  if (!c) return;
  if (CUPONES[c]) { st.cupon = c; toast(`🎟️ Cupón aplicado: ${CUPONES[c] * 100}% de descuento`); }
  else { st.cupon = ''; toast('❌ Cupón no válido'); }
  renderSummary();
});
$$('#bookForm input').forEach(i => i.addEventListener('input', () => i.closest('.field') && i.closest('.field').classList.remove('err')));
$f.addEventListener('submit', e => e.preventDefault());

/* Confirmar */
function confirmar() {
  const c = calc(); if (!c) return;
  const code = 'HZ-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const res = {
    code, destino: c.d.nombre, pais: c.d.pais, fecha: st.fecha, adultos: st.adultos, ninos: st.ninos,
    extras: [...st.extras].map(id => EXTRAS.find(x => x.id === id).n.replace(/^\S+\s/, '')),
    nombre: $('#nombre').value.trim(), email: $('#email').value.trim(), tel: $('#tel').value.trim(),
    metodo: $f.querySelector('[name=metodo]:checked').value, total: c.total, hoy: c.hoyPaga, creada: new Date().toISOString()
  };
  store.set('hz_res', [res, ...store.get('hz_res', [])]);
  $('#doneStep').innerHTML = `
    <div class="success">
      <div class="check">✓</div>
      <h2>¡Reserva confirmada, ${esc(res.nombre.split(' ')[0])}!</h2>
      <p style="color:var(--muted)">Enviamos los detalles a <b>${esc(res.email)}</b> (simulado). Tu código de reserva es:</p>
      <div class="code">${res.code}</div>
      <div class="ticket">
        <div class="line"><span>Destino</span><b>${esc(res.destino)}, ${esc(res.pais)}</b></div>
        <div class="line"><span>Salida</span><b>${fmtDate(res.fecha)}</b></div>
        <div class="line"><span>Viajeros</span><b>${res.adultos} adulto(s)${res.ninos ? ' + ' + res.ninos + ' niño(s)' : ''}</b></div>
        ${res.extras.length ? `<div class="line"><span>Extras</span><b>${esc(res.extras.join(', '))}</b></div>` : ''}
        <div class="line"><span>Método de pago</span><b>${esc(res.metodo)}</b></div>
        <div class="line"><span>Pagado hoy</span><b>${money(res.hoy)}</b></div>
        <div class="line total"><span>Total del viaje</span><b>${money(res.total)}</b></div>
      </div>
      <button class="btn" onclick="window.print()">🖨️ Imprimir comprobante</button>
      <a class="btn btn-ghost" href="viajes.html">Seguir explorando</a>
    </div>`;
  goTo(4); renderMyRes();
  toast('🎉 ¡Reserva ' + code + ' confirmada!');
}

/* Mis reservas */
function renderMyRes() {
  const l = store.get('hz_res', []);
  $('#myRes').innerHTML = l.length
    ? `<table class="res"><thead><tr><th>Código</th><th>Destino</th><th>Salida</th><th>Viajeros</th><th>Total</th><th></th></tr></thead><tbody>${
      l.map(r => `<tr><td><b>${r.code}</b></td><td>${esc(r.destino)}</td><td>${fmtDate(r.fecha)}</td><td>${r.adultos + r.ninos}</td><td>${money(r.total)}</td><td><button class="btn btn-ghost btn-sm" data-cancel="${r.code}">Cancelar</button></td></tr>`).join('')}</tbody></table>`
    : '<p style="text-align:center;color:var(--muted)">Aún no tienes reservas en este dispositivo.</p>';
}
$('#myRes').addEventListener('click', e => {
  const b = e.target.closest('[data-cancel]'); if (!b) return;
  if (!confirm('¿Cancelar la reserva ' + b.dataset.cancel + '?')) return;
  store.set('hz_res', store.get('hz_res', []).filter(r => r.code !== b.dataset.cancel));
  renderMyRes(); toast('Reserva cancelada');
});
renderSummary(); renderMyRes();