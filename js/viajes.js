/* ===== Página de viajes ===== */
document.addEventListener('DOMContentLoaded', () => {
  /* ===== PARTE 1/2 · Estado, categorías y función apply() que filtra y ordena ===== */
  const params = new URLSearchParams(location.search);
  const st = { q: params.get('q') || '', cat: params.get('cat') || 'todos', cont: '', dias: '', max: +(params.get('max') || 3500), sort: 'pop' };

  const chips = $('#chips'), grid = $('#grid');
  chips.innerHTML = CATS.map(([v, t]) => `<button type="button" class="chip" data-cat="${v}">${t}</button>`).join('');
  $('#fQ').value = st.q; $('#fMax').value = st.max;
  const syncMax = () => $('#fMaxV').textContent = 'US$ ' + (+$('#fMax').value).toLocaleString('en-US');

  function apply() {
    const q = st.q.toLowerCase().trim();
    let list = DESTINOS.filter(d =>
      (!q || (d.nombre + ' ' + d.pais + ' ' + d.desc + ' ' + d.cat).toLowerCase().includes(q)) &&
      (st.cat === 'todos' || d.cat === st.cat) &&
      (!st.cont || d.cont === st.cont) &&
      (!st.dias || d.dias <= +st.dias) &&
      d.precio <= st.max);
    if (st.sort === 'fav') list = list.filter(d => favs.has(d.id));
    const sorters = { pop: (a, b) => b.rating - a.rating, asc: (a, b) => a.precio - b.precio, desc: (a, b) => b.precio - a.precio, dias: (a, b) => a.dias - b.dias, fav: (a, b) => b.rating - a.rating };
    list.sort(sorters[st.sort]);
    $$('.chip', chips).forEach(c => c.classList.toggle('on', c.dataset.cat === st.cat));
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'viaje encontrado' : 'viajes encontrados'}`;
    renderCards(grid, list);
    syncMax();
  }
  apply();
});