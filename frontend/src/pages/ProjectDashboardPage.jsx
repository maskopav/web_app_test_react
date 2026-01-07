// src/pages/ProjectDashboardPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMappings } from "../context/MappingContext";
import { getProjectStats } from "../api/projects";

// Imported Components
import ProjectStats from "../components/ProjectDashboard/ProjectStats";
import ProjectActions from "../components/ProjectDashboard/ProjectActions";
import StatusBadge from "../components/ProjectDashboard/StatusBadge";
import DashboardTopBar from "../components/DashboardTopBar/DashboardTopBar"; 

// Styles
import "./Pages.css"; // Global layout styles
import "../components/ProjectDashboard/ProjectDashboard.css"; // Specific dashboard component styles

export default function ProjectDashboardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin", "common"]);
  const { refreshMappings, mappings } = useMappings();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref to prevent double-fetch in Strict Mode
  const didLoad = useRef(false);

  // 1. Load basic project info & stats
  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    refreshMappings(["projects"]);
    
    async function loadStats() {
      try {
        const data = await getProjectStats(projectId);
        setStats(data);
      } catch (e) {
        console.error("Error loading project stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [projectId, refreshMappings]);

  // Resolve project details from mappings context
  const project = mappings?.projects?.find(p => p.id === Number(projectId));
  const projectName = project?.name || "Loading...";
  const isActive = project?.is_active === 1;

  // Navigation Handlers
  const goProtocols = () => navigate(`/projects/${projectId}/protocols`);
  const goParticipants = () => navigate(`/projects/${projectId}/participants`);
  const goData = () => navigate(`/projects/${projectId}/data`);
  const handleBack = () => navigate("/admin");

  if (loading) {
    return (
      <div className="app-container">
        <p>{t("loading", { ns: "common" })}...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Top Navigation Bar */}
      <DashboardTopBar onBack={handleBack} />

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">{projectName}</h1>
          <StatusBadge active={isActive} />
        </div>
        <p className="project-description">
          {project?.description || t("projectDashboard.noDescription")}
        </p>
      </div>

      {/* --- STATISTICS SECTION --- */}
      {/* Encapsulated in a separate component for cleaner code */}
      <ProjectStats stats={stats} />

      {/* --- ACTIONS SECTION --- */}
      <h2 className="section-heading">{t("projectDashboard.actionsTitle")}</h2>
      
      <ProjectActions 
        onParticipants={goParticipants}
        onProtocols={goProtocols}
        onData={goData}
      />
    </div>
  );
}