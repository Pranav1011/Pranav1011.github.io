"""Extract PitWall chart data from the repo's committed model outputs.

Usage (run inside the PitWall environment so its model class can be unpickled):
    uv run --project PITWALL_REPO python scripts/extract-pitwall.py PITWALL_REPO \
        > src/assets/projects/pitwall/data.json

Reads results/model_full.pkl (fixed effects), results/model_metrics.json (CV error),
results/backtest.json, and data/laps_clean.parquet (per-compound stint caps).
"""

import json
import pickle
import sys
from pathlib import Path

repo = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(repo / "src"))

import pandas as pd  # noqa: E402
from pitwall.simulate import stint_caps  # noqa: E402

model = pickle.load(open(repo / "results/model_full.pkl", "rb"))
fe = dict(zip(model.columns, map(float, model.fe_params)))
caps = {k: int(v) for k, v in stint_caps(pd.read_parquet(repo / "data/laps_clean.parquet")).items()}

curves = {}
for c in ("SOFT", "MEDIUM", "HARD"):
    b1, b2 = fe[f"tl_{c}"], fe[f"tl2_{c}"]
    # Lap-time loss relative to a fresh tyre: b1·(L−1) + b2·(L²−1)
    curves[c] = [{"age": age, "loss": round(b1 * (age - 1) + b2 * (age**2 - 1), 4)}
                 for age in range(1, caps[c] + 1)]

metrics = json.load(open(repo / "results/model_metrics.json"))
backtest = json.load(open(repo / "results/backtest.json"))
summary = backtest.get("summary", backtest)

json.dump({
    "source": "PitWall committed outputs (github.com/Pranav1011/pitwall/results)",
    "caps": caps,
    "coefficients": {c: {"linear": fe[f"tl_{c}"], "quadratic": fe[f"tl2_{c}"]} for c in curves},
    "curves": curves,
    "mae": {k: metrics[k] for k in metrics if "mae" in k.lower()},
    "cv": {"scheme": metrics.get("cv_scheme"), "races_scored": metrics.get("cv_races_scored"),
           "laps": metrics.get("laps")},
    "backtest": {k: summary[k] for k in summary if not isinstance(summary[k], (list, dict))},
}, sys.stdout, indent=2)
sys.stdout.write("\n")
