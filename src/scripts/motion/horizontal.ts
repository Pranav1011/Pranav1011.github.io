import { gsap } from 'gsap';

/** Horizontal entrances: a short slide on mobile (never more than 32px), longer on desktop. */
const reach = (desktop: boolean, px: number) => () => (desktop ? px : Math.min(32, px));

/** Focus list: odd items (1st, 3rd, 5th) enter from the left, even ones from the right. */
export function focusSlides(desktop: boolean) {
  document.querySelectorAll<HTMLElement>('[data-focus] .focus__item').forEach((item, i) => {
    const d = reach(desktop, window.innerWidth * 0.18);
    gsap.fromTo(item, { x: () => (i % 2 === 0 ? -1 : 1) * d() }, { x: 0, ease: 'none',
      scrollTrigger: { trigger: item, start: 'top bottom', end: 'center 55%', scrub: true, invalidateOnRefresh: true } });
  });
}

/** Experience: dates and titles enter from the left, bullets from the right. */
export function experienceSlides(desktop: boolean) {
  document.querySelectorAll<HTMLElement>('.timeline > li').forEach((role) => {
    const d = reach(desktop, 96);
    const st = { trigger: role, start: 'top bottom', end: 'top 55%', scrub: true, invalidateOnRefresh: true };
    gsap.fromTo(role.querySelectorAll('.split__label, h3, .meta'), { x: () => -d() }, { x: 0, ease: 'none', scrollTrigger: st });
    gsap.fromTo(role.querySelectorAll('.points > li'), { x: () => d() }, { x: 0, ease: 'none', stagger: 0.1, scrollTrigger: { ...st } });
  });
}
