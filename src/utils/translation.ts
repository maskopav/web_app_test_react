// utils/translation.ts
import i18next from "i18next";

export function resolveTranslationParams(params: Record<string, any> = {}) {
  const resolved: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" && i18next.exists(value)) {
      // If the string is a known translation key, translate it
      resolved[key] = i18next.t(value);
    } else {
      // Otherwise leave it as raw value
      resolved[key] = value;
    }
  }
  return resolved;
}
