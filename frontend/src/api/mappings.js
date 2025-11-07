// src/api/mappings.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function getMappings(tables = []) {
  const query = tables.length ? `?tables=${tables.join(",")}` : "";
  const url = `${API_BASE}/mappings${query}`;
  console.log("Fetching:", url);
  const res = await fetch(url);
  const text = await res.text();
  console.log("Response text:", text);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from ${url}`);
  }
}
