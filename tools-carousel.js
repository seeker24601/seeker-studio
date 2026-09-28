(() => {
  const carousel = document.querySelector('.tools-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.tools-track');
  const slides = [...track.querySelectorAll('.entry')];
  const selectors = [...carousel.querySelectorAll('[data-tool]')];
  const previous = carousel.querySelector('.tools-prev');
  const next = carousel.querySelector('.tools-next');
  const position = carousel.querySelector('.tools-position');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let frame;

  function update(index) {
    current = index;
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    position.textContent = `${index + 1} / ${slides.length} · ${slides[index].querySelector('h3').textContent}`;
  }

  function select(index, animate = true) {
    const target = Math.max(0, Math.min(index, slides.length - 1));
    const left = track.scrollLeft + slides[target].getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left, behavior: animate && !reducedMotion.matches ? 'smooth' : 'instant' });
    update(target);
  }

  function selectHash() {
    const index = slides.findIndex(slide => `#${slide.id}` === location.hash);
    if (index !== -1) select(index, false);
  }

  selectors.forEach((button, index) => button.addEventListener('click', () => select(index)));
  previous.addEventListener('click', () => select(current - 1));
  next.addEventListener('click', () => select(current + 1));
  track.addEventListener('keydown', event => {
    const destinations = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    select(destinations[event.key]);
  });
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const origin = track.getBoundingClientRect().left;
      const distances = slides.map(slide => Math.abs(slide.getBoundingClientRect().left - origin));
      const nearest = distances.indexOf(Math.min(...distances));
      if (nearest !== current) update(nearest);
    });
  }, { passive: true });
  window.addEventListener('hashchange', selectHash);
  window.addEventListener('resize', () => select(current, false));
  track.setAttribute('tabindex', '0');
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Tools. Use left and right arrow keys to browse.');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.classList.add('is-ready');
  carousel.querySelector('.tools-controls').hidden = false;
  selectHash();
})();
