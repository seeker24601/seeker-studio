(() => {
  const catalogue = document.querySelector('[data-catalogue]');
  const controls = catalogue && catalogue.querySelector('.catalogue-controls');
  // Short catalogues have no controls; the static count already describes them.
  if (!controls) return;
  const search = controls.querySelector('input[type="search"]');
  const chips = [...controls.querySelectorAll('[data-show]')];
  const list = catalogue.querySelector('.catalogue-grid');
  const cards = [...list.children];
  const count = catalogue.querySelector('.catalogue-count');
  const empty = catalogue.querySelector('.catalogue-empty');
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase().trim();
  const content = new Map(cards.map(card => [card, normalize(card.textContent)]));
  let show = 'all';

  for (const chip of chips) {
    const total = chip.dataset.show === 'all' ? cards.length : cards.filter(card => card.dataset.filter === chip.dataset.show).length;
    chip.insertAdjacentHTML('beforeend', ` <span class="chip-count">${total}</span>`);
    chip.addEventListener('click', () => {
      show = chip.dataset.show;
      update();
    });
  }

  function update() {
    const words = normalize(search ? search.value : '').split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matches = words.every(word => content.get(card).includes(word)) &&
        (show === 'all' || card.dataset.filter === show);
      card.hidden = !matches;
      if (matches) visible++;
    }
    for (const chip of chips) chip.setAttribute('aria-pressed', String(chip.dataset.show === show));
    const unit = cards.length === 1 ? catalogue.dataset.unit.replace(/s$/, '') : catalogue.dataset.unit;
    count.textContent = visible === cards.length ? `${cards.length} ${unit}` : `${visible} of ${cards.length} ${unit}`;
    empty.hidden = visible !== 0;
  }

  if (search) search.addEventListener('input', update);
  empty.querySelector('[data-clear]').addEventListener('click', () => {
    if (search) search.value = '';
    show = 'all';
    update();
    (search || chips[0]).focus();
  });
  controls.hidden = false;
  update();
})();
