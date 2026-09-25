// Motion tokens, shared by every module. Mirror of the CSS tokens in tokens.css.
export const EASE = 'expo.out'; // decelerating, no bounce
export const EASE_IN_OUT = 'power3.inOut';
export const DUR = { fast: 0.18, base: 0.6, slow: 1.0 } as const;
/** Hero headline: whole reveal ≈ 0.5 s. */
export const HEADLINE = { duration: 0.42, stagger: 0.06 } as const;
/** Hero trace playback length in seconds (real run time compressed onto this). */
export const TRACE_PLAYBACK = 2.8;
/** Where scroll reveals start: element top reaches 82% of the viewport. */
export const REVEAL_START = 'top 82%';
