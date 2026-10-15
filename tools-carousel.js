(() => {
  const carousel = document.querySelector('.tools-carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.tools-track');
  const selectorList = carousel.querySelector('.tools-selectors');
  const previous = carousel.querySelector('.tools-prev');
  const next = carousel.querySelector('.tools-next');
  const position = carousel.querySelector('.tools-position');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let slides = [];
  let selectors = [];
  let current = 0;
  let frame;
  // While the track glides to a chosen slide, the slides it passes are not selections.
  let destination = null;
  let release;

  // The selector buttons come from the slides, so the two lists cannot drift apart.
  function render() {
    slides = [...track.querySelectorAll('.entry')];
    selectors = slides.map((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-controls', track.id);
      button.innerHTML = `<span class="code">${String(index + 1).padStart(2, '0')}</span> `;
      button.append(slide.querySelector('h3').textContent);
      button.addEventListener('click', () => select(index));
      return button;
    });
    selectorList.replaceChildren(...selectors);
    fitStrip();
    update(Math.min(current, slides.length - 1));
  }

  // Every resting position of the strip starts at a button's left edge. A spacer after the last
  // button makes the final such position reachable.
  function fitStrip() {
    selectorList.style.setProperty('--tail', '0px');
    const width = selectorList.clientWidth;
    const last = selectors[selectors.length - 1];
    const lastEnd = last.offsetLeft + last.offsetWidth;
    if (lastEnd > width) {
      const edge = selectors.map(button => button.offsetLeft).find(start => start >= lastEnd - width) ?? last.offsetLeft;
      selectorList.style.setProperty('--tail', `${Math.max(0, edge + width - lastEnd)}px`);
    }
    updateFade();
  }

  // Fade the right edge only while buttons are still hidden to the right.
  function updateFade() {
    const last = selectors[selectors.length - 1];
    selectorList.classList.toggle('has-more', last.offsetLeft + last.offsetWidth > selectorList.scrollLeft + selectorList.clientWidth + 1);
  }

  function update(index) {
    current = index;
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    position.textContent = `${index + 1} / ${slides.length} · ${slides[index].querySelector('h3').textContent}`;
    revealSelector(selectors[index]);
  }

  // Scroll only the button strip, never the page, so the pressed button stays in view.
  // The strip always stops at a button's left edge, so the leftmost button is never cut off.
  function revealSelector(button) {
    const width = selectorList.clientWidth;
    const start = button.offsetLeft;
    const end = start + button.offsetWidth;
    let left = selectorList.scrollLeft;
    if (start < left) left = start;
    else if (end > left + width) left = selectors.map(other => other.offsetLeft).find(edge => edge >= end - width) ?? start;
    if (left !== selectorList.scrollLeft) selectorList.scrollTo({ left, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  function select(index, animate = true) {
    const target = Math.max(0, Math.min(index, slides.length - 1));
    const left = track.scrollLeft + slides[target].getBoundingClientRect().left - track.getBoundingClientRect().left;
    destination = target;
    clearTimeout(release);
    // Fall back in case the glide is interrupted before it arrives.
    release = setTimeout(() => { destination = null; }, 1000);
    track.scrollTo({ left, behavior: animate && !reducedMotion.matches ? 'smooth' : 'instant' });
    update(target);
  }

  function selectHash() {
    const index = slides.findIndex(slide => `#${slide.id}` === location.hash);
    if (index !== -1) select(index, false);
  }

  // A tool listed on tools.html without a hand-written slide here gets one built from its catalogue card.
  function slideFromCard(card) {
    const slide = document.createElement('article');
    slide.className = 'entry';
    slide.id = card.id;
    slide.setAttribute('aria-labelledby', `${card.id}-title`);
    const code = document.createElement('div');
    code.className = 'entry-code';
    code.append(...[...card.querySelectorAll('.catalogue-meta > *')].map(node => document.importNode(node, true)));
    slide.append(code);
    const image = card.querySelector('.catalogue-image img');
    if (image) {
      const plate = document.createElement('figure');
      plate.className = 'plate';
      plate.append(document.importNode(image, true));
      slide.append(plate);
    }
    const copy = document.createElement('div');
    copy.className = 'entry-copy';
    const title = document.createElement('h3');
    title.id = `${card.id}-title`;
    title.textContent = card.querySelector('h2').textContent;
    const label = card.querySelector('.label');
    if (label) copy.append(document.importNode(label, true));
    copy.append(title);
    const pitch = card.querySelector('.catalogue-pitch');
    if (pitch) {
      const line = document.createElement('p');
      line.className = 'pitch';
      line.textContent = pitch.textContent;
      copy.append(line);
    }
    for (const selector of ['.catalogue-description', '.go']) {
      const node = card.querySelector(selector);
      if (node) copy.append(document.importNode(node, true));
    }
    slide.append(copy);
    return slide;
  }

  async function addMissingSlides() {
    const response = await fetch('tools.html');
    if (!response.ok) return;
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const cards = [...page.querySelectorAll('.catalogue-card')];
    const known = new Set(slides.map(slide => slide.id));
    if (cards.every(card => known.has(card.id))) return;
    // Keep the catalogue's order: put each new slide before the next tool that already has one.
    cards.forEach((card, index) => {
      if (known.has(card.id)) return;
      const following = cards.slice(index + 1).find(later => known.has(later.id));
      track.insertBefore(slideFromCard(card), following ? document.getElementById(following.id) : null);
      known.add(card.id);
    });
    render();
    selectHash();
  }

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
      if (destination !== null) {
        if (nearest === destination && distances[nearest] < 2) destination = null;
        return;
      }
      if (nearest !== current) update(nearest);
    });
  }, { passive: true });
  track.addEventListener('scrollend', () => { destination = null; });
  selectorList.addEventListener('scroll', updateFade, { passive: true });
  window.addEventListener('hashchange', selectHash);
  window.addEventListener('resize', () => {
    fitStrip();
    select(current, false);
  });
  track.setAttribute('tabindex', '0');
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Tools. Use left and right arrow keys to browse.');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.classList.add('is-ready');
  // Show the controls before building the buttons, so the strip can be measured.
  carousel.querySelector('.tools-controls').hidden = false;
  render();
  selectHash();
  addMissingSlides().catch(() => {
    // The hand-written slides stay as they are.
  });
})();
