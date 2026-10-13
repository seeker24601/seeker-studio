document.documentElement.classList.add('js');
if (document.body.classList.contains('home-page') && location.hash === '#studio') {
  location.replace('studio.html');
}
document.getElementById('year').textContent = String(new Date().getFullYear());
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
// Copy buttons stay hidden without JavaScript; the address text remains selectable.
const copyStatus = document.querySelector('.copy-status');
document.querySelectorAll('[data-copy]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    const text = source.textContent.trim();
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    button.textContent = copied ? 'Copied' : 'Selected, press Ctrl+C';
    if (copyStatus) copyStatus.textContent = copied ? 'Address copied.' : 'Address selected. Copy it with your keyboard.';
    setTimeout(() => { button.textContent = 'Copy address'; }, 2500);
  });
});
// Counts on the homepage come from the catalogue pages, so adding a card there updates them.
(() => {
  const targets = document.querySelectorAll('[data-count-src]');
  const pages = new Map();
  const load = src => {
    if (!pages.has(src)) pages.set(src, fetch(src)
      .then(response => response.ok ? response.text() : Promise.reject(new Error(response.status)))
      .then(html => new DOMParser().parseFromString(html, 'text/html')));
    return pages.get(src);
  };
  targets.forEach(async target => {
    try {
      const page = await load(target.dataset.countSrc);
      const cards = [...page.querySelectorAll('.catalogue-card')];
      const matching = cards.filter(card => card.dataset.filter === target.dataset.countFilter);
      // A status label such as "in development" applies only while some cards still have that status.
      if (target.dataset.countFilter && matching.length) {
        target.textContent = `${matching.length} ${target.dataset.countLabel}`;
      } else {
        const unit = page.querySelector('[data-catalogue]').dataset.unit;
        target.textContent = `${cards.length} ${cards.length === 1 ? unit.replace(/s$/, '') : unit}`;
      }
    } catch {
      // Leave the fallback text in place.
    }
  });
})();
