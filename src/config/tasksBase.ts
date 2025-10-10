// src/config/tasksBase.ts

export type RecordingMode =
  | { mode: "basicStop" }
  | { mode: "countDown"; maxDuration: number }
  | { mode: "delayedStop"; maxDuration: number };

export interface TaskParamDef {
  default: any;
  // ⚠️ `values` now optional because they’ll be dynamically extracted from translations
  values?: string[];
}

export interface TaskBase {
  type: "voice" | "camera" | "motoric";
  recording: RecordingMode;
  params: Record<string, TaskParamDef>;
  repeat?: number;
  illustration?: string;
}

// Define all base tasks here (typed)
export const taskBaseConfig: Record<string, TaskBase> = {
  phonation: {
    type: "voice",
    recording: { mode: "delayedStop", maxDuration: 5 },
    params: {
      phoneme: { default: "a" },
      repeat: { default: 1 },
      maxDuration: { default: 5 },
    },
  },

  syllableRepeating: {
    type: "voice",
    recording: { mode: "countDown", maxDuration: 5 },
    params: {
      syllable: { default: "pataka" },
      repeat: { default: 1 },
      maxDuration: { default: 3 },
    },
  },

  retelling: {
    type: "voice",
    recording: { mode: "basicStop"},
    params: {
      fairytale: { default: "snowWhite" },
      repeat: { default: 1 },
    },
  },

  reading: {
    type: "voice",
    recording: { mode: "basicStop" },
    params: {
      topic: { default: "seedling" },
      repeat: { default: 1 },
    },
  },

  monologue: {
    type: "voice",
    recording: { mode: "basicStop" },
    params: {
      topic: { default: "hobbies" },
      repeat: { default: 1 },
    },
  },
};
