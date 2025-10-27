// src/utils/getIllustrationPath.ts

/**
 * Builds a predictable illustration path based on task category and its first parameter key/value.
 * Example: phonation -> phoneme "a" => /illustrations/phonation_a.mp3
 */
export function getIllustrationPath(category: string, params: Record<string, any>): string | undefined {
  const paramKeys = Object.keys(params);
  if (paramKeys.length === 0) return undefined;

  const mainParam = paramKeys[0]; // first param
  const value = params[mainParam];
  if (!value) return undefined;

  // Construct a base filename, e.g. "phonation_a"
  const baseName = `${category}_${String(value)}`;

  // Return just the base path (actual existence check will happen in VoiceRecorder)
  return `/illustrations/${baseName}.mp3`;
}
