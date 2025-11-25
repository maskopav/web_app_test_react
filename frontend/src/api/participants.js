/* frontend/src/api/participants.js */
const API_BASE = import.meta.env.VITE_API_BASE;

export async function getParticipants(projectId) {
    // If projectId is provided, filter by it. Otherwise, fetch all.
    const url = projectId 
        ? `${API_BASE}/participants?project_id=${projectId}`
        : `${API_BASE}/participants`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load participants");
    return res.json();
}

export async function createParticipant(data) {
  const res = await fetch(`${API_BASE}/participants/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to create participant");
  return json;
}