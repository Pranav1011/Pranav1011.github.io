// Motion entry. Progressive enhancement only: without JS, or under reduced motion,
// every element is already in its final state and nothing here runs.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initLenis } from './lenis';
import { heroHeadline, heroTrace } from './hero';
import { charts, covers, headings, timeline } from './reveals';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  heroHeadline();
  const undoTrace = heroTrace();
  headings();
  covers();
  charts();
  timeline();
  root.classList.remove('motion-pending');
  return () => undoTrace?.();
});

mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)', () => initLenis());

// Reduced motion (or a change to it mid-visit): nothing is hidden.
mm.add('(prefers-reduced-motion: reduce)', () => {
  root.classList.remove('motion-pending');
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
