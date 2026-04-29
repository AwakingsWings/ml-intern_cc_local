---
description: Fine-tune a model on a dataset end-to-end: research, validate, smoke test, then train locally.
---

Fine-tune the model described in: $ARGUMENTS

Default mode is local training on the user's GPU. Only switch to HF Jobs if the user explicitly asks for cloud training.

Follow this sequence in order:

1. Research first. Use the `research` subagent with this brief:

   Find the best fine-tuning recipe for: $ARGUMENTS.
   Identify the model architecture and intended task. Crawl citation graphs for recent papers that fine-tuned this or a comparable model on this or a comparable dataset. Read methodology, experiments, and results sections of the top candidates. Extract training method, exact hyperparameters, data preprocessing, and reported results. Verify the dataset's HF Hub format with `mlintern_hf_inspect_dataset`. Return a ranked recipe table per `AGENTS.md`.

2. Validate dataset, model, and local hardware.

   - Use `mlintern_hf_inspect_dataset` on the target dataset.
   - Use `mlintern_hf_repo_files` on the target model.
   - Run `nvidia-smi` and record GPU model and total VRAM.

3. Write the training script locally under `./outputs/<run_name>/train.py` or `./train.py` for one-off runs.

   Required logging settings: `disable_tqdm=True`, `logging_strategy="steps"`, `logging_first_step=True`.

4. Smoke test before a full run.

   Run `python train.py --max-steps 5` or an equivalent tiny run. Confirm imports load, the dataset reads, and a few training steps complete with plain-text loss values.

5. Print the local pre-flight checklist:

```text
Reference implementation: <path, URL, or arxiv ID from research>
Dataset format verified: <columns confirmed>
Training method: <SFT | DPO | GRPO | other>
Hyperparameters: <lr, schedule, epochs, batch size, max_length>
Local GPU: <nvidia-smi model + total VRAM>
Output dir: ./outputs/<run_name>/
push_to_hub: <False, or True + hub_model_id if user asked>
disable_tqdm=True, logging_strategy="steps", logging_first_step=True: yes
Smoke test passed: yes
```

Then launch the full local run and stream stdout. Do not background unless the user asks.

If the user explicitly asks for HF Jobs, use `/run-job` instead of silently switching paths.
