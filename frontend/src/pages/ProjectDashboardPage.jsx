// src/pages/ProjectDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { useMappings } from "../context/MappingContext";
import { getProjectStats } from "../api/projects";
import "./Pages.css";

export default function ProjectDashboardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["admin", "common"]);
  const { refreshMappings, mappings } = useMappings();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load basic project info & stats
  useEffect(() => {
    refreshMappings(["projects"]);
    
    async function loadStats() {
      try {
        const data = await getProjectStats(projectId);
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [projectId]);

  const project = mappings?.projects?.find(p => p.id === Number(projectId));
  const projectName = project?.name || "Loading...";
  const isActive = project?.is_active === 1;

  // Navigation Handlers
  const goProtocols = () => navigate(`/projects/${projectId}/protocols`);
  const goParticipants = () => navigate(`/projects/${projectId}/participants`);
  const goData = () => navigate(`/projects/${projectId}/data`);

  // --- Helper: Status Badge ---
  const StatusBadge = ({ active }) => (
    <span className={`status-badge ${active ? "active" : "inactive"}`}>
      {active ? t("projectDashboard.status.active") : t("projectDashboard.status.inactive")}
    </span>
  );

  if (loading) return <div className="app-container"><p>{t("loading", { ns: "common" })}...</p></div>;

  return (
    <div className="dashboard-page">
      {/* Top Navigation Bar */}
      <div className="top-bar">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">{projectName}</h1>
          <StatusBadge active={isActive} />
        </div>
        <p className="project-description">{project?.description || t("projectDashboard.noDescription")}</p>
      </div>

      {/* --- STATISTICS SECTION --- */}
      <div className="dashboard-grid">
        
        {/* Card 1: Volume (Big Numbers) */}
        <div className="card dashboard-card volume-card">
          <h3>{t("projectDashboard.stats.volumeTitle")}</h3>
          <div className="stat-row large">
            <div className="stat-item">
              <span className="stat-value">{stats?.count_current_protocols_defined || 0}</span>
              <span className="stat-label">{t("projectDashboard.stats.protocols")}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{stats?.total_participants || 0}</span>
              <span className="stat-label">{t("projectDashboard.stats.participants")}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{stats?.total_assignments || 0}</span>
              <span className="stat-label">{t("projectDashboard.stats.assignments")}</span>
            </div>
            <div className="divider"></div>
          </div>
        </div>

        {/* Card 2: Lifecycle Flow (Funnel) */}
        <div className="card dashboard-card flow-card">
          <h3>{t("projectDashboard.stats.flowTitle")}</h3>
          <div className="flow-visual">
            <div className="flow-step">
              <span className="flow-count pending">{stats?.count_pending_assignments || 0}</span>
              <span className="flow-label">{t("projectDashboard.stats.pending")}</span>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="flow-count active">{stats?.count_active_assignments || 0}</span>
              <span className="flow-label bold">{t("projectDashboard.stats.active")}</span>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <span className="flow-count finished">{stats?.count_finished_assignments || 0}</span>
              <span className="flow-label">{t("projectDashboard.stats.finished")}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Health & Maintenance */}
        <div className="card dashboard-card health-card">
          <h3>{t("projectDashboard.stats.healthTitle")}</h3>
          
          {/* Protocol Version Check */}
          <div className="health-row">
            <span className="health-label">{t("projectDashboard.stats.currentVersionUsers")}:</span>
            <span className="health-val safe">{stats?.count_users_on_current_version || 0}</span>
          </div>
          
          <div className="health-row">
            <span className="health-label">{t("projectDashboard.stats.legacyVersionUsers")}:</span>
            <span className={`health-val ${stats?.count_users_on_legacy_version > 0 ? "danger" : "safe"}`}>
              {stats?.count_users_on_legacy_version || 0}
            </span>
          </div>

          {stats?.count_users_on_legacy_version > 0 && (
            <div className="warning-box">
              ⚠️ {t("projectDashboard.stats.updateWarning", { count: stats.count_users_on_legacy_version })}
            </div>
          )}
        </div>
      </div>

      {/* --- ACTIONS SECTION --- */}
      <h2 className="section-heading">{t("projectDashboard.actionsTitle")}</h2>
      <div className="actions-grid">
        
        <button className="action-card btn-participants" onClick={goParticipants}>
          <div className="icon">👥</div>
          <div className="text">
            <h3>{t("projectDashboard.actions.participants")}</h3>
            <p>{t("projectDashboard.actions.participantsDesc")}</p>
          </div>
        </button>

        <button className="action-card btn-protocols" onClick={goProtocols}>
          <div className="icon">📋</div>
          <div className="text">
            <h3>{t("projectDashboard.actions.protocols")}</h3>
            <p>{t("projectDashboard.actions.protocolsDesc")}</p>
          </div>
        </button>

        <button className="action-card btn-data" onClick={goData} disabled>
          <div className="icon">📊</div>
          <div className="text">
            <h3>{t("projectDashboard.actions.data")}</h3>
            <p>{t("projectDashboard.actions.dataDesc")}</p>
          </div>
        </button>

      </div>
    </div>
  );
}