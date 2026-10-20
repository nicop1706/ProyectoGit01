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