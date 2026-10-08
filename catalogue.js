(() => {
  const catalogue = document.querySelector('[data-catalogue]');
  if (!catalogue) return;
  const controls = catalogue.querySelector('.catalogue-controls');
  const search = controls.querySelector('input[type="search"]');
  const filter = controls.querySelector('[data-filter]');
  const sort = controls.querySelector('[data-sort]');
  const list = catalogue.querySelector('.catalogue-grid');
  const cards = [...list.children];
  const count = catalogue.querySelector('.catalogue-count');
  const empty = catalogue.querySelector('.catalogue-empty');
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase().trim();
  const content = new Map(cards.map(card => [card, normalize(card.textContent)]));
  const names = new Intl.Collator(document.documentElement.lang, { sensitivity: 'base', numeric: true });

  function update() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matches = words.every(word => content.get(card).includes(word)) &&
        (filter.value === 'all' || card.dataset.filter === filter.value);
      card.hidden = !matches;
      if (matches) visible++;
    }
    const ordered = sort.value === 'studio' ? cards : [...cards].sort((a, b) =>
      names.compare(a.dataset.name, b.dataset.name) * (sort.value === 'za' ? -1 : 1));
    // Leave the DOM alone while typing; reordering is needed only for a new sort.
    if (ordered.some((card, index) => list.children[index] !== card)) list.append(...ordered);
    const unit = cards.length === 1 ? catalogue.dataset.unit.replace(/s$/, '') : catalogue.dataset.unit;
    count.textContent = `${visible} of ${cards.length} ${unit}`;
    empty.hidden = visible !== 0;
  }

  search.addEventListener('input', update);
  filter.addEventListener('change', update);
  sort.addEventListener('change', update);
  controls.querySelector('[data-reset]').addEventListener('click', () => {
    search.value = '';
    filter.value = 'all';
    sort.value = 'studio';
    update();
    search.focus();
  });
  controls.hidden = false;
  update();
})();
