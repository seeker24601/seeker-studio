// Fills the hero backdrop with random ciphertext, as the app does while locked.
// Decorative only; the page reads the same without it.
(() => {
  const el = document.querySelector('.cipher');
  if (!el || !window.crypto) return;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = crypto.getRandomValues(new Uint8Array(6000));
  el.textContent = Array.from(bytes, (b) => alphabet[b & 63]).join('');
})();
