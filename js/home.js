const heroIds = ['machu-picchu', 'santorini', 'bali', 'maldivas'];
  const slidesEl = $('#heroSlides'), dotsEl = $('#heroDots');
  slidesEl.innerHTML = heroIds.map((id, i) => `<div class="${i === 0 ? 'on' : ''}" style="background-image:url('${imgUrl(byId(id), 1600)}')"></div>`).join('');
  dotsEl.innerHTML = heroIds.map((_, i) => `<button class="${i === 0 ? 'on' : ''}" aria-label="Imagen ${i + 1}"></button>`).join('');
  let cur = 0, timer;
  const go = n => {
    cur = (n + heroIds.length) % heroIds.length;
    $$('div', slidesEl).forEach((s, i) => { s.classList.toggle('on', i === cur); });
    $$('button', dotsEl).forEach((b, i) => b.classList.toggle('on', i === cur));
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); };
  dotsEl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { go($$('button', dotsEl).indexOf(b)); start(); } });
  start();
 
  /* Buscador */
  $('#sCat').innerHTML = CATS.map(([v, t]) => `<option value="${v}">${t.replace(/^\S+\s/, v === 'todos' ? '' : '')}</option>`).join('');
  $('#dl').innerHTML = DESTINOS.map(d => `<option value="${d.nombre}">`).join('');
  $('#searchForm').addEventListener('submit', e => {
    e.preventDefault();
    const p = new URLSearchParams();
    if ($('#sQ').value.trim()) p.set('q', $('#sQ').value.trim());
    if ($('#sCat').value !== 'todos') p.set('cat', $('#sCat').value);
    if ($('#sMax').value) p.set('max', $('#sMax').value);
    location.href = 'viajes.html' + (p.toString() ? '?' + p : '');
  });
 
  /* Contadores animados */
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '+', t0 = performance.now();
    const tick = t => { const k = Math.min((t - t0) / 1600, 1); el.textContent = Math.floor(end * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US') + (k === 1 ? suf : ''); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => io.observe(el));
 
  /* Destinos populares */
  renderCards($('#popular'), DESTINOS.filter(d => d.rating >= 4.8).slice(0, 6));

  const now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
const pad = n => String(n).padStart(2, '0');
const tick = () => {
  const ms = Math.max(end - new Date(), 0), s = Math.floor(ms / 1000);
  $('#cd-d').textContent = pad(Math.floor(s / 86400));
  $('#cd-h').textContent = pad(Math.floor(s % 86400 / 3600));
  $('#cd-m').textContent = pad(Math.floor(s % 3600 / 60));
  $('#cd-s').textContent = pad(s % 60);
};
tick(); setInterval(tick, 1000);

/* Testimonios */
const slides = $('#slides'), nav = $('#sliderNav');
slides.innerHTML = TESTIMONIOS.map(t => `
  <div class="slide"><div class="quote">
    <div class="stars" aria-label="${t.r} de 5 estrellas">${'★'.repeat(t.r)}${'☆'.repeat(5 - t.r)}</div>
    <p>"${esc(t.t)}"</p>
    <div class="who"><div class="av" style="display:grid;place-items:center;color:#fff;font-weight:700">${esc(t.n[0])}</div>
    <div style="text-align:left"><b>${esc(t.n)}</b><br><small style="color:var(--muted)">${esc(t.c)} · ${esc(byId(t.d).nombre)}</small></div></div>
  </div></div>`).join('');

nav.innerHTML = TESTIMONIOS.map((_, i) => `<button class="${i === 0 ? 'active' : ''}" aria-label="Opinión ${i + 1}"></button>`).join('');

let ti = 0, tt;
const showT = i => { ti = (i + TESTIMONIOS.length) % TESTIMONIOS.length; slides.style.transform = `translateX(-${ti * 100}%)`; $$('button', nav).forEach((b, k) => b.classList.toggle('active', k === ti)); }; const startT = () => { clearInterval(tt); tt = setInterval(() => showT(ti + 1), 5500); }; nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { showT($$('button', nav).indexOf(b)); startT(); } });
let sx = 0; const sl = $('#slider');
sl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
sl.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) { showT(ti + (dx < 0 ? 1 : -1)); startT(); } });
startT();

/* Newsletter */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const m = $('#newsMail').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) { toast('⚠️ Ingresa un correo válido'); return; }
  const l = store.get('hz_news', []); if (!l.includes(m)) store.set('hz_news', [...l, m]);
  e.target.reset(); toast('🎉 ¡Gracias por suscribirte! Revisa tu correo.');
});