---
title: PitWall
headline: What does a worn F1 tyre actually cost?
slug: pitwall
order: 3
featured: true
year: 2026
role: Solo — data, modelling, simulation
summary: A tyre-degradation model and Monte Carlo pit-strategy simulator built on three seasons of real F1 data, 23.4% more accurate than a circuit-aware baseline.
problem: Lap time is mostly fuel and circuit, not tyre wear. Choosing a pit strategy needs the tyre effect isolated first, then tested against what teams actually did.
mechanisms:
  - label: Clean data
    detail: 10 separately tested exclusion rules take 74,601 raw laps to 53,854 clean ones.
  - label: Mixed-effects model
    detail: Strips out fuel, circuit, season and driver, leaving a wear curve per compound.
  - label: Monte Carlo strategy
    detail: 2,000 simulated races per plan, backtested against 59 real ones.
result: 1.31 s/lap out-of-sample error vs 1.71 for a baseline that already knows the circuit, 23.4% better, validated leave-one-race-out across 21 circuits.
metric:
  value: "−23.4%"
  label: lap-time error vs baseline
stack: [Python, statsmodels, FastF1, pandas, NumPy, Matplotlib]
links:
  repo: https://github.com/Pranav1011/pitwall
cover:
  src: ../../assets/projects/pitwall/cover.png
  alt: Tyre degradation curves for soft, medium and hard compounds, showing lap-time loss rising with tyre age
  kind: image
status: complete
---

<!-- src (frontmatter): pitwall/README.md Tier 2 table; results/model_metrics.json -->

## TL;DR

- **Problem:** estimate how each F1 tyre compound degrades once fuel and circuit effects are removed, then use that to pick pit strategies.
- **Approach:** a mixed-effects degradation model on 53,854 clean laps, feeding a Monte Carlo simulator backtested against 59 real races.
- **Result:** 1.31 s/lap out-of-sample error, 23.4% better than a baseline that already knows the circuit, and better on every compound.

## The problem

Watch a lap-time chart and tyre wear is almost invisible. As the car burns fuel it gets lighter and faster, the track rubbers in, and every circuit has its own pace. Degradation is a small signal under much bigger ones. Pit strategy depends on getting it right, because the whole decision is a trade: the time lost in the pit lane against the time lost on worn tyres.

## Approach

**Data.** Three full seasons (2022–2024), 68 races, pulled from FastF1 with resumable, rate-limit-aware ingestion and zero failures. Ten separately tested exclusion rules remove what would contaminate the signal: pit in and out laps, safety-car laps, mixed-condition races, outlier laps and short stints. That takes 74,601 raw laps down to 53,854 clean laps across 2,824 stints.

<!-- src: README Data, Tier 1 table; results/tier1_summary.json; results/exclusion_table.csv -->

**Model.** A `statsmodels` MixedLM strips out everything that isn't tyre wear:

- circuit, via centring on the per-circuit mean
- fuel burn and track evolution, via race progress
- the season-to-season car and regulation step, as a fixed effect
- driver, as a random intercept per driver-season
- tyre wear, as its own linear and quadratic curve per compound

It converged on the full data and on every cross-validation fold.

<!-- src: README Tier 2 -->

**A fair baseline.** Beating a model that doesn't know which track it's at is easy; that naive baseline scores 9.06 s/lap. So I compared against a per-circuit, per-compound regression that already knows the track and gets its own degradation slope. Beating that isolates what the full model actually adds.

**Validation.** Leave-one-race-out across the 21 circuits with cross-season data, so the held-out race is never seen in training.

<!-- src: README Tier 2 "Baseline", "Validation" -->

**Strategy simulator.** For a given race and stint plan, the simulator adds up the degradation cost and draws the random parts from real data: pit-lane loss from each circuit's actual in and out laps, safety-car probability and timing from each circuit's history, and lap-time noise from the model's residuals. It runs 2,000 simulations per plan across one- and two-stop strategies and returns the fastest expected plan with its P5–P95 band.

<!-- src: README Tier 3 -->

## Results

| Out-of-sample error (s/lap) | Model | Circuit-aware baseline |
|---|---|---|
| All compounds | **1.31** | 1.71 |
| Soft | 1.91 | 2.48 |
| Medium | 1.35 | 1.68 |
| Hard | 1.14 | 1.55 |

<!-- src: README Tier 2 table; results/model_metrics.json -->

**Backtest against the field (59 races).** The simulator never sees the real pit laps. It picks the same number of stops as the teams about half the time (49.2%). Its pit laps land on average 7.4 laps later than the teams', and that gap is the interesting result. The simulator finds the pace-optimal window, while real teams pit earlier to undercut rivals and protect track position. The expected-time curve around the optimum is shallow, a few seconds across a wide window, so in practice track position decides the lap.

<!-- src: README "Backtest vs the field"; results/backtest.json -->

## What's next

The biggest gap is an undercut and track-position model, which would close most of the 7.4-lap offset. After that: a traffic model, and per-driver degradation slopes instead of one curve per compound.

<!-- src: README Limitations -->
