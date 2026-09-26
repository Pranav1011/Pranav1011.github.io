import { gsap } from 'gsap';

/**
 * The focus list: the item at the middle of the screen is ink and the others are faded,
 * scrubbed with scroll (every width). Faded is #7B838A, 3.43:1 on paper, which passes AA for
 * text this large (≥ 24 px bold), so every item stays readable at every point.
 */
export function focusList() {
  const items = document.querySelectorAll<HTMLElement>('[data-focus] .focus__item');
  if (!items.length) return;
  const style = getComputedStyle(document.documentElement);
  const faded = style.getPropertyValue('--c-faded').trim();
  const ink = style.getPropertyValue('--c-ink').trim();
  items.forEach((item) => {
    gsap.timeline({ scrollTrigger: { trigger: item, start: 'center 80%', end: 'center 20%', scrub: true } })
      .fromTo(item, { color: faded }, { color: ink, ease: 'none', duration: 1 })
      .to(item, { color: faded, ease: 'none', duration: 1 });
  });
}
