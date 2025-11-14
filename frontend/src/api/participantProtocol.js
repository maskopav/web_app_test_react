// src/api/participantProtocol.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchParticipantProtocol(token) {
  const res = await fetch(`${API_BASE}/public/participant-protocol/${token}`);
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch participant protocol");
  return res.json();
}
