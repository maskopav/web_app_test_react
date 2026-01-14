// src/api/users.js
const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchAllAdmins() {
    const res = await fetch(`${API_BASE}/users/users`);
    if (!res.ok) throw new Error("Failed to fetch admins");
    return res.json();
  }
  
  export async function toggleAdminActive(user_id, is_active) {
    const res = await fetch(`${API_BASE}/users/toggle-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, is_active })
    });
    return res.json();
  }

  export async function createAdminApi(payload) {
    const res = await fetch(`${API_BASE}/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to create admin");
    return json;
  }