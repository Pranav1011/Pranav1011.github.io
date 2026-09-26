import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { CHARS, CHART_START, DUR, EASE, REVEAL_START } from './tokens';

const once = (trigger: Element, start = REVEAL_START) => ({ trigger, start, once: true });

/**
 * Section headings: a short character stagger, once. The h2 keeps an aria-label and the
 * split characters are aria-hidden, so it's read as one word, not letter by letter.
 * Figure titles (<p>, where aria-label isn't valid) keep the masked line reveal.
 */
export function headings() {
  document.querySelectorAll<HTMLElement>('.section-title').forEach((el) => {
    SplitText.create(el, {
      type: 'words,chars',
      mask: 'chars',
      aria: 'auto',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, { yPercent: 110, duration: CHARS.duration, stagger: CHARS.stagger, ease: EASE, scrollTrigger: once(el) }),
    });
  });
  document.querySelectorAll<HTMLElement>('.figure__title').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      aria: 'none',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, { yPercent: 105, duration: DUR.base, stagger: 0.07, ease: EASE, scrollTrigger: once(el) }),
    });
  });
}

/** "Selected work" slides a short way sideways as the petrol band comes up (desktop). */
export function workHeading() {
  const h = document.querySelector<HTMLElement>('#work');
  const band = h?.closest('section');
  if (!h || !band) return;
  gsap.fromTo(h, { x: () => Math.min(120, window.innerWidth * 0.08) }, { x: 0, ease: 'none',
    scrollTrigger: { trigger: band, start: 'top bottom', end: 'top 25%', scrub: true, invalidateOnRefresh: true } });
}

/**
 * Case-study charts build in (desktop only). The build starts while the plate is still
 * 30% of a viewport below the screen, so it's under way before the plate is seen and a
 * plate never shows up empty. Cover charts, and every chart on mobile, render drawn.
 */
export function charts() {
  document.querySelectorAll<HTMLElement>('.figure').forEach((fig) => {
    const tl = gsap.timeline({ scrollTrigger: once(fig, CHART_START) });

    // Flow diagrams: stages arrive left to right, then the spanning layers.
    const stages = fig.querySelectorAll('.flow__stage');
    if (stages.length) {
      tl.from(stages, { opacity: 0, x: -12, duration: 0.45, stagger: 0.08, ease: EASE });
      tl.from(fig.querySelectorAll('.flow__layer'), { opacity: 0, duration: 0.4, stagger: 0.1 }, '-=0.1');
    }

    // Dumbbells: the span grows from the lower value, then the dots land.
    fig.querySelectorAll('.dumbbell__row:not(.dumbbell__axis)').forEach((row, i) => {
      const span = row.querySelector('.dumbbell__span');
      const points = row.querySelectorAll('.dumbbell__point');
      const labels = row.querySelectorAll('.dumbbell__value, .dumbbell__values');
      tl.from(points, { scale: 0, duration: 0.35, stagger: 0.12, ease: EASE }, i * 0.12);
      if (span) tl.from(span, { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.out' }, i * 0.12 + 0.1);
      tl.from(labels, { opacity: 0, duration: 0.3 }, i * 0.12 + 0.35);
    });

    // Before/after bars grow from zero; the "after" bar lands second.
    fig.querySelectorAll('.ba__metric').forEach((m, i) => {
      tl.from(m.querySelectorAll('.ba__bar'), { scaleX: 0, transformOrigin: 'left center', duration: 0.7, stagger: 0.25, ease: 'power3.out' }, i * 0.2);
      tl.from(m.querySelectorAll('.ba__value, .ba__cut'), { opacity: 0, duration: 0.3, stagger: 0.1 }, i * 0.2 + 0.5);
    });

    // Degradation curves draw left to right (a clip wipe keeps the dash pattern intact).
    fig.querySelectorAll('.deg').forEach((svg) => {
      tl.fromTo(svg, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut', clearProps: 'clipPath' }, 0);
    });
  });
}

/** Experience timeline: the rule draws down as you scroll through the section. */
export function timeline() {
  const line = document.querySelector<HTMLElement>('.timeline__line');
  const list = document.querySelector<HTMLElement>('.timeline');
  if (!line || !list) return;
  gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top center', ease: 'none',
    scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 60%', scrub: true } });
}
