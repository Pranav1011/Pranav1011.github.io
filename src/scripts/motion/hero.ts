import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { EASE, HEADLINE } from './tokens';

let drift: gsap.core.Tween | undefined;

/** The drift is created on each re-split, outside any matchMedia context, so contexts
 *  that end (reduced motion switched on, window below 1024px) remove it explicitly. */
export function stopDrift() {
  drift?.scrollTrigger?.kill();
  drift?.revert();
  drift = undefined;
}

/**
 * Headline: masked line reveal on load (~0.5 s). On desktop the lines then drift up and
 * fade as you scroll past the hero, each a little faster than the one above.
 */
export function heroHeadline(desktop: MediaQueryList) {
  const h1 = document.querySelector<HTMLElement>('#hero-title');
  // If the inline fail-safe already revealed it (slow network), don't hide it again.
  if (!h1 || document.documentElement.dataset.motionFallback) return;
  SplitText.create(h1, {
    type: 'lines',
    mask: 'lines',
      // Lines keep their real text, so skip SplitText's aria-label (invalid on <p>).
      aria: 'none',
    autoSplit: true,
    onSplit: (self) => {
      stopDrift();
      if (desktop.matches) {
        drift = gsap.to(self.masks, {
          y: (i) => -28 * (i + 1),
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: h1, start: 'top 12%', end: 'bottom -30%', scrub: true },
        });
      }
      return gsap.from(self.lines, { yPercent: 105, duration: HEADLINE.duration, stagger: HEADLINE.stagger, ease: EASE });
    },
  });
}

/** Hero photo: the image moves slightly inside the fixed oval (desktop). It travels 7%
 *  of its height in total, within the 6% spare it has above and below the frame. */
export function heroParallax() {
  const frame = document.querySelector<HTMLElement>('[data-parallax]');
  const img = frame?.querySelector('img');
  if (!frame || !img) return;
  gsap.fromTo(img, { yPercent: -3.5 }, { yPercent: 3.5, ease: 'none',
    scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } });
}

