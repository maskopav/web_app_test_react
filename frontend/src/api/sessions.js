// src/api/sessions.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function initSession(token) {
  // Collect basic client-side metadata
  const deviceMetadata = {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    platform: navigator.platform,
    language: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const res = await fetch(`${API_BASE}/sessions/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, deviceMetadata }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to init session");
  }

  return res.json(); // Returns { success: true, sessionId: 123 }
}