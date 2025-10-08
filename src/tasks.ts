// src/tasks.ts
import baseConfigRaw from "./config/tasksBase.json" with { type: "json" };

export type RecordingMode =
  | { mode: "basicStop" }
  | { mode: "countDown"; maxDuration: number }
  | { mode: "delayedStop"; maxDuration: number };

export interface TaskParamDef {
  default: any;
  values?: any[];
}

export interface TaskBase {
  type: string;
  recording: RecordingMode;
  params: Record<string, TaskParamDef>;
  repeat?: number;
  illustration?: string;
}

const raw = baseConfigRaw as Record<string, any>;
export const taskBaseConfig: Record<string, TaskBase> = Object.fromEntries(
  Object.entries(raw).filter(([key]) => key !== "_meta")
);

export interface TaskInstance {
  category: string;
  type: string;
  recording: RecordingMode;
  params: Record<string, any>;
  repeat?: number;
}

/** Factory to create a task instance with overrides */
export function createTask(category: string, overrides: Record<string, any> = {}): TaskInstance {
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
    repeat: def.repeat ?? params.repeat ?? 1
  };
}

// Example usage: 
export const TASKS = [ 
  createTask("phonation", { phoneme: "a" }), 
  createTask("retelling", { fairytale: "snowWhite" }),
  createTask("reading", { topic: "seedling"})
];
