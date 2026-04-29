---
description: Force a literature-first research crawl with the research subagent.
agent: research
---

Literature crawl for: $ARGUMENTS

Start from anchor paper(s). Crawl citation graphs for recent downstream papers. Read methodology, experiments, and results sections. Extract exact datasets, training methods, hyperparameters, and the results they produced. Attribute every finding to a specific paper/result.

Also find working code examples using current TRL, Transformers, Datasets, PEFT, or other relevant APIs. Validate any datasets via `mlintern_hf_inspect_dataset`.

Return the ranked recipe table described in `AGENTS.md`.
