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
