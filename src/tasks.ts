// src/tasks.ts

// Recording modes
export type RecordingMode =
  | { mode: "basicStop"; maxDuration?: never }
  | { mode: "countDown"; maxDuration: number }
  | { mode: "delayedStop"; maxDuration: number };

// Mapping of category -> type
type CategoryToType = {
    phonation: "voice";
    syllableRepeating: "voice";
    retelling: "voice";
    reading: "voice";
    monologue: "voice";
    // later: motor tasks, camera tasks, etc
  };
  
// Helper: given a category, infer its type
type TypeForCategory<C extends keyof CategoryToType> = CategoryToType[C];


// === Base Task ===
export interface BaseTask<C extends keyof CategoryToType> {
    type: TypeForCategory<C>;
    category: C;
    titleKey: string;
    subtitleKey: string;
    subtitleActiveKey?: string;
    translationParams?: Record<string, any>;
    illustration?: string;
    repeat?: number;
    recording: RecordingMode;
}
  

// === Specialized Tasks ===
export interface PhonationTask extends BaseTask<"phonation"> {
  phoneme: string;
  recording: Extract<RecordingMode, { mode: "delayedStop" }>;
}

export interface SyllableRepeatingTask extends BaseTask<"syllableRepeating"> {
  syllable: string;
  recording: Extract<RecordingMode, { mode: "countDown" }>;
}

export interface RetellingTask extends BaseTask<"retelling"> {
  fairytale: string;
  recording: Extract<RecordingMode, { mode: "basicStop" }>;
}

export interface ReadingTask extends BaseTask<"reading"> {
  reading: string;
  recording: Extract<RecordingMode, { mode: "basicStop" }>;
}

export interface MonologueTask extends BaseTask<"monologue"> {
  category: "monologue";
  topic: string;
  recording: Extract<RecordingMode, { mode: "basicStop" }>;
}

export type Task =
  | PhonationTask
  | SyllableRepeatingTask
  | RetellingTask
  | ReadingTask
  | MonologueTask;

//
// === Specialized Factories ===
//

// 1. Phonation
export function phonationTask(
  overrides: Partial<Pick<PhonationTask, "phoneme" | "repeat" | "illustration" >> & { maxDuration?: number } = {}
): PhonationTask {
  const phoneme = overrides.phoneme ?? "aaa";
  const maxDuration = overrides.maxDuration ?? 10;
  const repeat = overrides.repeat ?? 2;

  return {
    type: "voice",
    category: "phonation",
    titleKey: "tasks.phonation.title",
    subtitleKey: "tasks.phonation.subtitle",
    translationParams: { phoneme, duration: maxDuration },
    phoneme,
    recording: { mode: "delayedStop", maxDuration },
    repeat,
    ...overrides,
  };
}

// 2. Syllable repeating
export function syllableRepeatingTask(
  overrides: Partial<Pick<SyllableRepeatingTask, "syllable" | "repeat" | "illustration" >> & { maxDuration?: number } = {}
): SyllableRepeatingTask {
  const syllable = overrides.syllable ?? "pa-ta-ka";
  const maxDuration = overrides.maxDuration ?? 10;
  const repeat = overrides.repeat ?? 2;

  return {
    type: "voice",
    category: "syllableRepeating",
    titleKey: "tasks.syllableRepeating.title",
    subtitleKey: "tasks.syllableRepeating.subtitle",
    translationParams: { syllable, duration: maxDuration },
    syllable,
    recording: { mode: "countDown", maxDuration },
    repeat,
    ...overrides,
  };
}

// 3. Retelling
export function retellingTask(
  overrides: Partial<Pick<RetellingTask, "fairytale" | "repeat" | "illustration">> = {}
): RetellingTask {
  const fairytale = overrides.fairytale ?? "Snow White";
  const repeat = overrides.repeat ?? 1;

  return {
    type: "voice",
    category: "retelling",
    titleKey: "tasks.retelling.title",
    subtitleKey: "tasks.retelling.subtitle",
    translationParams: { fairytale },
    fairytale,
    recording: { mode: "basicStop" },
    repeat,
    ...overrides,
  };
}

// 4. Reading
export function readingTask(
  overrides: Partial<Pick<ReadingTask, "reading" | "repeat" | "illustration">> = {}
): ReadingTask {
  const reading = overrides.reading ?? "Seedling";
  const repeat = overrides.repeat ?? 1;

  return {
    type: "voice",
    category: "reading",
    titleKey: "tasks.reading.title",
    subtitleKey: "tasks.reading.subtitle",
    subtitleActiveKey: "tasks.reading.subtitleActive",
    translationParams: { textTitle: reading, textActive: reading },
    reading,
    recording: { mode: "basicStop" },
    repeat,
    ...overrides,
  };
}

// 5. Monologue
export function monologueTask(
  overrides: Partial<Pick<MonologueTask, "topic" | "repeat" | "illustration">> = {}
): MonologueTask {
  const topic = overrides.topic ?? "Hobbies";
  const repeat = overrides.repeat ?? 1;

  return {
    type: "voice",
    category: "monologue",
    titleKey: "tasks.monologue.title",
    subtitleKey: "tasks.monologue.subtitle",
    translationParams: { topic, topicDescription: topic },
    topic,
    recording: { mode: "basicStop" },
    repeat,
    ...overrides,
  };
}

//
// === All predefined tasks ===
//
export const TASKS: Task[] = [
  phonationTask({ phoneme: "aaa", maxDuration: 2, repeat: 1 }),
  syllableRepeatingTask(), // uses default syllable "pa-ta-ka"
  readingTask(),
  retellingTask({ fairytale: "Hansel and Gretel" }),
  syllableRepeatingTask({ syllable: "ta-ta-ta", maxDuration: 3 }),
  monologueTask(),
];