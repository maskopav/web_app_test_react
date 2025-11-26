// src/api/participantProtocol.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchParticipantProtocol(token) {
  const res = await fetch(`${API_BASE}/participant-protocol/${token}`);
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch participant protocol");
  return res.json();
}

export async function fetchParticipantProtocolView(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const url = `${API_BASE}/participant-protocol${query ? `?${query}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load participant-protocol view");
  }
  return res.json();
}

export async function fetchParticipantProtocolById(id) {
  const url = `${API_BASE}/participant-protocol/${id}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to load entry");
  }
  return res.json();
}

export async function activateParticipantProtocol(participantProtocolId) {
  const res = await fetch(`${API_BASE}/participant-protocol/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_protocol_id: participantProtocolId })
  });
  
  if (!res.ok) throw new Error("Activation failed");
  return res.json();
}

export async function deactivateParticipantProtocol(participantProtocolId) {
  console.log(`${API_BASE}/participant-protocol/deactivate`);
  console.log(participantProtocolId);
  const res = await fetch(`${API_BASE}/participant-protocol/deactivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_protocol_id: participantProtocolId })
  });

  if (!res.ok) throw new Error("Deactivation failed");
  return res.json();
}
