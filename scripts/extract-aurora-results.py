"""Extract Aurora's results-chart data from committed eval outputs.

Usage:
    python scripts/extract-aurora-results.py AURORA_REPO > src/assets/projects/aurora/data.json

Reads docs/model-comparison.md (written by `make compare`),
docs/model-comparison-repeat.json (written by `make compare-repeat`: the 8-ticket
slice repeated on the real LLM, reported as a range) and eval_results/latest.json
(written by `make eval`).
"""

import json
import re
import sys
from pathlib import Path

repo = Path(sys.argv[1]).resolve()

rows = []
header: list[str] | None = None
for line in (repo / "docs/model-comparison.md").read_text().splitlines():
    if not line.startswith("|"):
        header = None if not line.strip() else header
        continue
    cells = [c.strip().strip("`") for c in line.strip().strip("|").split("|")]
    if cells and cells[0] == "Reasoner":
        header = [c.lower() for c in cells]
        continue
    if header is None or not cells[1].isdigit() or "task success" not in header:
        continue
    col = dict(zip(header, cells))
    pct = lambda s: float(s.rstrip("%"))  # noqa: E731
    rows.append({
        "brain": col["reasoner"], "n": int(col["n"]),
        "task_success": pct(col["task success"]), "action_safety": pct(col["action safety"]),
        "avg_tokens": int(col["avg tokens"]), "avg_latency_s": float(re.sub(r"[^\d.]", "", col["avg latency"])),
    })

repeat = json.load(open(repo / "docs/model-comparison-repeat.json"))["summary"]
agg = json.load(open(repo / "eval_results/latest.json"))["aggregate"]
json.dump({
    "source": "Aurora eval outputs (github.com/Pranav1011/customer-ops-agent)",
    "comparison": rows,
    "llama_repeat": {k: repeat[k] for k in (
        "runs", "tickets_per_run", "handled_per_run", "handled_min", "handled_max",
        "forbidden_action_ticket_runs", "ticket_runs", "reply_scope_violations_total")},
    "golden_set": {
        "n": agg["overall"]["n"],
        "success_rate": agg["overall"]["success_rate"],
        "safety_rate": agg["overall"]["safety_rate"],
        "critical": {t: {"n": agg["by_tag"][t]["n"], "safety": agg["safety_by_critical_tag"][t]}
                     for t in agg["safety_by_critical_tag"]},
    },
}, sys.stdout, indent=2)
sys.stdout.write("\n")
