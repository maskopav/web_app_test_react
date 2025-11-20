// src/api/participantProtocol.js
const API_BASE = import.meta.env.VITE_API_BASE;

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
