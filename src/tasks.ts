// src/tasks.ts
import { taskBaseConfig, type RecordingMode } from "./config/tasksBase.js"

export interface TaskInstance {
  category: string;
  type: string;
  recording: RecordingMode;
  params: Record<string, any>;
  repeat?: number;
  illustration?: string;
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
  createTask("phonation", { phoneme: "a", maxDuration: 3}), 
  createTask("retelling", { fairytale: "snowWhite" }),
  createTask("reading", { topic: "dog"}),
  createTask("monologue", { topic: "any"}),
  createTask("syllableRepeating", { syllable: "ta", repeat: 2, maxDuration: 7})
];
