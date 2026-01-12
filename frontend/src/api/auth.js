import i18n from "../i18n";
const API_BASE = import.meta.env.VITE_API_BASE;

export async function signupParticipant(data) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Signup failed");
  return json; // returns { token: "..." }
}

export async function loginParticipant(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Login failed");
  return json; // returns { token: "..." }
}

export async function forgotPassword(userEmail) {
  const protocolToken = window.location.hash.split("/")[2];
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: userEmail,
        protocolToken: protocolToken, 
        lang: i18n.language
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Request failed");
    return json;
  }
  
  export async function resetPassword(token, newPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Reset failed");
    return json;
  }

  export async function loginAdmin(data) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login failed");
    return json; // returns { success: true, user: { ... } }
  }

  export async function setupProfileApi(payload) {
    const res = await fetch(`${API_BASE}/auth/setup-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update profile");
    }
    return res.json();
  }
 
  export async function fetchAllAdmins() {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error("Failed to fetch admins");
    return res.json();
  }
  
  export async function fetchAdminAssignments() {
    const res = await fetch(`${API_BASE}/auth/user-projects`);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    return res.json();
  }
  
  export async function toggleAdminActive(user_id, is_active) {
    const res = await fetch(`${API_BASE}/auth/users/toggle-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, is_active })
    });
    return res.json();
  }