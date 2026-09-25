---
items:
  - title: Tessera
    line: CAD geometry validation and slice-based evaluation; typed validation quarantined 25.2% of a 290-model ABC-dataset sample, with 3.14× faster parallel ingestion.
    repo: https://github.com/Pranav1011/tessera
  - title: Recommend
    line: A two-tower and LightGCN movie recommender on MovieLens 25M, serving recommendations in under 100 ms from Qdrant.
    repo: https://github.com/Pranav1011/Recommendation-System
    demo: https://recommendation-system-henna.vercel.app/
---

<!-- src: Tessera — results/abc_metrics.json (290 models after dedupe, 73 quarantined = 25.2%; 5,504 → 17,263 models/hr = 3.14×). "9-rule" dropped: self-intersection only runs on meshes ≤ 10K faces (README Limitations), so not all 9 rules ran on most of the sample. -->
<!-- src: Recommend — README intro (25M, sub-100ms) -->
