import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LENIS, expoOut } from './tokens';

let current: Lenis | undefined;

/** The running instance, for code that needs to scroll programmatically. */
export const lenis = () => current;

/** Smooth, weighted scroll on desktop pointers only; touch keeps native scrolling.
 *  Each wheel gesture glides for LENIS.duration on an exponential ease-out. */
export function initLenis(): () => void {
  current = new Lenis({
    autoRaf: false,
    anchors: true,
    duration: LENIS.duration,
    easing: expoOut,
    wheelMultiplier: LENIS.wheelMultiplier,
  });
  const instance = current;
  instance.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    instance.destroy();
    current = undefined;
  };
}
