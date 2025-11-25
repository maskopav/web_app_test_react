// frontend/src/api/protocols.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function saveProtocolToBackend(protocolData) {
    try {
      const response = await fetch(`${API_BASE}/protocols/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(protocolData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save protocol");
  
      return data;
    } catch (error) {
      console.error("Error in saveProtocol:", error);
      throw error;
    }
  }

export async function getProtocolById(protocolId) {
  const res = await fetch(`${API_BASE}/protocols/${protocolId}`);
  if (!res.ok) throw new Error("Failed to fetch protocol");
  return res.json(); // expected: { protocolData, tasks }
}
 
export async function getProtocolsByProjectId(projectId) {
  const res = await fetch(`${API_BASE}/protocols?project_id=${projectId}`);
  if (!res.ok) throw new Error("Failed to fetch protocol");
  return res.json();
} 
