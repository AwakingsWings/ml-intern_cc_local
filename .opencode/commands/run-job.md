---
description: Submit an HF Job with the ml-intern pre-flight checklist.
---

Submit an HF Job for: $ARGUMENTS

This command is the explicit cloud-training opt-in. Local training is the default for this project. Only proceed when the user genuinely wants HF Jobs or Hugging Face cloud compute.

Before calling `mlintern_hf_jobs`, produce this pre-flight check and fill every line:

```text
Job purpose: <training | eval | batch inference | data prep | other>
Reference implementation: <example file or arxiv ID>
Dataset format verified: <columns confirmed, or N/A>
Model verified: <Hub repo confirmed, or N/A>
push_to_hub: <True + hub_model_id, or N/A>
hardware_flavor: <from sizing table>
timeout: <value>
Trackio monitoring: <project + dashboard URL, or N/A>
Packages to install: <flash-attn, bitsandbytes, etc.>
```

Hardware sizing:

- 1-3B params: `a10g-largex2`
- 7-13B params: `a100-large`
- 30B+ params: `l40sx4` or `a100x4`
- 70B+ params: `a100x8`
- CPU-only data prep: `cpu-basic` or `cpu-upgrade`

Timeout floor: for any training job, set timeout to at least `2h`.

OpenCode permissions are configured to ask before `mlintern_hf_jobs`. Present the pre-flight check clearly so the user can approve in one read.

For batch or ablation work, submit one job first and watch initial logs before submitting the rest.

After submission, report:

- Job URL
- Trackio dashboard URL, if used
- expected output path or Hub repo
