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
  textTitle: string;
  textActive: string;
  recording: Extract<RecordingMode, { mode: "basicStop" }>;
}

export interface MonologueTask extends BaseTask<"monologue"> {
  category: "monologue";
  topic: string;
  topicDescription: string,
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
  const phoneme = overrides.phoneme ?? "inputs.phonation.phoneme.e";
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
  const syllable = overrides.syllable ?? "inputs.syllableRepeating.syllable.pataka";
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
  const fairytale = overrides.fairytale ?? "inputs.retelling.fairytale.snowWhite";
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
  overrides: Partial<Pick<ReadingTask, "textTitle" | "textActive" | "repeat" | "illustration">> = {}
): ReadingTask {
  const textTitle = overrides.textTitle ?? "inputs.reading.seedling.textTitle";
  const textActive = overrides.textActive ?? "inputs.reading.seedling.textActive";
  const repeat = overrides.repeat ?? 1;

  return {
    type: "voice",
    category: "reading",
    titleKey: "tasks.reading.title",
    subtitleKey: "tasks.reading.subtitle",
    subtitleActiveKey: "tasks.reading.subtitleActive",
    translationParams: { textTitle, textActive },
    textTitle,
    textActive,
    recording: { mode: "basicStop" },
    repeat,
    ...overrides,
  };
}

// 5. Monologue
export function monologueTask(
  overrides: Partial<Pick<MonologueTask, "topic" | "topicDescription" | "repeat" | "illustration">> = {}
): MonologueTask {
  const topic = overrides.topic ?? "inputs.monologue.hobbies.topic";
  const topicDescription = overrides.topic ?? "inputs.monologue.hobbies.topicDescription";
  const repeat = overrides.repeat ?? 1;

  return {
    type: "voice",
    category: "monologue",
    titleKey: "tasks.monologue.title",
    subtitleKey: "tasks.monologue.subtitle",
    translationParams: { topic, topicDescription},
    topic,
    topicDescription,
    recording: { mode: "basicStop" },
    repeat,
    ...overrides,
  };
}

//
// === All predefined tasks ===
//
export const TASKS: Task[] = [
  phonationTask({ maxDuration: 2, repeat: 1 }),
  readingTask({
    textTitle: "inputs.reading.seedling.textTitle", 
    textActive: "inputs.reading.seedling.textActive"}),
  retellingTask({ 
    fairytale: "inputs.retelling.fairytale.hanselAndGretel"}),
  syllableRepeatingTask({ 
    syllable: "inputs.syllableRepeating.syllable.ka", 
    maxDuration: 3 }),
  monologueTask(),
];