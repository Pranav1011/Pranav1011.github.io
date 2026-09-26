---
title: Recommend
headline: A movie recommender that answers in under 100 ms
domain: Recommendations
slug: recommend
order: 99
featured: false
year: 2025
role: Solo — modelling, serving, front end
summary: A production movie recommender on MovieLens 25M that serves personalized picks in under 100 ms through Qdrant vector search.
problem: Recommending from 25 million ratings needs models that learn taste from sparse data, and serving that stays fast when every request is a similarity search.
mechanisms:
  - label: Two-tower model
    detail: User and item towers share a 128-dimensional embedding space, trained with BPR loss.
  - label: LightGCN
    detail: Graph propagation over the rating graph, kept over a hybrid ensemble after offline evaluation.
  - label: Vector serving
    detail: Qdrant HNSW search behind FastAPI with Redis caching.
result: Sub-100 ms recommendations over 25M+ interactions and 162K users.
stack: [PyTorch, Qdrant, FastAPI, Redis, PySpark, Next.js]
links:
  repo: https://github.com/Pranav1011/Recommendation-System
  demo: https://recommendation-system-henna.vercel.app/
cover:
  src: ../../assets/projects/recommend/cover.png
  alt: Recommend web app showing a grid of movie posters with genre filters and personalized picks
  kind: image
status: complete
---

<!-- src (frontmatter): Recommendation-System/README.md intro ("25M+ user-item interactions … sub-100ms") -->
<!-- src: 162K users — configs/experiments/train_config_*.json "n_users": 162541 -->
<!-- src: live demo — README "Live Demo", HTTP 200 on 2026-09-24 -->

## TL;DR

- **Problem:** personalized recommendations from 25 million sparse ratings, served fast enough to feel instant.
- **Approach:** a two-tower neural model and a LightGCN graph model trained on MovieLens 25M, with embeddings served from Qdrant behind a cached FastAPI service.
- **Result:** sub-100 ms recommendations over 25M+ interactions and 162K users, live in a Next.js front end.

## The problem

MovieLens 25M has 25 million ratings from 162,541 users across 59,047 movies in the processed set. Most users have rated a tiny fraction of the catalogue, so the model has to infer taste from very little signal. Then the serving side has to turn that model into answers fast. A recommendation request is a nearest-neighbour search over the whole catalogue, and it has to come back before the page feels slow.

<!-- src: configs n_users 162541, n_movies 59047; README "Download MovieLens 25M" -->

## Approach

**Data.** I processed the full 25M-rating dataset with PySpark into user and item features and train/test splits, tracked in MLflow.

<!-- src: README Features ("PySpark/Dask for 25M+ ratings", "MLflow experiment tracking") -->

**Two-tower model.** A user tower and an item tower each map into a shared 128-dimensional embedding space, trained in PyTorch with a BPR ranking loss. I ran training experiments on H100 and H200 GPUs, testing hard-negative sampling against in-batch negatives.

<!-- src: README "Two-Tower Neural Network: 128-dimensional embeddings"; configs/experiments/train_config_bpr*.json, train_config_h100_hard_negatives.json, train_config_h200_run3_inbatch.json -->

**LightGCN.** Ratings are also a graph: users connect to the movies they rated. LightGCN propagates embeddings across that graph, so a user's representation absorbs signal from similar users' histories. This helps most for users with thin rating histories.

**Choosing the model.** I also built a hybrid ensemble that blended both models and evaluated it offline against LightGCN on its own. LightGCN won, so I kept the single model. A more complex system has to earn its place with better numbers, and this one didn't.

<!-- src: Docs/architecture/ENSEMBLE_EVALUATION_RESULTS.md, ENSEMBLE_EXECUTIVE_SUMMARY.md (decision only; no metrics quoted on site) -->

**Serving.** Item embeddings live in a Qdrant collection with HNSW indexing, so a recommendation is one vector search. A FastAPI service wraps it with Redis caching for hot users, and Prometheus and Grafana track latency and cache behaviour. The whole stack runs in Docker, with CI on every push.

<!-- src: README Features (Qdrant, FastAPI + Redis, Prometheus + Grafana, CI/CD) -->

**Hardening.** A recommender that only works in a notebook isn't a product. I took test coverage from 31% to 88% over two passes, fixing five failing tests and tightening the API's input handling and error paths along the way. Separate CI and CD workflows run linting, import ordering and the full suite on every push, and build the service image.

<!-- src: git log 2a45e59 ("coverage from 31% to 63%"), 02742d0 ("resolve 5 failing tests and improve API robustness"), 1993a20 ("65% to 88%"), e42a604 (isort in CI); .github/workflows/ci.yml, cd.yml -->

**Front end.** A Next.js app on Vercel lets you browse and filter movies, rate a few, and get recommendations and similar titles back.

<!-- src: README "Live Demo" -->

## Results

- Sub-100 ms recommendations from Qdrant vector search over the MovieLens 25M catalogue
- 25M+ interactions and 162K users processed end to end
- Test coverage raised from 31% to 88%
- Live demo on Vercel

<!-- src: README intro (sub-100ms); git log 2a45e59, 1993a20 (coverage 31→63→88%) -->

## What I'd do next

Load-test the API at realistic concurrency and publish p50 and p95 latency under load, not just single-request timings. Then add a re-ranking stage on top of retrieval, which is where freshness, diversity and business rules usually live in production recommenders.
