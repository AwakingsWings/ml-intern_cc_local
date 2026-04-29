export const MLInternEnv = async () => {
  return {
    "shell.env": async (_input, output) => {
      output.env.ML_INTERN_LOCAL_MODE = output.env.ML_INTERN_LOCAL_MODE || "1"
      output.env.ML_INTERN_CONFIRM_CPU_JOBS = output.env.ML_INTERN_CONFIRM_CPU_JOBS || "1"
      output.env.ML_INTERN_YOLO = output.env.ML_INTERN_YOLO || "0"
      output.env.ML_INTERN_SAVE_SESSIONS = output.env.ML_INTERN_SAVE_SESSIONS || "0"
      output.env.ML_INTERN_SESSION_REPO = output.env.ML_INTERN_SESSION_REPO || "smolagents/ml-intern-sessions"
    },
  }
}
