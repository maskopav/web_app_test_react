// src/pages/ProjectDashboardPage.jsx
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { useMappings } from "../context/MappingContext";
import "./Pages.css";

export default function ProjectDashboardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(["common", "admin"]);
  const { refreshMappings, mappings } = useMappings();

  const didRefresh = useRef(false);
  useEffect(() => {
    if (!didRefresh.current) {
      refreshMappings();
      didRefresh.current = true;
    }
  }, [refreshMappings]);

  const project = mappings?.projects?.find(p => p.id === Number(projectId));

  const goProtocols = () => navigate(`/projects/${projectId}/protocols`);
  const goParticipants = () => navigate(`/projects/${projectId}/participants`);
  const goAssignments = () => navigate(`/projects/${projectId}/enrollment/assign`);
  const goData = () => navigate(`/projects/${projectId}/data`);

  return (
    <div className="project-dashboard-page">

      {/* Top bar */}
      <div className="top-bar">
        <button
          className="btn-back"
          onClick={() => navigate("/")}
        >
          ← {t("buttons.back")}
        </button>
        <LanguageSwitcher />
      </div>

      <h1 className="page-title">Project: {project?.name || projectId}</h1>

      {/* Summary section */}
      <div className="project-summary card">
        <h2>Project statistics</h2>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-value">{project?.is_active ? "Active" : "Inactive"}</div>
            <div className="stats-label">Status</div>
          </div>

          <div className="stats-card">
            <div className="stats-value">{project?.country || "-"}</div>
            <div className="stats-label">Country</div>
          </div>

          <div className="stats-card">
            <div className="stats-value">—</div>
            <div className="stats-label">Participants</div>
          </div>

          <div className="stats-card">
            <div className="stats-value">—</div>
            <div className="stats-label">Active protocols</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="project-actions card">
        <h2>Actions</h2>

        <div className="action-buttons">
          <button className="dashboard-btn" onClick={goParticipants}>
            Participants management
          </button>

          <button className="dashboard-btn" onClick={goProtocols}>
            Protocols management
          </button>

          <button className="dashboard-btn" onClick={goAssignments}>
            Participant access & assignments
          </button>

          <button className="dashboard-btn" onClick={goData}>
            Data explorer
          </button>
        </div>
      </div>

      {/* Placeholder for protocol & participant stats */}
      <div className="project-details card">
        <h2>Protocol overview</h2>
        <p>Placeholder table: protocol name, versions, assigned participants, questionnaires…</p>
      </div>

      <div className="project-details card">
        <h2>Participant overview</h2>
        <p>Placeholder table: participant list, assigned protocol, progress…</p>
      </div>
    </div>
  );
}
