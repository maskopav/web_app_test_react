//src/utils/translations.ts
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { taskBaseConfig } from "../tasks.js";

// -----------------------------
// TRANSLATION TYPES
// -----------------------------
export interface TaskTranslation {
  name: string;
  title: string;
  subtitle?: string;
  subtitleActive?: string;
  params?: Record<string, any>;
}

// -----------------------------
// TRANSLATION HELPERS
// -----------------------------

export function translateTaskName(category: string): string {
  return i18next.t(`${category}.name`, { ns: "tasks", defaultValue: category });
}

export function translateTaskTitle(category: string, params: Record<string, any> = {}): string {
  return i18next.t(`${category}.title`, { ns: "tasks", ...params, defaultValue: category });
}

export function translateTaskSubtitle(category: string, params: Record<string, any> = {}): string {
  return i18next.t(`${category}.subtitle`, { ns: "tasks", ...params, defaultValue: "" });
}

export function translateTaskSubtitleActive(category: string, params: Record<string, any> = {}): string {
  return i18next.t(`${category}.subtitleActive`, { ns: "tasks", ...params, defaultValue: "" });
}

export function translateParamName(category: string, param: string): string {
  const key = `${category}.params.${param}.label`;
  const commonKey = `common.params.${param}`;

  const taskLabel = i18next.t(key, { ns: "tasks", defaultValue: "" });
  if (taskLabel) return taskLabel as string;

  const commonLabel = i18next.t(commonKey, { ns: "common", defaultValue: "" });
  if (commonLabel) return commonLabel as string;

  return param;
}

export function translateParamValue(category: string, param: string, value: string): string {
  const key = `${category}.params.${param}.values.${value}`;

  // Use returnObjects:true so i18next can return nested structures when needed
  const translated = i18next.t(key, { ns: "tasks", defaultValue: value, returnObjects: true });

  if (typeof translated === "object" && translated !== null) {
    // Case: structured translation (like reading/monologue)
    if ("label" in translated && typeof translated.label === "string") {
      return translated.label;
    }

    // If label is missing, try to find first string field
    const firstString = Object.values(translated).find(v => typeof v === "string");
    return (firstString as string) || value;
  }

  // Normal case: translation is a plain string
  return translated as string;
}

export function getDefaultParams(category: string): Record<string, any> {
  const params = taskBaseConfig[category]?.params || {};
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, v.default]));
}

// -----------------------------
// HOOK VARIANT
// -----------------------------
export function useTaskTranslation(category: string, params: Record<string, any> = {}): TaskTranslation {
  const { t } = useTranslation("tasks");

  const safeString = (val: any): string =>
    typeof val === "string" ? val : JSON.stringify(val);

  return {
    name: safeString(t(`${category}.name`)),
    title: safeString(t(`${category}.title`, params)),
    subtitle: safeString(t(`${category}.subtitle`, params)),
    subtitleActive: safeString(t(`${category}.subtitleActive`, params)),
    params: t(`${category}.params`, { returnObjects: true }) as Record<string, any>,
  };
}
