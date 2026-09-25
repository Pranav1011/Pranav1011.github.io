"""Extract the hero figure's data from two real Aurora run traces.

Usage:
    python scripts/extract-aurora-trace.py BEFORE.json AFTER.json > src/data/aurora-trace.json

BEFORE/AFTER are Aurora `data/traces/<run_id>.json` files for the same ticket, run
before and after the loop-breaker guard was added. Only event types, tool names,
guard decisions and relative timings are kept; customer records are dropped.
"""

import json
import sys
from datetime import datetime

PHASE = {"intent": "intake", "plan": "plan", "decision": "act", "tool_call": "act",
         "guard": "act", "escalation": "resolve", "reply": "resolve"}


def extract(path: str) -> dict:
    with open(path) as f:
        run = json.load(f)
    events = run["events"]
    t0 = datetime.fromisoformat(events[0]["ts"])
    out = []
    for e in events:
        if e["type"] not in PHASE:
            continue
        item = {
            "t": round((datetime.fromisoformat(e["ts"]) - t0).total_seconds(), 2),
            "type": e["type"],
            "phase": PHASE[e["type"]],
        }
        if e.get("tool") and e["type"] == "tool_call":
            item["tool"] = e["tool"]
        if e["type"] == "guard":
            item["decision"] = e.get("decision")
            item["reason"] = e.get("reason")
        out.append(item)
    models = sorted({u["model"] for u in run.get("usage", [])})
    return {"run_id": run["run_id"], "ticket_id": run["ticket_id"], "intent": run["intent"],
            "status": run["status"], "models": models, "events": out}


if __name__ == "__main__":
    before, after = sys.argv[1], sys.argv[2]
    json.dump({"source": "Aurora run traces (github.com/Pranav1011/customer-ops-agent)",
               "before": extract(before), "after": extract(after)}, sys.stdout, indent=2)
    sys.stdout.write("\n")
