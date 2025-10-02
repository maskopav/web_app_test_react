// src./tasks.ts
import { t } from "i18next";

// Base task
interface BaseTask {
    type: "voice"; // maybe later: "camera", "motor"
    titleKey: string;
    subtitleKey: string;
    subtitleActiveKey?: string;
    translationParams?: Record<string, any>;
    audioExample?: string;
    repeat?: number;
}

// recording modes
type RecordingMode =
  | { mode: "basicStop"; maxDuration?: never }
  | { mode: "countDown"; maxDuration: number }
  | { mode: "delayedStop"; maxDuration: number };

// Task categories
// 1. Phonation requires a phoneme
interface PhonationTask extends BaseTask {
    category: "phonation";
    phoneme: string;              // user input
    recording: Extract<RecordingMode, { mode: "delayedStop" }>;
}
  
// 2. Syllable repeating requires a syllable
interface SyllableRepeatingTask extends BaseTask {
    category: "syllableRepeating";
    syllable: string;
    recording: Extract<RecordingMode, { mode: "countDown" }>;
}

// 3.Retelling requires a fairytale
interface RetellingTask extends BaseTask {
    category: "retelling";
    fairytale: string;
    recording: Extract<RecordingMode, { mode: "basicStop" }>;
}

// 4. Reading
interface ReadingTask extends BaseTask {
    category: "reading";
    reading: string;
    recording: Extract<RecordingMode, { mode: "basicStop" }>;
}

// 5. Monologue on topic
interface MonologueTask extends BaseTask {
    category: "monologue";
    topic: string;
    recording: Extract<RecordingMode, { mode: "basicStop" }>;
}


// Union type
export type Task = PhonationTask | SyllableRepeatingTask | RetellingTask | ReadingTask | MonologueTask;

// 1. Phonation
export const phonationTask = (overrides: Partial<PhonationTask> = {}): PhonationTask => {
    const phoneme = overrides.phoneme ?? "a";
    const maxDuration = overrides.recording?.maxDuration ?? 10;
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
        ...overrides
    };
};

// 2. Syllable repeating
export const syllableRepeatingTask = (overrides: Partial<SyllableRepeatingTask> = {}): SyllableRepeatingTask => {
    const syllable = overrides.syllable ?? "pa-ta-ka";
    const maxDuration = overrides.recording?.maxDuration ?? 10;
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
        ...overrides
    };
};
  
// 3. Retelling
export const retellingTask = (overrides: Partial<RetellingTask> = {}): RetellingTask => {
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
        ...overrides
    };
};

// 4. reading
export const readingTask = (overrides: Partial<ReadingTask> = {}): ReadingTask => {
    const reading = overrides.reading ?? "Sazenička";
    const repeat = overrides.repeat ?? 1;

    return {
        type: "voice",
        category: "reading",
        titleKey: "tasks.reading.title",
        subtitleKey: "tasks.reading.subtitle",
        subtitleActiveKey: "tasks.reading.subtitleActive",
        translationParams: { textTitle:reading, textActive:reading },
        reading,
        recording: { mode: "basicStop" },
        repeat,
        ...overrides
    };
};

// 5. monologue
export const monologueTask = (overrides: Partial<MonologueTask> = {}): MonologueTask => {
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
        ...overrides
    };
};


  export const TASKS: Task[] = [
    phonationTask({ phoneme: "aaa", recording: { mode: "delayedStop", maxDuration: 5 }, repeat: 1 }),
    syllableRepeatingTask(), // uses default "pa-ta-ka"
    readingTask(),
    retellingTask({ fairytale: "Hansel and Gretel" }),
    syllableRepeatingTask({ syllable: "ta-ta-ta", recording: { mode: "countDown", maxDuration: 3 } }),
    monologueTask()
  ];
  