// src/tasks.ts
import tasksBaseRaw from "./config/tasksBase.json" with { type: "json" };

export type RecordingMode =
  | { mode: "basicStop" }
  | { mode: "countDown"; maxDuration: number }
  | { mode: "delayedStop"; maxDuration: number };

export interface TaskParamDef {
  default: any;
  values?: any[];
}

export interface TaskDef {
  type: string;
  recording: RecordingMode;
  params: Record<string, TaskParamDef>;
}

type TaskBase = {
  type: string;
  recording: { mode: string; maxDuration?: number };
  params: Record<string, { default?: any; values?: any[] }>;
};

// treat imported JSON as unknown, strip _meta, then cast
const _raw = tasksBaseRaw as unknown as Record<string, any>;
const { _meta, ..._rest } = _raw;
export const taskBaseConfig = _rest as Record<string, TaskBase>;

export interface Task {
  category: string;
  type: string;
  recording: RecordingMode;
  params: Record<string, any>;
  repeat?: number;
}

/** Create a task instance with optional overrides */
export function createTask(category: string, overrides: Record<string, any> = {}): Task {
  const def = taskBaseConfig[category];
  if (!def) throw new Error(`Unknown task category: ${category}`);

  const params = Object.fromEntries(
    Object.entries(def.params).map(([k, v]) => [k, overrides[k] ?? v.default])
  );

  return {
    category,
    type: def.type,
    recording: def.recording,
    params,
    repeat: params.repeat ?? 1
  };
}

// Example usage:
export const TASKS = [
  createTask("phonation", { phoneme: "a" }),
  createTask("retelling", { fairytale: "snowWhite" })
];
