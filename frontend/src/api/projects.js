// src/api/projects.js
const API_BASE = import.meta.env.VITE_API_BASE;
import { getMappings } from "./mappings";

// Fetch stats for a specific project from the view
// We reuse the generic mappings endpoint since the view is now in the DB
export async function getProjectStats(projectId) {
  try {
    const data = await getMappings(["v_project_summary_stats"]);
    const allStats = data.v_project_summary_stats || [];
    
    // Filter client-side for the specific project
    const projectStats = allStats.find(p => p.project_id === Number(projectId));
    return projectStats || null;
  } catch (err) {
    console.error("Failed to load project stats:", err);
    throw err;
  }
}

export async function fetchProjectsList() {
    const res = await fetch(`${API_BASE}/projects/projects-list`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
  }