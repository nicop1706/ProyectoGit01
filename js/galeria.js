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

  