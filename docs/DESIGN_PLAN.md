# Design plan

**Concept: the run sheet.** The site reads like a well-kept engineering record: a race engineer's timing sheet crossed with an experiment log. It's a neutral drafting-paper ground with ink type, and structure comes from hairline rules and tick marks rather than boxes. Colour marks sections as well as data: Selected work sits on deep petrol, Experience on a brass tint, the close on ink, and everything else on paper. Inside a section, colour still appears only where data says something. The hero pairs the positioning with a portrait; the Aurora trace instrument now lives in its case study ("What broke", Fig. 3).

---

## 1. Palette: Petrol & Brass

These are exact hex values, given by Pranav on 2026-09-24. Contrast is measured against Ground with the WCAG 2.x relative-luminance formula.

| Name | Hex | Role | Contrast | Requirement |
|---|---|---|---|---|
| **Ground** | `#F1F2F0` | Page ground, figure plates | — | — |
| **Ink** | `#121C23` | Headings, body text | 15.38 : 1 | AA text ✓ |
| **Secondary** | `#545C63` | Secondary text, captions, axis labels, meta | 6.06 : 1 (5.56 on Tint) | AA text ✓ |
| **Rule** | `#CCD2D6` | Hairlines, ruler ticks, borders | 1.36 : 1 | Decorative only, never the sole boundary of a control |
| **Petrol** (accent) | `#00566E` | *The number that matters*: key figures, links, focus rings, the hero trace's resolved path, the reading-progress line | 7.32 : 1 (6.72 on Tint) | AA text ✓, non-text ✓ |
| **Petrol hover** | `#003F53` | Hover and active state for links and controls | 10.19 : 1 | AA text ✓ |
| **Petrol tint** | `#DBEBF2` | Text selection, highlighted table row, copied-state flash | Ink on Tint 14.13 : 1 | AA text ✓ |
| **Brass** | `#A57710` | **Chart marks only**: the comparison or failure series (baseline bar, the 25% run, a guardrail catch) | 3.56 : 1 | Non-text 3 : 1 ✓, not for text |
| **Brass text** | `#8A6000` | Brass used as a chart label or legend text | 4.98 : 1 | AA text ✓ (narrow margin; ≥ 14 px only) |

Changes from the previous draft:
- Paper 2 is gone. Figure plates sit on Ground with a Rule hairline.
- Code blocks use Petrol tint at 50% mix with Ground (`color-mix(in oklch, #DBEBF2 50%, #F1F2F0)`), which keeps Ink at more than 14 : 1.

**Why petrol:** it's drafting ink. On an engineering drawing, the working lines are graphite and the dimension that matters is inked. Petrol plays that role here. It lands only on the measured result, the link you can follow, and the path the agent actually took. It is deep and desaturated, reads as considered rather than "brand blue", and has no relation to the dark-mode neon palettes. Brass is the second pen: the reference line you're measuring against, or the thing that went wrong.

### Section colours (added 2026-09-25)

Colour now marks sections as well as data. Each section is a scheme: a page colour plus its own text, secondary, link, rule and key-figure colours (`tokens.css`). Covers and charts sit on a paper plate (`.plate`), so they keep the paper scheme on any section and never need recolouring.

| Section | Page | Text | Secondary | Links | Key figures |
|---|---|---|---|---|---|
| Hero, Research/Toolkit/Education, case studies | Paper `#F1F2F0` | Ink 15.38 | `#545C63` 6.06 | Petrol `#00566E` 7.32 | Petrol 7.32 |
| **Selected work** | Deep petrol `#003F53` | Paper 10.19 | `#A3ADB5` 5.01 | `#7CC4DC` 5.88 | **Pale brass `#E6CA91` 7.20** |
| **Experience** | **Brass tint `#F3E7CE`** | Ink 14.09 | `#545C63` 5.55 | Petrol 6.70 (hover `#003F53` 9.33) | Petrol 6.70 |
| CTA and footer | Ink `#121C23` | Paper 15.38 | `#A3ADB5` 7.57 | `#7CC4DC` 8.87 | `#7CC4DC` 8.87 |

All ratios are WCAG 2.x against that section's page colour; every text pair passes AA (4.5 : 1). Brass text `#8A6000` is 4.56 : 1 on the brass tint, so it stays in charts, which sit on paper plates. Rules on deep petrol (`#2B6072`) and the brass tint (`#DDCCA6`) are decorative hairlines only.

**How the colour changes.** Each section paints its own colour, so the next section's colour sweeps in with its top edge as you scroll: a hard edge tied 1:1 to scroll, with no blended in-between colours, and the text colours arrive with it, so every pixel stays at the AA ratios above. Reduced motion and mobile behave the same way. (A page-wide cross-fade was tried on 2026-09-25 and dropped: mid-fade, text and background passed through similar greys.)

### Colour-vision check

Simulated with Machado et al. 2009 (severity 1.0) in linear RGB. Distance is ΔE in OKLab × 100: ≥ 10 is clearly distinct, < 5 is at risk.

| Pair | Normal | Protan | Deutan | Tritan | Greyscale |
|---|---|---|---|---|---|
| Petrol vs Brass (chart series) | 26.1 | 20.7 | 26.5 | 24.1 | 17.0 |
| Petrol vs Ink (link vs body) | 21.0 | 22.3 | 20.1 | 22.0 | 20.6 |
| Brass vs Ground (mark visibility) | 37.9 | 40.6 | 37.0 | 36.8 | 36.4 |
| Brass vs Secondary (chart vs axis) | 18.7 | 16.3 | 19.4 | 17.6 | 12.6 |
| **Petrol vs Secondary** | 8.2 | **4.4** | 7.2 | 6.8 | **4.4** |

Rules that follow from the check:
1. **Petrol and Brass are a safe chart pair** under every simulated CVD and in greyscale. Charts never need a third hue.
2. **Links are always underlined in prose.** Petrol vs Ink is only 2.10 : 1 in luminance, so colour alone would fail WCAG 1.4.1. Nav links are exempt because their position identifies them, but they get an underline on hover and focus.
3. **Never separate Petrol from Secondary by hue alone.** They collapse under protanopia and in greyscale. In charts, a Secondary (grey) series always gets a second channel: dash pattern, direct label, or position. In text, the key figure is set apart by size and weight, not just colour.

## 2. Type

| Role | Face | Why |
|---|---|---|
| Display + UI | **Schibsted Grotesk** (variable 400–800) | A sharp newspaper grotesque with tabular figures. It feels exact without being a default dev font. |
| Long-form prose | **Source Serif 4** (variable, optical size) | Case studies and About read like a lab write-up, not a landing page. Home-page UI stays sans. |
| Data labels + code | **IBM Plex Mono** (400, 500) | Only inside the trace figure, chart axes and code. Never for UI labels. |

All three are self-hosted through @fontsource and subset to Latin. Only Schibsted and the Source Serif regular are preloaded; Plex Mono loads lazily with the figures. `font-display: swap` plus metric-matched fallbacks (`size-adjust`) keep CLS below 0.05.

**Fluid scale** (min 360 px → max 1440 px):

| Token | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| `--t-display` | `clamp(2.5rem, 1.6rem + 4.2vw, 5.25rem)` | 650 | −0.035em | 0.98 |
| `--t-h2` | `clamp(1.75rem, 1.35rem + 1.6vw, 2.75rem)` | 620 | −0.02em | 1.05 |
| `--t-h3` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem)` | 600 | −0.01em | 1.2 |
| `--t-readout` (key figures) | `clamp(2.25rem, 1.8rem + 2vw, 3.5rem)` | 520, `tnum` | −0.02em | 1 |
| `--t-prose` (serif) | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)` | 400 | 0 | 1.62 |
| `--t-body` (sans) | `1rem` | 420 | 0 | 1.5 |
| `--t-small` | `0.875rem` | 450 | 0.005em | 1.45 |
| `--t-data` (mono) | `0.8125rem` | 400 | 0 | 1.4 |

- Prose measure: 66ch max. UI lines: 72ch max.
- Everything is sentence case: no all-caps labels and no letter-spaced eyebrows.
- Figures use `font-variant-numeric: tabular-nums` wherever numbers stack.

## 3. Layout

- **Grid:** 12 columns, max width 1320 px, gutter `clamp(16px, 2vw, 32px)`, outer margin `clamp(20px, 5vw, 80px)`. Mobile uses 4 columns.
- **Spacing scale (4 px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- **Rhythm:**
  - Tight inside a group (8–16).
  - Clear between groups (32–48).
  - Wide between sections: `clamp(6rem, 4rem + 8vw, 12rem)`.
- **Section rule:** each section opens with a full-width hairline carrying small tick marks at the column lines, like the edge of a ruler. The h2 sits under it, left-aligned. This is the only section "decoration".
- **Alignment:** everything left-aligned. Nothing centred except the 404 message.
- **No cards:** projects are rows separated by hairlines, not boxes. No shadows anywhere.

### Wireframes

**Hero — desktop (1440)**
```
┌──────────────────────────────────────────────────────────────────────┐
│ Sai Pranav Krovvidi              Work  Experience  About  Contact  Resume │
│──────────────────────────────────────────────────────────────────────│
│                                                                      │
│  I build agents that act,                                            │
│  and measure whether they should.            (display, cols 1–9)     │
│                                                                      │
│  AI engineer. MS Data Analytics Engineering, Northeastern,           │
│  Dec 2026. Boston.                          (graphite, cols 1–6)     │
│  ● Open to full-time AI engineering roles from Jan 2027              │
│  Resume   GitHub   LinkedIn   Email                                  │
│                                                                      │
│ ┊────┊────┊────┊────┊────┊────┊────┊────┊────┊────┊────┊────┊ ruler  │
│  intake  ▪                                                           │
│  plan      ▪──▪                                                      │
│  act            ▪──▪──▪  ✕ guardrail                                 │
│  resolve                     ▪──────▪                                │
│  0s        0.1       0.2       0.3 s              (trace, cols 1–12) │
│  Aurora, ticket TCK-000004: a real agent run, drawn from its trace.  │
└──────────────────────────────────────────────────────────────────────┘
```
The first screen holds: positioning, subline, availability, four links, and the top of the trace.

**Hero — mobile (375)**
```
┌─────────────────────────┐
│ S. P. Krovvidi     Menu │
│─────────────────────────│
│ I build agents          │
│ that act, and           │
│ measure whether         │
│ they should.            │
│                         │
│ AI engineer. MS, North- │
│ eastern, Dec 2026.      │
│ ● Open to roles, Jan 27 │
│ Resume GitHub LinkedIn  │
│ Email                   │
│ ┊──┊──┊──┊──┊──┊──┊──┊  │
│ intake ▪                │
│ plan    ▪▪              │
│ act       ▪▪▪ ✕         │
│ resolve       ▪──▪      │
│ caption                 │
└─────────────────────────┘
```

**Selected work — desktop.** One row per project, separated by hairlines.
```
│──────────────────────────────────────────────────────────────────────│
│  0                  Aurora                2026    ┌─────────────────┐│
│  policy violations  An agent that resolves       │                 ││
│  in 43 scenarios    customer-ops tickets end     │  cover (video)  ││
│                     to end…                      │  clip-reveal    ││
│  (readout, 1–3)     LangGraph, FastAPI,          │                 ││
│                     Redis/RQ, Chroma…  (4–7)     └─────────────────┘│
│                     Case study   Repo                    (8–12)     │
│──────────────────────────────────────────────────────────────────────│
│  −85%               F1 Race Intelligence Agent …                    │
```
The readout column works like a timing-screen row: the figure in Petrol, with its unit and comparison right beneath it. Titles link to the case study, and the whole row is one hover target on desktop.

**Selected work — mobile**
```
│─────────────────────────│
│ Aurora            2026  │
│ ┌─────────────────────┐ │
│ │ cover               │ │
│ └─────────────────────┘ │
│ 0  policy violations    │
│    in 43 scenarios      │
│ An agent that resolves… │
│ LangGraph, FastAPI, …   │
│ Case study   Repo       │
```

**Case study — desktop**
```
│▔▔▔▔▔▔▔▔▔▔▔▔▔ reading progress (1px, petrol) ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔│
│ ← Work                                                               │
│  Aurora                                           (display, 1–10)    │
│  An agent that resolves customer-ops tickets…     (h3 sans, 1–8)     │
│──────────────────────────────────────────────────────────────────────│
│  Role     Solo — design,    │  TL;DR                                 │
│           build, evaluation │  Problem  …                            │
│  Year     2026              │  Approach …                            │
│  Stack    LangGraph …       │  Result   …                            │
│  Links    Repo              │                                        │
│  (sticky run sheet, 1–3)    │  Prose, serif, 66ch      (cols 4–10)   │
│                             │  ┌──────────────────────────────────┐  │
│                             │  │ figure breaks out to cols 4–12   │  │
│                             │  └──────────────────────────────────┘  │
│                             │  Fig. 2 — caption, graphite            │
│──────────────────────────────────────────────────────────────────────│
│  Next: F1 Race Intelligence Agent                                    │
```
On mobile the run sheet becomes a compact definition list under the title, prose runs full width, and figures run edge to edge inside the margins.

## 4. Principles

1. **Colour is data, and marks sections.** Petrol is the drafting ink: the measured result that matters, and anything you can follow. Brass is the reference line or the thing that failed, in charts only. Section colour (deep petrol, brass tint, ink) says where you are on the page; inside a section, if colour doesn't encode something, it isn't there.
2. **No number travels alone.** Every figure carries its unit and its comparison (baseline, n, or dataset), set typographically attached to it.
3. **Rules, not boxes.** Structure comes from hairlines and ruler ticks. No cards, no shadows, no rounded containers.
4. **One instrument per page.** The home page has the stacked project panels. Each case study has one primary figure; the Aurora trace is Fig. 3 of its case study. Everything else stays quiet so those carry weight.
5. **Motion is measurement, plus a few set pieces on desktop.** Charts draw along an axis, left to right, the way data arrives. Nothing bounces. From 2026-09-25, desktop (1024 px and up, motion allowed) adds: Selected work as stacking panels (each pins for about one viewport while the next slides over it; this overrides the brief's no-pinning rule on desktop only), key figures sliding in sideways with their panel, the incoming panel fully opaque (solid `#003F53`) and the outgoing one dimmed, headline lines drifting and fading past the hero, slight parallax on the hero photo, and Lenis smooth scrolling. Mobile keeps the simple reveals with no pinning; reduced motion shows everything static. Section colours always meet at a hard edge. Chart plates never appear empty: cover charts and every chart on mobile render drawn, and case-study charts on desktop start building while the plate is still 30% of a viewport below the screen.

## 5. Self-critique and revisions

| Would look the same on any dev portfolio | Revision |
|---|---|
| First instinct: IBM Plex everywhere, the standard "engineer" costume. | Plex Mono kept only for data and code. Schibsted Grotesk (display) and Source Serif 4 (prose) carry the voice. |
| Purple accent (F1 "fastest sector"): meaningful, but purple is on the AI-palette list. | **Dropped** (Pranav, 2026-09-24). Replaced with Petrol & Brass: drafting ink plus a brass reference pen. Deep, desaturated, no glow; used on fewer than 10 elements per page. |
| A big number over a small label is the "hero metric" template. | The readout is kept because the key result is the product. It carries the comparison inline, sits in a timing-row layout, and has no stat grid or gradient beside it. There is one per project, not a dashboard of four. |
| Section headings with eyebrow labels and numbers. | Removed. The ruler hairline plus a plain sentence-case h2 does the job. |
| Alternating left/right project zigzag. | Rejected as a cliché. Every row uses the same timing-sheet composition, so the eye learns it once and scans down the figures. |
| Serif body could read as "editorial blog". | Serif is limited to long prose (case studies, About). The home page is sans, so it scans like a spec sheet. |
| A hero with a generic abstract graphic. | The hero figure is a real trace from Aurora's run data, with a caption naming the ticket. Nobody else can have this graphic. |

## 6. Aurora trace instrument (static first; now Fig. 3 of the Aurora case study)

**Data source (confirmed, 2026-09-24):**
- Aurora's `data/traces/` has 59 real run traces with timestamped events of type `intent`, `plan`, `tool_call`, `guard`, `decision`, `escalation` and `reply`.
- The strongest candidate is ticket TCK-000004 on Llama 3.1 8B:
  - `88ced744d9d1.json`: 24 events, the runaway `get_order` loop
  - `6f491c4bd4a0.json`: 11 events, the same ticket after the loop-breaker
- Drawing the loop and then the guard catching it tells the positioning line in one figure.
- Only event types, tool names and relative timings are rendered. The traces contain synthetic (Faker) customer records, which never reach the site.

The wireframe timings above are illustrative. The real axis comes from the trace timestamps.

The trace ships in Phase 2–3 as a static, server-rendered SVG, fully visible without JS. Phase 4 animates it (paths drawing along the time axis) once you've picked from the three options in the plan. The layout reserves the same region for any of the three, so choosing one later changes no structure.
