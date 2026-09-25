"""Copy F1 RIA's tool-consolidation measurement into the site's data folder.

Usage:
    python scripts/extract-f1-consolidation.py F1_RIA_REPO > src/assets/projects/f1-ria/data.json

Source: backend/eval/results/consolidation.json, written by
backend/eval/measure_consolidation.py (LangChain convert_to_openai_tool + tiktoken).
"""

import json
import sys
from pathlib import Path

repo = Path(sys.argv[1]).resolve()
m = json.load(open(repo / "backend/eval/results/consolidation.json"))
json.dump({
    "source": "F1 RIA consolidation measurement (github.com/Pranav1011/F1-Race-Intelligence-Agent)",
    "method": m["method"],
    "tools": {"before": m["before"]["tools"], "after": m["after"]["tools"]},
    "schema_tokens": {"before": m["before"]["schema_tokens"], "after": m["after"]["schema_tokens"]},
    "reduction_pct": {"tools": m["tools_reduction_pct"], "tokens": m["token_reduction_pct"]},
}, sys.stdout, indent=2)
sys.stdout.write("\n")
