"""Extract Aurora's results-chart data from committed eval outputs.

Usage:
    python scripts/extract-aurora-results.py AURORA_REPO > src/assets/projects/aurora/data.json

Reads docs/model-comparison.md (written by `make compare`) and
eval_results/latest.json (written by `make eval`).
"""

import json
import re
import sys
from pathlib import Path

repo = Path(sys.argv[1]).resolve()

rows = []
for line in (repo / "docs/model-comparison.md").read_text().splitlines():
    cells = [c.strip().strip("`") for c in line.strip().strip("|").split("|")]
    if len(cells) == 7 and cells[1].isdigit():
        pct = lambda s: float(s.rstrip("%"))  # noqa: E731
        rows.append({
            "brain": cells[0], "n": int(cells[1]),
            "task_success": pct(cells[2]), "action_safety": pct(cells[3]),
            "avg_tokens": int(cells[4]), "avg_latency_s": float(re.sub(r"[^\d.]", "", cells[6])),
        })

agg = json.load(open(repo / "eval_results/latest.json"))["aggregate"]
json.dump({
    "source": "Aurora eval outputs (github.com/Pranav1011/customer-ops-agent)",
    "comparison": rows,
    "golden_set": {
        "n": agg["overall"]["n"],
        "success_rate": agg["overall"]["success_rate"],
        "safety_rate": agg["overall"]["safety_rate"],
        "critical": {t: {"n": agg["by_tag"][t]["n"], "safety": agg["safety_by_critical_tag"][t]}
                     for t in agg["safety_by_critical_tag"]},
    },
}, sys.stdout, indent=2)
sys.stdout.write("\n")
