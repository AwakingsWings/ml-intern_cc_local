# OpenCode project mode

This branch ports the Claude Code project-mode setup to OpenCode without changing OpenCode itself.

## What is wired

- `opencode.jsonc` starts the local ml-intern MCP server as `mlintern`.
- `AGENTS.md` is the OpenCode-native instruction file.
- `.opencode/agents/research.md` replaces `.claude/agents/research.md`.
- `.opencode/commands/*.md` replaces `.claude/commands/*.md`.
- `.opencode/plugins/ml-intern-env.js` injects ml-intern defaults into shell sessions.

The original Claude Code files are kept for reference and for users who still run Claude Code.

## Required environment

Install `uv` and make sure it is available on `PATH`; `opencode.jsonc` starts
the local MCP server with `uv run --project . python -m packages.mcp_server.server`.

Set tokens before starting OpenCode if you need private Hub/GitHub access:

```sh
export HF_TOKEN=...
export GITHUB_TOKEN=...
```

On PowerShell:

```powershell
$env:HF_TOKEN = "..."
$env:GITHUB_TOKEN = "..."
```

`ML_INTERN_LOCAL_MODE` defaults to `1`. `ML_INTERN_CONFIRM_CPU_JOBS` defaults to `1`. `ML_INTERN_YOLO` defaults to `0`.

## Tool names

Claude Code used names like:

```text
mcp__ml-intern-tools__hf_inspect_dataset
```

OpenCode uses the MCP server key as a prefix. This project config uses `mlintern`, so prompts should refer to:

```text
mlintern_hf_inspect_dataset
mlintern_hf_papers
mlintern_hf_jobs
mlintern_hf_repo_files
mlintern_github_read_file
```

## Commands

OpenCode commands live under `.opencode/commands/`:

- `/ml-intern <task>`
- `/research <topic>`
- `/inspect-dataset <dataset-id>`
- `/finetune <task>`
- `/run-job <job description>`

## Safety model

Claude Code used Python hooks under `.claude/hooks/` for content-aware approval. OpenCode does not run those hooks. This branch uses conservative OpenCode permissions instead:

- local shell and edits ask by default
- `mlintern_hf_jobs` asks
- `mlintern_sandbox_create` is denied in local mode
- Hub repo write/delete helpers ask

This is intentionally stricter than the Claude hook because OpenCode static permissions cannot distinguish all job payload details, such as CPU versus GPU jobs.
