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
  