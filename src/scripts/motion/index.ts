// Motion entry. Progressive enhancement only: without JS, or under reduced motion,
// every element is already in its final state and nothing here runs.
// Every width: headline reveal, character-stagger section headings, the focus-list
// highlight, the statement's scroll fill, the Experience timeline, Selected work as a
// deck of colour cards (CSS sticky, native scrolling) opening with the Aurora video
// shrinking into its card, and the curtain footer. Desktop (1024px and up) adds headline
// drift, photo and cover parallax, the floating statement chips, the sliding "Selected
// work" heading, chart build-ins and Lenis on fine pointers. Section
// colours need no script: each section paints its own, so the next colour arrives with
// its top edge.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initLenis } from './lenis';
import { heroHeadline, heroParallax, stopDrift } from './hero';
import { trace } from './trace';
import { panels } from './panels';
import { curtain } from './curtain';
import { statement } from './statement';
import { focusList } from './focus';
import { scrollCue } from './scroll-cue';
import { backToTop } from './back-to-top';
import { marquee } from './marquee';
import { experienceSlides, focusSlides } from './horizontal';
import { charts, headings, timeline, workHeading } from './reveals';

gsap.registerPlugin(ScrollTrigger, SplitText);
// A phone's address bar resizes the viewport as it shows and hides; don't re-measure
// every trigger for that (it would jolt scrubbed animations mid-scroll).
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;
const mm = gsap.matchMedia();
const MOTION = '(prefers-reduced-motion: no-preference)';
const DESKTOP = `${MOTION} and (min-width: 1024px)`;

mm.add(MOTION, () => {
  heroHeadline(window.matchMedia(DESKTOP));
  const undoTrace = trace();
  headings();
  timeline();
  focusList();
  root.classList.remove('motion-pending');
  return () => {
    undoTrace?.();
    stopDrift();
  };
});

// Set pieces that differ by width re-run when the window crosses 1024px.
mm.add({ motion: MOTION, desktop: DESKTOP }, (ctx) => {
  const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
  if (!motion) return;
  const undoPanels = panels(desktop);
  const undoCurtain = curtain(desktop);
  const undoMarquee = marquee(desktop);
  statement(desktop);
  focusSlides(desktop);
  experienceSlides(desktop);
  if (desktop) {
    heroParallax();
    workHeading();
    charts();
  }
  return () => {
    undoPanels?.();
    undoCurtain?.();
    undoMarquee?.();
    stopDrift();
  };
});

mm.add(`${DESKTOP} and (pointer: fine)`, () => initLenis());

// Reduced motion (or a change to it mid-visit): nothing is hidden.
mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.remove('motion-pending');
});

// Not motion: these work under reduced motion too (static cue, instant scroll to top).
scrollCue();
backToTop();

document.fonts?.ready.then(() => ScrollTrigger.refresh());
