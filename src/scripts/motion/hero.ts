import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { EASE, HEADLINE, TRACE_PLAYBACK } from './tokens';

/** Headline: masked line reveal on load (~0.5 s). */
export function heroHeadline() {
  const h1 = document.querySelector<HTMLElement>('#hero-title');
  // If the inline fail-safe already revealed it (slow network), don't hide it again.
  if (!h1 || document.documentElement.dataset.motionFallback) return;
  SplitText.create(h1, {
    type: 'lines',
    mask: 'lines',
      // Lines keep their real text, so skip SplitText's aria-label (invalid on <p>).
      aria: 'none',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, { yPercent: 105, duration: HEADLINE.duration, stagger: HEADLINE.stagger, ease: EASE }),
  });
}

/**
 * Trace playback: both runs share one clock, compressed from real run time onto
 * TRACE_PLAYBACK seconds, so the run without the check visibly takes longer.
 * Starts when the trace scrolls into view; Replay restarts it.
 */
export function heroTrace() {
  const fig = document.querySelector<HTMLElement>('[data-trace]');
  if (!fig) return;
  const t0 = Number(fig.dataset.tStart);
  const t1 = Number(fig.dataset.tEnd);
  const at = (t: number) => ((t - t0) / (t1 - t0)) * TRACE_PLAYBACK;
  const num = (el: Element, key: string) => Number((el as HTMLElement | SVGElement).dataset[key]);

  // transformOrigin goes in the *from* vars: it must be measured before scale 0
  // collapses the element's box, or markers land offset after playback.
  const tl = gsap.timeline({ paused: true });
  fig.querySelectorAll('svg [data-row]').forEach((row) => {
    const act = row.querySelector('.phase--act')!;
    const post = row.querySelector('.phase--post')!;
    const guard = row.querySelector('.guard')!;
    const reply = row.querySelector('.reply')!;

    tl.fromTo(act, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, ease: 'none',
      duration: at(num(act, 't1')) - at(num(act, 't0')) }, at(num(act, 't0')));
    row.querySelectorAll('.call').forEach((call) => {
      tl.fromTo(call, { scaleY: 0, transformOrigin: '50% 50%' }, { scaleY: 1, duration: 0.2, ease: EASE }, at(num(call, 't')));
    });
    tl.fromTo(guard, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: EASE }, at(num(guard, 't')));
    tl.fromTo(post, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, ease: 'none',
      duration: at(num(post, 't1')) - at(num(post, 't0')) }, at(num(post, 't0')));
    tl.fromTo(reply, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.25, ease: EASE }, at(num(reply, 't')));
    row.querySelectorAll<SVGElement>('.note').forEach((note) => {
      tl.fromTo(note, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, at(num(note, 't')) + 0.05);
    });
  });

  const replay = fig.querySelector<HTMLButtonElement>('.trace__replay');
  const onReplay = () => tl.restart();
  if (replay) {
    replay.hidden = false;
    replay.addEventListener('click', onReplay);
  }

  ScrollTrigger.create({ trigger: fig, start: 'top 70%', once: true, onEnter: () => tl.play() });

  return () => {
    if (!replay) return;
    replay.hidden = true;
    replay.removeEventListener('click', onReplay);
  };
}
