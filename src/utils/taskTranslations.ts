// src/utils/taskTranslations.ts
import i18next from "i18next";
import baseConfigRaw from "../config/tasksBase.json" with { type: "json" };

type TaskBase = {
  type: string;
  recording: { mode: string; maxDuration?: number };
  params: Record<string, { default?: any; values?: any[] }>;
};

const _raw = baseConfigRaw as unknown as Record<string, any>;
const { _meta, ..._rest } = _raw;
const baseConfig = _rest as Record<string, TaskBase>;

/** safe wrapper: always return a string (falls back to JSON.stringify for objects) */
function tStr(key: string, options?: any): string {
  const out = i18next.t(key, options) as unknown;
  return typeof out === "string" ? out : JSON.stringify(out);
}

/** Example usage in functions */
export function translateTaskName(category: string): string {
  const key = `tasks.${category}.name`;
  return i18next.exists(key) ? tStr(key) : category;
}

export function translateTaskTitle(category: string, params?: Record<string, any>): string {
  const key = `tasks.${category}.title`;
  return i18next.exists(key) ? tStr(key, params) : category;
}

export function translateParamName(category: string, param: string): string {
  const key = `tasks.${category}.params.${param}.label`;
  const commonKey = `tasks.common.params.${param}`; // if you have common fallbacks
  if (i18next.exists(key)) return tStr(key);
  if (i18next.exists(commonKey)) return tStr(commonKey);
  return param;
}

export function getDefaultParams(category: string): Record<string, any> {
  const params = baseConfig[category]?.params || {};
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, v.default]));
}
