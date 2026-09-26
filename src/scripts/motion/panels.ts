import { gsap } from 'gsap';

/**
 * Selected work as stacking panels (desktop, motion allowed). The pinning itself is CSS
 * (position: sticky in WorkRow.astro), switched on by the `panels` class set here, so
 * without this script panels are a plain list. This also pins a panel taller than the
 * viewport by its bottom edge, lets each key figure slide in with its panel, sets a
 * covered panel back as the next one slides over it, and keeps keyboard focus visible.
 */
export function panels() {
  const stack = document.querySelector<HTMLElement>('.stack');
  const rows = [...document.querySelectorAll<HTMLElement>('[data-panel]')];
  if (!stack || !rows.length) return;
  const root = document.documentElement;

  /** A row's in-flow top, in page coordinates. Sticky rows move, so never measure them directly. */
  const flowTop = (i: number) =>
    stack.getBoundingClientRect().top + window.scrollY + rows.slice(0, i).reduce((sum, r) => sum + r.offsetHeight, 0);

  const fit = () =>
    rows.forEach((row) => row.style.setProperty('--stick', `${Math.min(0, window.innerHeight - row.offsetHeight)}px`));
  const observer = new ResizeObserver(fit);
  rows.forEach((row) => observer.observe(row));
  window.addEventListener('resize', fit);
  root.classList.add('panels');
  fit();

  rows.forEach((row, i) => {
    const readout = row.querySelector('.work-row__readout');
    if (readout) {
      // Sideways, so the figure never crosses the heading below it.
      gsap.from(readout, { x: 80, opacity: 0, ease: 'none',
        scrollTrigger: { start: () => flowTop(i) - window.innerHeight, end: () => flowTop(i) - window.innerHeight * 0.2,
          scrub: true, invalidateOnRefresh: true } });
    }
    const inner = row.querySelector('.work-row__inner');
    if (rows[i + 1] && inner) {
      gsap.to(inner, { scale: 0.94, opacity: 0.3, transformOrigin: '50% 0%', ease: 'none',
        scrollTrigger: { start: () => flowTop(i + 1) - window.innerHeight, end: () => flowTop(i + 1),
          scrub: true, invalidateOnRefresh: true } });
    }
  });

  // Tabbing into a pinned or covered panel: bring the panel back to its own place in the
  // flow, where nothing covers it, before the browser decides the focus is already in view.
  const onFocus = (event: FocusEvent) => {
    const i = rows.findIndex((row) => row.contains(event.target as Node));
    if (i < 0) return;
    const top = flowTop(i);
    if (Math.abs(rows[i].getBoundingClientRect().top + window.scrollY - top) > 1) window.scrollTo(0, top);
  };
  stack.addEventListener('focusin', onFocus);

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', fit);
    stack.removeEventListener('focusin', onFocus);
    root.classList.remove('panels');
    rows.forEach((row) => row.style.removeProperty('--stick'));
  };
}
