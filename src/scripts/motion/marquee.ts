import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The domains marquee (motion allowed, every width). Rows drift in opposite directions,
 * run faster the faster you scroll, and reverse when you scroll up. It only runs while on
 * screen, and the Pause button stops it (WCAG 2.2.2).
 */
export function marquee(desktop: boolean) {
  const section = document.querySelector<HTMLElement>('.marquee');
  if (!section) return;
  const rows = [...section.querySelectorAll<HTMLElement>('[data-marquee-row]')].map((row) => ({
    track: row.querySelector<HTMLElement>('.marquee__track')!,
    sign: Number(row.dataset.marqueeRow),
    x: 0,
  }));
  const toggle = section.querySelector<HTMLButtonElement>('[data-marquee-toggle]');
  const label = toggle?.querySelector<HTMLElement>('[data-label]');

  const BASE = desktop ? 70 : 42; // px per second at rest
  let direction = 1;
  let boost = 0;
  let paused = false;
  let visible = false;

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (visible = self.isActive),
    onUpdate: (self) => {
      direction = self.direction;
      boost = Math.max(boost, Math.min(Math.abs(self.getVelocity()) / 220, 9));
    },
  });

  const tick = (_time: number, deltaMs: number) => {
    boost *= 0.92;
    if (paused || !visible) return;
    const dx = BASE * (1 + boost) * (deltaMs / 1000) * direction;
    rows.forEach((row) => {
      const half = row.track.scrollWidth / 2;
      // Row 1 moves left on the way down, row 2 right; both reverse on scroll-up.
      row.x = gsap.utils.wrap(-half, 0, row.x - dx * row.sign);
      row.track.style.transform = `translate3d(${row.x}px, 0, 0)`;
    });
  };
  gsap.ticker.add(tick);

  const onToggle = () => {
    paused = !paused;
    if (label) label.textContent = paused ? 'Play' : 'Pause';
  };
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', onToggle);
  }

  return () => {
    gsap.ticker.remove(tick);
    st.kill();
    rows.forEach((row) => (row.track.style.transform = ''));
    if (toggle) {
      toggle.hidden = true;
      toggle.removeEventListener('click', onToggle);
    }
  };
}
