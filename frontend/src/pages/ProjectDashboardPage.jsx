// src/pages/ProjectDashboardPage.jsx
import { useParams } from "react-router-dom";
import "./Pages.css"

export default function ProjectDashboardPage() {
  const { projectId } = useParams();
  const currentProject = projectId || "demo"; // fallback for test

  return (
    <div>
      <h2>Project Dashboard</h2>
      <p>Loaded project: {currentProject}</p>
    </div>
  );
  }