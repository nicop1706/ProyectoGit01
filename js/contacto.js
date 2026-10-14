/* ===== Contacto ===== */
document.addEventListener('DOMContentLoaded', () => {
  /* ===== PARTE 1/2 · Preguntas frecuentes (FAQ) ===== */
  $('#faq').innerHTML = FAQ.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  initReveal();
});


  /* ===== PARTE 2/2 · Formulario de contacto: contador, validación y guardado ===== */
  const f = $('#contactForm'), cm = $('#cm');
  cm.addEventListener('input', () => $('#cc').textContent = cm.value.length + '/500');
  $$('input,textarea', f).forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('err')));

  f.addEventListener('submit', e => {
    e.preventDefault();
    const bad = (el, cond) => { el.closest('.field').classList.toggle('err', cond); return cond; };
    const errs = [
      bad($('#cn'), $('#cn').value.trim().length < 2),
      bad($('#ce'), !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#ce').value.trim())),
      bad(cm, cm.value.trim().length < 10)
    ];
    if (errs.some(Boolean)) { toast('⚠️ Revisa los campos marcados'); return; }
    const msgs = store.get('hz_msgs', []);
    store.set('hz_msgs', [{ nombre: $('#cn').value.trim(), email: $('#ce').value.trim(), motivo: $('#cs').value, mensaje: cm.value.trim(), fecha: new Date().toISOString() }, ...msgs]);
    f.reset(); $('#cc').textContent = '0/500';
    toast('✅ ¡Mensaje enviado! Te responderemos pronto.');
  });
});