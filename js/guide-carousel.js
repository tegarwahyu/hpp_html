'use strict';
(() => {
 document.querySelectorAll('[data-guide-carousel]').forEach(carousel => {
  const track = carousel.querySelector('[data-guide-track]');
  const controls = carousel.querySelector('[data-guide-controls]');
  if (!track || !controls) return;
  const slides = Array.from(track.children);
  if (slides.length < 2) return;
  const previous = controls.querySelector('[data-guide-prev]');
  const next = controls.querySelector('[data-guide-next]');
  const position = controls.querySelector('[data-guide-position]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let pending = false;
  const left = slide => slide.offsetLeft - slides[0].offsetLeft;
  const update = () => {
   index = slides.reduce((best, slide, i) => Math.abs(left(slide) - track.scrollLeft) < Math.abs(left(slides[best]) - track.scrollLeft) ? i : best, 0);
   previous.disabled = index === 0;
   next.disabled = index === slides.length - 1;
   position.textContent = (index + 1) + ' / ' + slides.length;
  };
  const go = i => {
   index = Math.max(0, Math.min(slides.length - 1, i));
   track.scrollTo({ left: left(slides[index]), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  };
  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  track.addEventListener('keydown', event => {
   if (event.target !== track) return;
   if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
   event.preventDefault();
   go(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  track.addEventListener('scroll', () => {
   if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; update(); }); }
  }, {passive: true});
  let resizeTimer;
  const resize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { track.scrollTo({left: left(slides[index]), behavior: 'instant'}); update(); }, 100); };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
  else window.addEventListener('resize', resize);
  controls.hidden = false;
  update();
 });
})();
