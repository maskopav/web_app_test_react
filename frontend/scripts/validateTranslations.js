// scripts/validateTranslations.js
// TODO !!!
import fs from "fs";
import en from "../src/i18n/en/tasks.json" with { type: "json" };
import cs from "../src/i18n/cs/tasks.json" with { type: "json" };

for (const key of Object.keys(en)) {
  if (!cs[key]) console.warn(`⚠️ Missing task: ${key} in cs/tasks.json`);
  else {
    const enParams = Object.keys(en[key].params || {});
    const csParams = Object.keys(cs[key].params || {});
    const missing = enParams.filter(p => !csParams.includes(p));
    if (missing.length) console.warn(`⚠️ Missing params for ${key}: ${missing.join(", ")}`);
  }
}
