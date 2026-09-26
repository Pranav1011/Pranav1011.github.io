import { gsap } from 'gsap';
import { lenis } from './lenis';

/**
 * Curtain footer: the CTA and footer sit behind the page and are revealed as the content
 * above lifts away. CSS position: sticky does the work (global.css, html.curtain), so it
 * scrolls natively and smoothly on iOS Safari. It only switches on when the curtain fits
 * in the screen, so nothing in it is ever hidden; otherwise it stays in normal flow.
 * Keyboard focus, and the Contact links, always bring it fully into view.
 */
export function curtain(desktop: boolean) {
  const el = document.querySelector<HTMLElement>('[data-curtain]');
  const main = document.querySelector<HTMLElement>('main');
  if (!el || !main) return;
  const root = document.documentElement;

  const fits = () => el.offsetHeight <= window.innerHeight;
  const toEnd = () => {
    const end = document.documentElement.scrollHeight - window.innerHeight;
    const smooth = lenis();
    if (smooth) smooth.scrollTo(end, { immediate: true });
    else window.scrollTo(0, end);
  };
  const covered = () => main.getBoundingClientRect().bottom > el.getBoundingClientRect().top + 1;

  const update = () => root.classList.toggle('curtain', fits());
  update();
  const observer = new ResizeObserver(update);
  observer.observe(el);
  window.addEventListener('resize', update);

  const onFocus = () => {
    if (root.classList.contains('curtain') && covered()) toEnd();
  };
  el.addEventListener('focusin', onFocus);

  // The CTA sits at the end of the page; anchors to it scroll there, not to its stuck spot.
  const onClick = (event: MouseEvent) => {
    const a = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href$="#contact"]');
    if (!a || !root.classList.contains('curtain') || new URL(a.href).pathname !== location.pathname) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const smooth = lenis();
    const end = document.documentElement.scrollHeight - window.innerHeight;
    if (smooth) smooth.scrollTo(end);
    else window.scrollTo({ top: end, behavior: 'smooth' });
    history.replaceState(null, '', '#contact');
  };
  document.addEventListener('click', onClick, true);

  // The wordmark slides in sideways as the curtain is revealed (32px on mobile).
  const word = el.querySelector('.wordmark__text');
  if (word) {
    gsap.fromTo(word, { x: () => (desktop ? -window.innerWidth * 0.3 : -32), opacity: desktop ? 0 : 1 }, { x: 0, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: main, start: 'bottom bottom', end: () => `bottom ${window.innerHeight - el.offsetHeight}px`,
        scrub: true, invalidateOnRefresh: true } });
  }

  // Desktop: the CTA rises a little as it's revealed.
  if (desktop) {
    const inner = el.querySelector('.contact .container');
    if (inner) {
      gsap.fromTo(inner, { yPercent: 18 }, { yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: main, start: 'bottom bottom', end: () => `bottom ${window.innerHeight - el.offsetHeight}px`,
          scrub: true, invalidateOnRefresh: true } });
    }
  }

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', update);
    el.removeEventListener('focusin', onFocus);
    document.removeEventListener('click', onClick, true);
    root.classList.remove('curtain');
  };
}
