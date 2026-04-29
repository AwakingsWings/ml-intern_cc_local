---
description: Audit a Hugging Face dataset: schema, splits, sample rows, and training-method compatibility.
---

Inspect the dataset `$ARGUMENTS` using `mlintern_hf_inspect_dataset`.

Report:

- schema and column types
- rows per split
- 3 sample rows
- red flags: class imbalance, missing values, unexpected formats, duplicates
- training-method compatibility:
  - SFT-ready: `messages`, `text`, or `prompt`/`completion`
  - DPO-ready: `prompt`, `chosen`, `rejected`
  - GRPO-ready: `prompt`

Include the direct Hub URL: `https://huggingface.co/datasets/$ARGUMENTS`
