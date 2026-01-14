// src/api/userProjects.js
const API_BASE = import.meta.env.VITE_API_BASE;

  export async function fetchAdminAssignments() {
    const res = await fetch(`${API_BASE}/user-projects/user-projects`);
    if (!res.ok) throw new Error("Failed to fetch assignments");
    return res.json();
  }
  

  export async function assignProjectToUser(user_id, project_id) {
    const res = await fetch(`${API_BASE}/user-projects/assign-project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, project_id })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Assignment failed");
    return json;
  }

  export async function removeUserProjectAssignmentApi(id) {
    const res = await fetch(`${API_BASE}/user-projects/remove-assignment/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to remove assignment");
    return json;
  }