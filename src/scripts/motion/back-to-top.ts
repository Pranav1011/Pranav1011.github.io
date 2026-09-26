import { lenis } from './lenis';

/**
 * Back to top (every page, every width): a round petrol button that appears after about
 * one screen of scrolling and hides near the top. It scrolls smoothly with Lenis (instantly
 * under reduced motion, or where Lenis isn't running) and moves keyboard focus to the skip
 * link. Over dark sections it switches to the on-dark colours. It never covers a link or
 * button: it lifts above one that would sit under it, or hides if that would take it too far.
 */
export function backToTop() {
  const btn = document.querySelector<HTMLButtonElement>('[data-to-top]');
  if (!btn) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const skip = document.querySelector<HTMLElement>('.skip-link');
  const MAX_LIFT = 160;
  let shown = false;
  let raf = 0;

  // Controls that can actually be clicked: rendered, not fading out, and not hidden under
  // another layer (a card stacked over it, the curtain behind the page).
  const clickable = (el: HTMLElement) => {
    if (el === btn || btn.contains(el) || el.getClientRects().length === 0 || el.closest('[data-leaving], [hidden]')) return false;
    const r = el.getBoundingClientRect();
    const top = firstAt(r.left + r.width / 2, r.top + r.height / 2);
    return !!top && (el === top || el.contains(top) || top.contains(el));
  };
  /** The topmost element at a point, ignoring this button. */
  const firstAt = (x: number, y: number) => document.elementsFromPoint(x, y).find((e) => e !== btn && !btn.contains(e)) ?? null;
  const targets = () => [...document.querySelectorAll<HTMLElement>('a, button, summary, video[controls], [role="button"]')];
  const hits = (a: DOMRect, b: DOMRect, pad = 10) =>
    a.left - pad < b.right && a.right + pad > b.left && a.top - pad < b.bottom && a.bottom + pad > b.top;

  const update = () => {
    raf = 0;
    const want = window.scrollY > window.innerHeight * 0.9;
    if (want !== shown) {
      shown = want;
      btn.hidden = !want;
    }
    if (!shown) return;
    // Measure from the resting position.
    btn.style.setProperty('--lift', '0px');
    const base = btn.getBoundingClientRect();
    // Lift above whatever it would cover; repeat until nothing overlaps (stacked links).
    const near = targets().filter((el) => { const r = el.getBoundingClientRect(); return r.right > base.left - 20 && r.left < base.right + 20 && r.top < base.bottom + 20 && r.bottom > base.top - MAX_LIFT - 60; }).filter(clickable);
    let lift = 0;
    for (let pass = 0; pass < 6; pass++) {
      const moved = new DOMRect(base.x, base.y - lift, base.width, base.height);
      const over = near.filter((el) => hits(moved, el.getBoundingClientRect()));
      if (!over.length) break;
      lift = Math.max(...over.map((el) => base.bottom - el.getBoundingClientRect().top + 12));
    }
    const clear = lift <= MAX_LIFT;
    btn.style.setProperty('--lift', `${clear ? lift : 0}px`);
    btn.dataset.clear = clear ? '' : 'no';
    // Colour: on-dark over petrol and ink sections.
    const under = firstAt(base.left + base.width / 2, base.top - lift + base.height / 2);
    const dark = !!under?.closest('.scheme-work, .scheme-ink, .cover__media');
    btn.classList.toggle('to-top--on-dark', dark);
  };
  // Every frame while scrolling, plus once shortly after it stops (smooth scrolling and
  // late layout can leave the last frame stale).
  let settle: number | undefined;
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update);
    window.clearTimeout(settle);
    settle = window.setTimeout(() => { if (!raf) raf = requestAnimationFrame(update); }, 180);
  };

  const onClick = () => {
    const smooth = lenis();
    if (smooth && !reduce.matches) smooth.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'auto' });
    skip?.focus({ preventScroll: true });
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  btn.addEventListener('click', onClick);
  schedule();
}
