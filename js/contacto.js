$('#faq').innerHTML = FAQ.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  initReveal();

  function show(i) {
  idx = (i + shown.length) % shown.length;
  const d = shown[idx];
  $('#lbImg').src = imgUrl(d, 1400);
  $('#lbImg').alt = d.nombre;
  $('#lbCap').innerHTML = `${esc(d.nombre)}, ${esc(d.pais)} · <a href="reservas.html?id=${d.id}" style="color:#ffb347;text-decoration:underline">Reservar</a>`;
}
const open = i => { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

chips.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { cat = c.dataset.cat; render(); } });
masonry.addEventListener('click', e => { const f = e.target.closest('.m-item'); if (f) open(+f.dataset.i); });
masonry.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.m-item')) { e.preventDefault(); open(+e.target.closest('.m-item').dataset.i); } });
lb.addEventListener('click', e => {
  if (e.target === lb || e.target.closest('.close')) close();
  else if (e.target.closest('.lb-prev')) show(idx - 1);
  else if (e.target.closest('.lb-next')) show(idx + 1);
});
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});
let sx = 0;
lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });
render();