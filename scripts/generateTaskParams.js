// scripts/generateTaskParams.js
// Run with: node scripts/generateTaskParams.js
// Works with "type": "module" in package.json

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- Fix __dirname for ES modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Main extraction function ---
function extractTaskParams(filePath) {
  const absPath = path.resolve(filePath);
  const content = fs.readFileSync(absPath, "utf8");
  // console.log(content)

  const results = {};

  // Find each export function ... { ... } block
  const funcRegex = /export\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*(?::[^{]+)?\s*{/gm;
  let match;

  while ((match = funcRegex.exec(content)) !== null) {
    const funcName = match[1];
    let bodyStart = funcRegex.lastIndex - 1;

    // --- Find matching closing brace (function end) ---
    let depth = 0;
    let i = bodyStart;
    for (; i < content.length; i++) {
      const ch = content[i];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) break;
      }
    }

    if (depth !== 0) {
        console.warn(`⚠️  Could not match braces for ${funcName}`);
        continue;
      }

    const funcBody = content.slice(bodyStart + 1, i);
    //console.log("BODY FOR", funcName, ":\n", funcBody.slice(0, 200) + "...");

    // --- Extract category ---
    const catMatch = funcBody.match(/category\s*:\s*['"]([^'"]+)['"]/);
    const category =
      catMatch?.[1] || funcName.replace(/Task$/, "").toLowerCase();

    // --- Extract all "overrides.<something>" parameters ---
    const overrideRegex = /overrides\.([A-Za-z0-9_]+)/g;
    const params = new Set();
    let m;
    while ((m = overrideRegex.exec(funcBody)) !== null) {
      params.add(m[1]);
    }

    // --- Extract default values (const X = overrides.X ?? defaultValue) ---
    const defaults = {};
    const defaultRegex =
    /const\s+([A-Za-z0-9_]+)\s*=\s*overrides\.\1\s*\?\?\s*([^;]+)/g;

    let d;
    while ((d = defaultRegex.exec(funcBody)) !== null) {
      let key = d[1];
      let rawValue = d[2].trim();

      // Clean up string quotes
      if (/^["'`].*["'`]$/.test(rawValue)) {
          rawValue = rawValue.slice(1, -1);
      } else if (!isNaN(Number(rawValue))) {
          rawValue = Number(rawValue);
      }

      defaults[key] = rawValue;
    }

    results[category] = {
      params: Array.from(params).sort(),
      defaults,
    };
    }

    return results;
}

// --- Run extraction ---
const tasksPath = path.resolve(__dirname, "../src/tasks.ts");
const outPath = path.resolve(__dirname, "../src/config/taskParams.json");

const taskParams = extractTaskParams(tasksPath);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(taskParams, null, 2), "utf8");

console.log("✅ Extracted task parameters:");
console.log(taskParams);
console.log(`\nSaved to: ${outPath}`);
