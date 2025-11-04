// frontend/src/api/protocols.js

export async function saveProtocolToBackend(protocolData) {
    try {
      const response = await fetch("http://localhost:4000/api/protocols/save", {
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
  