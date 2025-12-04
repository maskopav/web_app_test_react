// src/components/ProjectDashboard/ProjectStats.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./ProjectDashboard.css";

export default function ProjectStats({ stats }) {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="dashboard-grid">
      
      {/* Card 1: Volume (Big Numbers) */}
      <div className="dashboard-card volume-card">
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
        </div>
      </div>

      {/* Card 2: Lifecycle Flow (Funnel) */}
      <div className="dashboard-card flow-card">
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
      <div className="dashboard-card health-card">
        <h3>{t("projectDashboard.stats.healthTitle")}</h3>
        
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
  );
}