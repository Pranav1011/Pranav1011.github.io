import { gsap } from 'gsap';

/** Desktop deck: the first card pins this far from the top, each later one DECK_STEP lower. */
const DECK_TOP = 16;
const DECK_STEP = 24;

/**
 * Selected work as a deck of colour cards (motion allowed, every width). The pinning is
 * CSS position: sticky (WorkRow.astro), switched on by the `panels` class set here, so
 * without this script the cards are a plain list. This sets each card's pin point (--stick),
 * scales and darkens a card as the next one slides over it, runs the Aurora video's
 * full-screen-to-card shrink, settles the other covers inside their frames, slides the
 * key figures in, and keeps keyboard focus visible.
 */
export function panels(desktop: boolean) {
  const stack = document.querySelector<HTMLElement>('.stack');
  const rows = [...document.querySelectorAll<HTMLElement>('[data-panel]')];
  if (!stack || !rows.length) return;
  const root = document.documentElement;

  /** A card's in-flow top, in page coordinates. Sticky cards move, so never measure them directly. */
  const flowTop = (i: number) =>
    stack.getBoundingClientRect().top +
    window.scrollY +
    rows.slice(0, i).reduce((sum, r) => sum + r.offsetHeight + parseFloat(getComputedStyle(r).marginBottom), 0);
  /** Where card i pins, from the top of the screen (px), before any bottom-edge fallback. */
  const offset = (i: number) => (desktop ? DECK_TOP + i * DECK_STEP : 0);
  /** The card's actual pin point: its offset, or by its bottom edge if it's taller than the screen. */
  const pin = (i: number) => Math.min(offset(i), window.innerHeight - rows[i].offsetHeight);

  // In svh, so the pin point doesn't jump as a phone's address bar shows and hides.
  const fit = () =>
    rows.forEach((row, i) => row.style.setProperty('--stick', `min(${offset(i)}px, calc(100svh - ${row.offsetHeight}px))`));
  const observer = new ResizeObserver(fit);
  rows.forEach((row) => observer.observe(row));
  window.addEventListener('resize', fit);
  root.classList.add('panels');
  fit();

  const scrub = (start: () => number, end: () => number) => ({ start, end, scrub: true, invalidateOnRefresh: true });

  rows.forEach((row, i) => {
    const cover = row.querySelector<HTMLElement>('.work-row__cover');
    const media = row.querySelector<HTMLElement>('.cover__video, .cover > img, .cover__chart > div');

    if (i === 0 && cover) {
      bigImage(row, cover, desktop, () => flowTop(0) - pin(0), stack);
    } else if (media) {
      // Other covers settle from 1.12 inside their frames as the card arrives; on desktop
      // they settle at 1.04, which leaves room for a slight parallax within the frame.
      gsap.fromTo(media, { scale: 1.12 }, { scale: desktop ? 1.04 : 1, ease: 'none',
        scrollTrigger: scrub(() => flowTop(i) - window.innerHeight, () => flowTop(i) - pin(i)) });
      if (desktop) {
        gsap.fromTo(media, { yPercent: -1.8 }, { yPercent: 1.8, ease: 'none',
          scrollTrigger: scrub(() => flowTop(i) - window.innerHeight, () => flowTop(i) + row.offsetHeight) });
      }
    }

    // The cover and the text enter from opposite sides, alternating per card: Aurora's
    // text from the right (its cover is the big image moment), F1's cover from the right
    // and text from the left, PitWall's the other way round. 32px at most on mobile.
    const side = i % 2 === 0 ? 1 : -1;
    const reach = () => (desktop ? Math.min(140, window.innerWidth * 0.1) : 24);
    const text = row.querySelectorAll('.work-row__readout, .work-row__body');
    const enter = scrub(() => flowTop(i) - window.innerHeight, () => flowTop(i) - pin(i));
    if (i === 0) {
      if (!desktop) gsap.fromTo(text, { x: () => side * reach() }, { x: 0, ease: 'none', scrollTrigger: enter });
    } else {
      gsap.fromTo(text, { x: () => side * reach(), opacity: 0 }, { x: 0, opacity: 1, ease: 'none', scrollTrigger: enter });
      if (cover) gsap.fromTo(cover, { x: () => -side * reach() }, { x: 0, ease: 'none', scrollTrigger: scrub(() => flowTop(i) - window.innerHeight, () => flowTop(i) - pin(i)) });
    }

    // As the next card slides up to its pin point, this one scales back and darkens.
    if (rows[i + 1]) {
      gsap.fromTo(row, { scale: 1, '--dim': 0 }, { scale: desktop ? 0.94 : 0.96, '--dim': 0.28, ease: 'none',
        scrollTrigger: scrub(() => flowTop(i + 1) - window.innerHeight, () => flowTop(i + 1) - pin(i + 1)) });
    }
  });

  // Tabbing into a card: if the focused element is covered (by the next card, or by the
  // Aurora video before it has shrunk) or off screen, scroll to where it's visible. That's
  // the element about a third of the way down the screen, but never so far that the next
  // card has arrived, and for Aurora on desktop never before the video has settled.
  const onFocus = (event: FocusEvent) => {
    const el = event.target as HTMLElement;
    const i = rows.findIndex((row) => row.contains(el));
    if (i < 0) return;
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + Math.min(4, r.width / 2), r.top + r.height / 2);
    if (r.top >= 0 && r.bottom <= window.innerHeight && hit && (el === hit || el.contains(hit))) return;
    const row = rows[i];
    const scale = row.getBoundingClientRect().width / row.offsetWidth || 1;
    const rel = (r.top - row.getBoundingClientRect().top) / scale;
    let target = flowTop(i) + rel - window.innerHeight * 0.35;
    if (i === 0 && desktop) target = Math.max(target, flowTop(0) - pin(0) + window.innerHeight * 0.95);
    if (rows[i + 1]) target = Math.min(target, flowTop(i + 1) - window.innerHeight);
    window.scrollTo(0, target);
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

/**
 * The big image moment. Desktop: the Aurora console video fills the screen as the first
 * card arrives and pins, then shrinks into its place in the card over the next ~0.9
 * screens of scroll (the card holds for that: WorkRow.astro gives it a bottom margin).
 * Mobile: a simplified version, the cover bleeding to the screen edges and settling
 * into the card as it scrolls in.
 */
function bigImage(row: HTMLElement, cover: HTMLElement, desktop: boolean, pinnedAt: () => number, stack: HTMLElement) {
  if (desktop) {
    // The cover's rect while the card is pinned, from layout offsets (transform-free).
    const full = () => {
      const x = stack.getBoundingClientRect().left + cover.offsetLeft;
      const y = DECK_TOP + cover.offsetTop;
      const w = cover.offsetWidth;
      const h = cover.offsetHeight;
      const s = Math.max(window.innerWidth / w, window.innerHeight / h);
      return { x: window.innerWidth / 2 - (x + w / 2), y: window.innerHeight / 2 - (y + h / 2), scale: s };
    };
    gsap.fromTo(cover, { x: () => full().x, y: () => full().y, scale: () => full().scale },
      { x: 0, y: 0, scale: 1, ease: 'power2.inOut',
        scrollTrigger: { start: pinnedAt, end: () => pinnedAt() + window.innerHeight * 0.9, scrub: true, invalidateOnRefresh: true } });
    // The text arrives from the right as the video leaves it room.
    gsap.from(row.querySelectorAll('.work-row__readout, .work-row__body'), { opacity: 0, x: () => Math.min(140, window.innerWidth * 0.1), ease: 'none',
      scrollTrigger: { start: () => pinnedAt() + window.innerHeight * 0.45, end: () => pinnedAt() + window.innerHeight * 0.9,
        scrub: true, invalidateOnRefresh: true } });
  } else {
    const bleed = () => window.innerWidth / cover.offsetWidth;
    gsap.fromTo(cover, { scale: bleed }, { scale: 1, ease: 'none',
      scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top 35%', scrub: true, invalidateOnRefresh: true } });
  }
}
