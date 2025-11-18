// src/api/participantProtocol.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchParticipantProtocol(token) {
  const res = await fetch(`${API_BASE}/participant-protocol/${token}`);
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch participant protocol");
  return res.json();
}

export async function createParticipantProtocol(participantId, projectProtocolId) {
  const res = await fetch(`${API_BASE}/participant-protocol/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participant_id: participantId,
      project_protocol_id: projectProtocolId
    })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to create participant protocol");

  return data; // { success, participant_protocol_id, unique_token }
}