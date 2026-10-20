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