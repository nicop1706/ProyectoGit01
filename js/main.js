/* ===== Lógica compartida: layout, tema, favoritos, tarjetas, modal ===== */
/* ===== PARTE 1/3 · Base: utilidades, avisos (toast) y estructura (header/footer) ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

/* ---------- Toast ---------- */
function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- Header / Footer ---------- */
const PAGES = [['index.html','Inicio'],['nosotros.html','Nosotros'],['viajes.html','Viajes'],['galeria.html','Galería'],['reservas.html','Reservas'],['contacto.html','Contáctanos']];

function renderLayout() {
  const current = document.body.dataset.page;
  const solid = document.body.dataset.header === 'solid';
  const header = $('#site-header');
  if (header) {
    header.outerHTML = `
    <header class="header ${solid ? 'solid' : ''}" id="hdr">
      <div class="container nav">
        <a href="index.html" class="logo" aria-label="Horizonte Viajes, inicio"><span class="ic">🧭</span>Horizonte</a>
        <nav class="nav-links" id="navLinks" aria-label="Principal">
          ${PAGES.map(([h, t]) => `<a href="${h}" class="${h === current ? 'active' : ''}">${t}</a>`).join('')}
        </nav>
        <div class="nav-actions">
          <button class="icon-btn" id="themeBtn" aria-label="Cambiar tema">🌙</button>
          <a href="reservas.html" class="btn btn-sm nav-cta">Reservar</a>
          <button class="icon-btn burger" id="burger" aria-label="Abrir menú" aria-expanded="false">☰</button>
        </div>
      </div>
    </header>`;
  }
  const footer = $('#site-footer');
  if (footer) {
    footer.outerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="fgrid">
          <div>
            <a href="index.html" class="logo"><span class="ic">🧭</span>Horizonte</a>
            <p>Creamos viajes que se recuerdan toda la vida. Paquetes, asesoría y soporte antes, durante y después de tu aventura.</p>
            <div class="social" aria-label="Redes sociales">
              <a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="TikTok">tt</a><a href="#" aria-label="YouTube">▶</a>
            </div>
          </div>
          <div><h4>Explora</h4><ul>${PAGES.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
          <div><h4>Destinos</h4><ul>
            <li><a href="viajes.html?cat=playa">Playas</a></li><li><a href="viajes.html?cat=cultura">Cultura</a></li>
            <li><a href="viajes.html?cat=aventura">Aventura</a></li><li><a href="viajes.html?cat=romantico">Románticos</a></li></ul></div>
          <div><h4>Contacto</h4><ul>
            <li>📍 Av. Larco 1301, Miraflores, Lima</li><li>📞 +51 999 888 777</li>
            <li>✉️ hola@horizonteviajes.pe</li><li>🕘 Lun–Sáb 9:00–19:00</li></ul></div>
        </div>
        <div class="copy">© ${new Date().getFullYear()} Horizonte Viajes · Sitio de demostración · Precios referenciales por persona en US$</div>
      </div>
    </footer>
    <a class="whatsapp" href="https://wa.me/51999888777?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20sus%20paquetes" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">💬</a>
    <button class="totop" id="toTop" aria-label="Volver arriba">↑</button>`;
  }
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  document.dispatchEvent(new Event('layoutready'));
});

/* ===== PARTE 2/3 · Interacción: menú móvil, scroll, tema claro/oscuro y animaciones ===== */
function initChrome() {
  const hdr = $('#hdr'), burger = $('#burger'), links = $('#navLinks'), tt = $('#toTop');
  const onScroll = () => {
    hdr.classList.toggle('scrolled', window.scrollY > 40);
    tt && tt.classList.toggle('show', window.scrollY > 600);
  };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.textContent = open ? '✕' : '☰';
  });
  links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });
  tt && tt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const themeBtn = $('#themeBtn');
  const apply = t => { document.documentElement.dataset.theme = t; themeBtn.textContent = t === 'dark' ? '☀️' : '🌙'; };
  apply(store.get('hz_theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('hz_theme', t); apply(t);
  });
}

/* ---------- Animaciones al hacer scroll ---------- */
function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal:not(.in)').forEach(el => io.observe(el));
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout(); initChrome(); initReveal();
  document.dispatchEvent(new Event('layoutready'));
});

/* ===== PARTE 3/3 · Contenido: favoritos, tarjetas de destino y ventana de detalle ===== */
/* ---------- Favoritos ---------- */
const favs = {
  list: () => store.get('hz_fav', []),
  has: id => favs.list().includes(id),
  toggle(id) {
    let l = favs.list(); const on = !l.includes(id);
    l = on ? [...l, id] : l.filter(x => x !== id);
    store.set('hz_fav', l); return on;
  }
};

/* ---------- Tarjeta de destino ---------- */
function cardHTML(d) {
  return `
  <article class="card reveal" data-id="${d.id}">
    <div class="card-img">
      <img src="${imgUrl(d, 700)}" alt="${esc(d.nombre)}, ${esc(d.pais)}" loading="lazy" onerror="this.style.display='none'">
      <span class="badge">${esc(d.badge)}</span>
      <button class="fav ${favs.has(d.id) ? 'on' : ''}" data-fav="${d.id}" aria-label="Guardar en favoritos" aria-pressed="${favs.has(d.id)}">♥</button>
      <span class="rating">★ ${d.rating.toFixed(1)}</span>
    </div>
    <div class="card-body">
      <div class="meta"><span>📍 ${esc(d.pais)}</span><span>🕒 ${d.dias} días</span></div>
      <h3>${esc(d.nombre)}</h3>
      <p>${esc(d.desc)}</p>
      <div class="card-foot">
        <div class="price"><small>desde</small><b>${money(d.precio)}</b><s>${money(d.antes)}</s></div>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" data-detail="${d.id}">Ver más</button>
          <a class="btn btn-sm" href="reservas.html?id=${d.id}">Reservar</a>
        </div>
      </div>
    </div>
  </article>`;
}

function renderCards(container, list) {
  container.innerHTML = list.length ? list.map(cardHTML).join('') : '<div class="empty"><h3>😕 Sin resultados</h3><p>Prueba con otros filtros o palabras.</p></div>';
  initReveal();
}

/* Delegación global: favoritos y detalle */
document.addEventListener('click', e => {
  const f = e.target.closest('[data-fav]');
  if (f) {
    const on = favs.toggle(f.dataset.fav);
    $$(`[data-fav="${f.dataset.fav}"]`).forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    toast(on ? '❤️ Agregado a tus favoritos' : 'Quitado de favoritos');
    document.dispatchEvent(new CustomEvent('favschanged'));
    return;
  }
  const d = e.target.closest('[data-detail]');
  if (d) openDetail(d.dataset.detail);
});

/* ---------- Modal de detalle ---------- */
function openDetail(id) {
  const d = byId(id); if (!d) return;
  let ov = $('#detailOv');
  if (!ov) { ov = document.createElement('div'); ov.id = 'detailOv'; ov.className = 'overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); document.body.appendChild(ov); }
  ov.innerHTML = `
    <div class="modal">
      <button class="close" aria-label="Cerrar">✕</button>
      <div class="modal-img" style="background-image:url('${imgUrl(d, 900)}'),linear-gradient(135deg,#0e7c86,#ffb347)"></div>
      <div class="modal-body">
        <span class="eyebrow">${esc(d.pais)} · ${d.dias} días</span>
        <h2 style="font-size:1.8rem">${esc(d.nombre)}</h2>
        <p style="color:var(--muted)">${esc(d.desc)}</p>
        <ul class="inc">${d.incluye.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        <div class="price" style="margin:1rem 0"><small>desde por persona</small><b>${money(d.precio)}</b><s>${money(d.antes)}</s></div>
        <a class="btn btn-block" href="reservas.html?id=${d.id}">Reservar este viaje</a>
      </div>
    </div>`;
  ov.classList.add('open'); document.body.style.overflow = 'hidden';
  const close = () => { ov.classList.remove('open'); document.body.style.overflow = ''; document.removeEventListener('keydown', esc_); };
  const esc_ = e => { if (e.key === 'Escape') close(); };
  ov.onclick = e => { if (e.target === ov || e.target.closest('.close')) close(); };
  document.addEventListener('keydown', esc_);
  $('.close', ov).focus();
}

/* ---------- Arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout(); initChrome(); initReveal();
  document.dispatchEvent(new Event('layoutready'));
});