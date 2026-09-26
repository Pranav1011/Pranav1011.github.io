/**
 * "Scroll to explore": shown while the page is at the top, then faded out and removed
 * (hidden) as soon as scrolling starts, so it never sits over content or in the tab order
 * afterwards. Under reduced motion it still shows, static (the arrow's bob is CSS gated on
 * motion), and disappears without a fade.
 */
export function scrollCue() {
  const cue = document.querySelector<HTMLElement>('[data-scroll-cue]');
  if (!cue || window.scrollY > 40) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  cue.hidden = false;
  let timer: number | undefined;
  const hide = () => {
    if (window.scrollY <= 40 || cue.hidden) return;
    window.removeEventListener('scroll', hide);
    if (reduce.matches) {
      cue.hidden = true;
      return;
    }
    cue.dataset.leaving = '';
    timer = window.setTimeout(() => (cue.hidden = true), 400);
  };
  window.addEventListener('scroll', hide, { passive: true });
  return () => {
    window.removeEventListener('scroll', hide);
    window.clearTimeout(timer);
  };
}
