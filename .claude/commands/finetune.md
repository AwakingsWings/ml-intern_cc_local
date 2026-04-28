---
description: Fine-tune a model on a dataset, end-to-end (research → validate → train locally).
argument-hint: <natural language task, e.g. "llama-3-8b on HuggingFaceH4/ultrachat_200k">
---

Fine-tune the model described in: $ARGUMENTS

**Default mode: local training on the user's GPU.** Only switch to HF Jobs if the user explicitly asks ("submit to HF Jobs", "run on the cloud", etc.) — see step 5b.

Fine-tuning is never trivial. Follow this sequence in order. Do **not** skip steps even if the request looks simple — `CLAUDE.md` lists the specific failures that happen when you do.

**1. Research first (mandatory).** Delegate to the `research` subagent via the Task tool with `subagent_type: "research"`. Brief it:

> Find the best fine-tuning recipe for: $ARGUMENTS.
> Identify the model architecture and intended task. Crawl the citation graph for recent papers that fine-tuned this (or a comparable) model on this (or a comparable) dataset. Read methodology sections (3, 4, 5) of the top 3 candidates. Extract: training method (SFT/DPO/GRPO/...), exact hyperparameters (lr, schedule, epochs, batch size, optimizer, max_length), and any data preprocessing. Verify the dataset's HF Hub format with `hf_inspect_dataset`. Return a ranked recipe table per CLAUDE.md.

Do not start writing code until the subagent returns.

**2. Validate dataset, model, and local hardware.**
- `mcp__ml-intern-tools__hf_inspect_dataset` on the target dataset — confirm columns match the chosen training method (SFT: `messages`/`text`/`prompt`+`completion`; DPO: `prompt`+`chosen`+`rejected`; GRPO: `prompt`).
- `mcp__ml-intern-tools__hf_repo_files` on the target model — confirm it exists and note tokenizer/architecture.
- `nvidia-smi` (via `Bash`) — record GPU model and total VRAM. Use this to size `per_device_train_batch_size`, `max_length`, and decide if the model+config fits.

**3. Write the training script locally.** Create `./outputs/<run_name>/train.py` (or `./train.py` for one-off runs). Use the recipe from step 1; size for the GPU from step 2. Required logging settings: `disable_tqdm=True, logging_strategy="steps", logging_first_step=True`. Set `output_dir=./outputs/<run_name>/`.

**4. Smoke test (mandatory before full run).** Run `python train.py --max-steps 5` (or set `max_steps=5` in config). Confirm:
- Imports load (no `ModuleNotFoundError`, no API mismatches with the installed library versions).
- Dataset reads and the first batch is shaped as expected.
- Two or three training steps complete with plain-text loss values printed.

If the smoke test errors, fix it. Do not advance to step 5.

**5a. Pre-flight (local, default).** Print this checklist and verify every line:

```
Reference implementation: <path or arxiv ID from research>
Dataset format verified:  <columns confirmed via hf_inspect_dataset>
Training method:          <SFT | DPO | GRPO | ...>
Hyperparameters:          <lr, schedule, epochs, batch size, max_length>
Local GPU:                <nvidia-smi: model, total VRAM>
Output dir:               ./outputs/<run_name>/
push_to_hub:              <False (local), or True + hub_model_id if user asked>
disable_tqdm=True, logging_strategy="steps", logging_first_step=True: yes
Smoke test passed:        yes
```

Then launch: `python train.py` via the `Bash` tool. Stream stdout — don't background unless the user asks. Watch for plain-text loss progressing.

**5b. Pre-flight (HF Jobs, opt-in).** Only if the user explicitly asked for cloud training. See "Cloud training (HF Jobs, opt-in)" in `CLAUDE.md` for the full HF Jobs pre-flight checklist (`push_to_hub=True`, `hub_model_id`, `hardware_flavor`, `timeout >= 2h`, Trackio). Then call `mcp__ml-intern-tools__hf_jobs` with the verified config; watch the first 60s of logs.

**6. Report.** Provide:
- Local mode: path to the saved model under `./outputs/<run_name>/`, final loss / eval metrics, training time.
- HF Jobs mode: Job URL, Trackio dashboard URL, Hub URL of the model that will appear on completion.

If anything fails, do not silently switch training methods, reduce `max_length`, or substitute datasets. Diagnose, fix the minimal thing, or ask the user.
