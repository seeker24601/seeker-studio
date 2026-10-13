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
