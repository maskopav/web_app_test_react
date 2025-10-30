// src/api/mappings.js
export async function getMappings(tables = []) {
  const query = tables.length ? `?tables=${tables.join(",")}` : "";
  const url = `/api/mappings${query}`;
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
