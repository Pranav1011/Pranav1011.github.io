/**
 * "Scroll to see more" (motion allowed, every width): shown only while the page is at the
 * top, then faded out and removed (hidden) as soon as scrolling starts, so it never sits
 * over content or in the tab order afterwards. Under reduced motion it never appears.
 */
export function scrollCue() {
  const cue = document.querySelector<HTMLElement>('[data-scroll-cue]');
  if (!cue || window.scrollY > 40) return;
  cue.hidden = false;
  let timer: number | undefined;
  const hide = () => {
    if (window.scrollY <= 40 || cue.hidden) return;
    cue.dataset.leaving = '';
    timer = window.setTimeout(() => (cue.hidden = true), 400);
    window.removeEventListener('scroll', hide);
  };
  window.addEventListener('scroll', hide, { passive: true });
  return () => {
    window.removeEventListener('scroll', hide);
    window.clearTimeout(timer);
    cue.hidden = true;
    delete cue.dataset.leaving;
  };
}
