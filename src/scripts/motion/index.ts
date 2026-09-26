// Motion entry. Progressive enhancement only: without JS, or under reduced motion,
// every element is already in its final state and nothing here runs.
// Desktop (1024px and up) adds the set pieces: stacking project panels, headline drift
// and photo parallax. Mobile keeps the simple reveals. Section colours need no script:
// each section paints its own, so the next colour arrives with its top edge.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initLenis } from './lenis';
import { heroHeadline, heroParallax, stopDrift } from './hero';
import { trace } from './trace';
import { panels } from './panels';
import { charts, headings, timeline } from './reveals';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const mm = gsap.matchMedia();
const MOTION = '(prefers-reduced-motion: no-preference)';
const DESKTOP = `${MOTION} and (min-width: 1024px)`;

mm.add(MOTION, () => {
  heroHeadline(window.matchMedia(DESKTOP));
  const undoTrace = trace();
  headings();
  timeline();
  root.classList.remove('motion-pending');
  return () => {
    undoTrace?.();
    stopDrift();
  };
});

mm.add(DESKTOP, () => {
  const undoPanels = panels();
  heroParallax();
  charts();
  return () => {
    undoPanels?.();
    stopDrift();
  };
});

mm.add(`${DESKTOP} and (pointer: fine)`, () => initLenis());

// Reduced motion (or a change to it mid-visit): nothing is hidden.
mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.remove('motion-pending');
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
