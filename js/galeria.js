let cat = 'todos', shown = [], idx = 0;
  const chips = $('#chips'), masonry = $('#masonry'), lb = $('#lb');
 
  chips.innerHTML = CATS.map(([v, t]) => `<button type="button" class="chip" data-cat="${v}">${t}</button>`).join('');
 
  function render() {
    shown = DESTINOS.filter(d => cat === 'todos' || d.cat === cat);
    $$('.chip', chips).forEach(c => c.classList.toggle('on', c.dataset.cat === cat));
    masonry.innerHTML = shown.map((d, i) => `
      <figure class="m-item reveal" data-i="${i}" tabindex="0" role="button" aria-label="Ampliar ${esc(d.nombre)}">
        <img src="${imgUrl(d, 600)}" alt="${esc(d.nombre)}, ${esc(d.pais)}" loading="lazy" onerror="this.parentElement.style.minHeight='220px'">
        <span>${esc(d.nombre)} · ${esc(d.pais)}</span>
      </figure>`).join('');
    initReveal();
  }

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