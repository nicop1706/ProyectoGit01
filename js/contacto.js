$('#faq').innerHTML = FAQ.map(([q, a]) => `<details class="reveal"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  initReveal();

  