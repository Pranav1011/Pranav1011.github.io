# Design log

## 2026-09-24 — Phase 0
- Target roles narrowed to agentic AI / AI engineer. Lineup: Aurora, F1 RIA, Recommend, PitWall. Tessera dropped as not agentic.
- Motion stack kept: GSAP + Lenis, about 50 KB gzipped, loaded after first paint, Lenis on desktop only. CSS scroll-driven animations rejected: uneven browser support and no equivalent to SplitText or DrawSVG.
- Count-up animation on metrics dropped: it's a gimmick and conflicts with the no-counters rule.
- Hero candidates, chosen in Phase 4: (a) real Aurora agent trace as a timing screen, (b) F1 RIA token collapse, (c) PitWall degradation curves.
- Astro 5 content config lives at `src/content.config.ts`, not the brief's `src/content/config.ts`.

## 2026-09-24 — Phase 1 palette
- Purple (F1 sector) accent dropped at Pranav's call. Switched to Petrol & Brass: petrol `#00566E` as drafting ink for the number that matters, brass `#A57710` for chart marks only.
- CVD check (Machado 2009): petrol/brass stay distinct under every simulated deficiency. Petrol/secondary collapse under protanopia and in greyscale (ΔE 4.4), so neither charts nor text rely on hue alone for that pair. Prose links are always underlined (petrol vs ink is 2.10:1 luminance).
- Paper 2 removed. Code blocks use a 50% tint/ground mix.

## 2026-09-25 — Content restructure + scaffold
- Adopted the friend's mock **content structure only**:
  - hero intro paragraph and availability line
  - a 3-cell strip (Focus / Most recently / Studying)
  - 3 featured projects with a headline, 3 mechanisms and 1 result
  - an "Also built" row, a Toolkit section, and the closing CTA
- Not adopted: the mock's eyebrows, 01-numbering, counts, pill buttons, dark band and italic accent word.
- Recommend demoted to "Also built". PitWall is proposed for slot 3; LLM-Judge is gated on a multi-judge re-run.
- Found that F1 RIA's HyDE output is generated but never used by retrieval. Copy now says "HyDE in query understanding".
- Scaffold on **Astro 7.3** (needs Node ≥ 22.12; installed Node 24 via nvm, pinned with `.nvmrc`; system default stays 20):
  - **Fonts:** the built-in Fonts API (fontsource provider), with metric-matched fallbacks generated automatically. No font npm packages. Serif is declared once but only emitted by `WorkLayout` (verified: home loads Schibsted only). Serif preload is narrowed to regular 400; italic and bold load on use.
  - **Markdown:** Astro 7's default processor is Sätteri, which drops `markdown.remarkPlugins`. A Sätteri mdast plugin (`strip-html-comments`) removes `<!-- src -->` notes. Before the fix, 11 comments per case study, naming local files, were in the built HTML. Now 0.
  - **Schema:** exactly 3 mechanisms, summary ≤ 25 words, headline ≤ 12 words, and a placeholder guard (`[...]`, TBD, TODO) on every copy field. The build fails if any placeholder ships.
  - **Deploy:** withastro/action@v6, actions/deploy-pages@v5, actions/checkout@v7, Node 24.
- Focus ring is a `box-shadow` pair: 2px ground, then 2px petrol. Verified in the browser.
- Frontmatter strings bypass the markdown processor's smart punctuation, so apostrophes in frontmatter are typed as ’ directly.

## 2026-09-25 — Phase 2 static build
- **Hero:**
  - Headline at `max-width: 20ch` (3 lines at 1440); intro, availability and links in cols 1–7, with the strip stacked in cols 9–12.
  - The trace now starts inside the first screen (it was below the fold in the first pass).
- **Trace figure:** three SVG layouts, each drawn near 1:1 for its breakpoint: 1200 (≥1024), 720 (640–1023) and 360 (<640).
  - A single scaled SVG gave 4–8px labels on tablets and phones.
  - Labels flip to the left of their marker when they would cross the edge.
  - Data comes from two real traces via `scripts/extract-aurora-trace.py`.
- **Rejected:**
  - A coloured left border on the result line (the side-stripe cliché). Replaced with a hairline plus a petrol "Result." label.
  - A 6px petrol top bar on the OG card, for the same reason.
- **Readout figures** use proportional numerals, because Schibsted's tabular figures give "." a full digit width ("−23 . 4%"). Tables also dropped tabular figures for the same reason.
- **Astro scoping gotcha:** `.parent > *` compiles to `.parent[data-astro-cid] > [data-astro-cid]`, which out-ranks `.child[data-astro-cid]` inside media queries. This broke the case-study grid. The fix is explicit per-child defaults at equal specificity.
- **Hyphen breaks:** headlines render through `Headline.astro`, which wraps hyphenated words in `white-space: nowrap`, so "customer-ops" never splits at the hyphen.
- **Reading progress** is CSS scroll-driven (`animation-timeline: scroll(root)`) with no JS. It's hidden without support and under reduced motion.
- **Copy-email** ships as `hidden` and is revealed by JS; it announces through `role="status"`. The mailto link works without JS.
- **OG image:** `/og-card/` (noindex, excluded from the sitemap) is screenshotted at 1200×630 into `public/og.png`.
- **Resume link** renders only once `public/resume.pdf` exists (Phase 5).
- **Lighthouse mobile:** 100 / 100 / 100 / 100 on home and `/work/aurora/`, CLS 0, LCP 1.5–1.7s.

## 2026-09-25 — Art-direction pass
- **Hero trace is now the signature:** a ruler above it, a title line ("Same ticket, same model. The only change is the loop-breaker."), strokes about 1.7× heavier, 16px labels on desktop, and about 50% more vertical room. Labels get a ground-coloured halo (`paint-order: stroke`) so grid lines never cut through them.
- **Rhythm:**
  - Selected work sits on a full-bleed tint band (`#DBEBF2`, with `#AFC6D1` hairlines). All text is AA on tint: ink 14.1, secondary 5.6, petrol 6.7, brass-text 4.6.
  - The closing CTA plus footer form a full-bleed ink band. On-dark petrol `#7CC4DC` (8.9:1) and on-dark secondary `#A3ADB5` (7.6:1). Plain petrol on ink is only 2.1:1, so it isn't used there. The focus ring is inverted on dark.
  - Three spacing tokens: `--s-section-lg` around the set pieces, `--s-section`, and `--s-section-sm` for the record sections.
  - Research, Toolkit and Education use a smaller heading scale.
- **Key figures:** readout clamp up to 5rem. Aurora's lead is "0 / 43" (eval scenarios with a policy violation). Below 1024px the readout sits above the body so it never overflows.
- **Grey text:** a new `--t-meta` token (15–16px) for mechanism details, stack, captions, the strip and dates.
- **Case studies:** the body spans cols 4–12. Prose children stay capped at 68ch; tables, figures and `pre` break out to the full width.
- Lighthouse after the pass: 100/100/100/100 on home and a case study.

## 2026-09-25 — Phase 3: real project visuals
- **Every visual is generated from committed repo outputs.** Each extractor takes the repo path as an argument, so no local paths are committed:
  - `scripts/extract-aurora-results.py`: `docs/model-comparison.md` (from `make compare`) and `eval_results/latest.json`
  - `scripts/extract-f1-consolidation.py`: `backend/eval/results/consolidation.json`
  - `scripts/extract-pitwall.py`: `results/model_full.pkl` fixed effects (run inside PitWall's uv env to unpickle), `model_metrics.json`, `backtest.json`, and stint caps from `data/laps_clean.parquet`
- **Charts:**
  - Bar and dumbbell charts are HTML/CSS, so labels stay real text at every width.
  - The degradation curves are SVG, with wide and compact layouts.
  - The palette rule holds everywhere: petrol is the result, brass the reference or failure, and shape plus direct labels repeat every colour cue. Brass points are hollow squares; the before-bar is hatched.
- **Diagrams:** `Flow.astro` draws numbered stages (a real sequence) plus spanning layers; stages stack vertically on phones.
  - Aurora: 4 stages, with guardrail and reliability layers.
  - F1 RIA: its 8 LangGraph nodes read from `graph.py`, including the corrective Evaluate → Plan loop.
  - PitWall: a 5-stage pipeline.
- **Case studies are now MDX**, with figures placed in the prose. Source notes became `{/* */}` comments, which never render.
- **Covers:**
  - Aurora: its demo GIF re-encoded to a 166KB MP4 (it was 235KB). Poster from frame 1, `preload="none"`, played only while ≥50% visible, and never under reduced motion. Without JS it keeps native controls.
  - F1 RIA and PitWall: their headline charts. F1 RIA has no screenshots, and its UI needs three databases running to show anything real.
- **Bugs found in renders and fixed:**
  - `color-mix(in oklch, tint, ground)` turned pink, because the near-neutral ground's hue sends the interpolation through magenta. All mixes now use sRGB.
  - Flow stages misaligned, because stretched grid rows spread space inside each stage (fixed with `align-content: start`).
  - Degradation end labels crossed other curves. They moved to a right gutter with leader lines.
  - Dumbbell labels collided or clipped. The low value's label now sits beside its dot; on phones the values are listed as text.
- **QA:**
  - Lighthouse mobile: home 100/100/100/100 (169 KB total); PitWall case study 99/100/100/100.
  - 15 renders with no overflow and no console errors.

## 2026-09-25 — Plain-language copy + Phase 4 motion
- **Copy rule:** problem → what I did → result, in plain words; exact metrics live in result lines and case studies. Every rewrite was re-checked against the repos:
  - "Handled correctly" replaces "task success". Correct escalations count as success, so "resolved" would be wrong.
  - Aurora "0 forbidden actions in every test run, on both models" holds for every recorded run: two 43-ticket runs on the scripted stand-in, and the 8-ticket comparison on both models.
  - F1 RIA says "tool definitions 85% smaller" everywhere. "Per request" is gone, because the planner reads a text tool list, not the schemas.
  - Trace vs case study: the hero draws the two logged runs (62.1 s / 34.8 s). The case study also cites the error analysis's separate run (69.4 s / 40.5 s, no saved log). The logged run made 9 tool calls, 8 of them `get_order`; the old copy wrongly said "nine times get_order".
  - The proposed end label "replied citing an order that didn't exist" is **not** supported by the log. The model guessed an order number that exists but belongs to another customer. Both runs ended with the ticket handed to a human, so the labels say that.
- **Hero trace:** axis cropped to start at 18 s, just before the first tool call; the caption says the first 20 s of reading and planning are cropped. Labels fall back to right-aligning at the edge when neither side fits.
- **Motion stack:** GSAP 3.15 (ScrollTrigger, SplitText) plus Lenis. The motion chunk is 51.7 KB gzipped, dynamically imported by a 1.4 KB loader.
  - `motion-pending` hides only the hero h1 until GSAP runs; a 2.5 s inline fail-safe removes it. It isn't set under reduced motion.
  - All animation runs inside `gsap.matchMedia('(prefers-reduced-motion: no-preference)')`. Lenis runs only on fine pointers at ≥1024px.
  - The OG card sets `data-no-motion`, so its screenshot is the final state.
- **Hero playback:** both runs share one clock, compressing real run time onto 2.8 s. It triggers at `top 70%`, plays once, and a Replay button (hidden without JS and under reduced motion) restarts it.
  - Bug found and fixed: with `transformOrigin` in the *to* vars, GSAP measured the origin after `scale: 0` collapsed the box, and markers landed 9–12px off their lines. It now goes in the *from* vars. A pixel diff of the final state against the static render differs only at the Replay button.
- **Scroll moments:**
  - masked line reveals on section headings and figure titles
  - covers unmask via clip-path from the top
  - Flow stages arrive left to right
  - dumbbell spans grow, then the dots land
  - before/after bars grow in sequence
  - degradation curves wipe in via clip-path (keeps the dash pattern; DrawSVG would turn the dashed line solid)
  - the experience timeline rule draws with scroll (scrub)
- **Cover video:** a styled Play/Pause toggle replaces the native controls when JS runs (WCAG 2.2.2). It pauses when off-screen, never auto-resumes after you pause it, and starts paused under reduced motion. Without JS it keeps native controls.
- **Lighthouse mobile with motion:** home 98/100/100/100 (LCP 2.3s, TBT 90ms, 223 KB); PitWall case study 99/100/100/100.
