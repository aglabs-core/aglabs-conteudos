(() => {
  const form = document.querySelector('.search');
  const input = document.getElementById('busca');
  const clear = document.getElementById('limpar');
  const empty = document.getElementById('vazio');
  const count = document.getElementById('contagem');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const materials = Array.from(document.querySelectorAll('#catalogo article')).map(element => ({
    element,
    text: normalize(`${element.textContent} ${element.dataset.keywords || ''}`)
  }));
  function filter() {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    materials.forEach(({ element, text }) => {
      element.hidden = !terms.every(term => text.includes(term));
      if (!element.hidden) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'material' : 'materiais'}${terms.length ? (visible === 1 ? ' encontrado' : ' encontrados') : ''}`;
    empty.hidden = visible > 0;
    clear.hidden = !input.value;
  }
  function reset() { input.value = ''; filter(); input.focus(); }
  form.hidden = false;
  form.addEventListener('submit', event => event.preventDefault());
  input.addEventListener('input', filter);
  clear.addEventListener('click', reset);
  document.getElementById('ver-todos').addEventListener('click', reset);
  filter();
})();
