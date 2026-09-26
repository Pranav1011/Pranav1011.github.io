import { gsap } from 'gsap';

/**
 * The statement's words fill from secondary grey to ink, tied to scroll position (every
 * width, native scroll on touch). Both ends are readable: the grey is 3.43:1 on paper, AA for
 * text this large (≥ 24 px bold).
 * On desktop the chips around it drift at their own speeds.
 */
export function statement(desktop: boolean) {
  const line = document.querySelector<HTMLElement>('[data-statement]');
  if (!line) return;
  const section = line.closest('section')!;
  const words = line.querySelectorAll('.statement__word');
  const style = getComputedStyle(document.documentElement);
  const grey = style.getPropertyValue('--c-faded').trim();
  const ink = style.getPropertyValue('--c-ink').trim();
  gsap.fromTo(words, { color: grey }, { color: ink, ease: 'none', stagger: 0.1,
    scrollTrigger: { trigger: line, start: 'top 85%', end: 'bottom 45%', scrub: true } });

  if (!desktop) return;
  section.querySelectorAll<HTMLElement>('[data-speed]').forEach((chip) => {
    const speed = Number(chip.dataset.speed);
    gsap.fromTo(chip, { y: () => -speed * window.innerHeight * 0.18 }, { y: () => speed * window.innerHeight * 0.18, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });
}
