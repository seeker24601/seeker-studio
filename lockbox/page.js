// Fills the hero backdrop with random ciphertext, as the app does while locked,
// and keeps re-encrypting a few characters at a time. Decorative only: the page
// reads the same without it, it holds still under reduced motion, and it pauses
// while the hero is off screen.
(() => {
  const el = document.querySelector('.cipher');
  if (!el || !window.crypto) return;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const size = 6000;
  const perTick = 70;
  const tickMs = 90;
  const chars = Array.from(crypto.getRandomValues(new Uint8Array(size)), (b) => alphabet[b & 63]);
  el.textContent = chars.join('');

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let frame = 0;
  let last = 0;

  const tick = (now) => {
    frame = 0;
    if (still.matches || !visible) return;
    if (now - last >= tickMs) {
      last = now;
      const picks = crypto.getRandomValues(new Uint16Array(perTick * 2));
      for (let i = 0; i < picks.length; i += 2) chars[picks[i] % size] = alphabet[picks[i + 1] & 63];
      el.textContent = chars.join('');
    }
    frame = requestAnimationFrame(tick);
  };
  const start = () => { if (!frame && visible && !still.matches) frame = requestAnimationFrame(tick); };

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); }).observe(el);
  still.addEventListener('change', start);
  start();
})();
