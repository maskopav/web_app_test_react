import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { getParticipants } from "../api/participants";
import { getProtocolsByProjectId } from "../api/protocols"; // Make sure this import exists

// Import the refactored components
import ParticipantTable from "../components/Participants/ParticipantTable";
import AddParticipantModal from "../components/Participants/AddParticipantModal";

import "./Pages.css";
import "../components/Protocols/Protocols.css"; 

export default function ParticipantDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // --- Data Loading ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [parts, protos] = await Promise.all([
        getParticipants(projectId),
        getProtocolsByProjectId(projectId)
      ]);
      setParticipants(parts);
      setProtocols(protos);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  return (
    <div className="project-dashboard-page">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="protocols-container">
        
        {/* Header */}
        <div className="participant-list-header">
          <h2>{t("participantDashboard.title")}</h2>
          <button className="btn-create" onClick={() => setShowAddModal(true)}>
            {t("participantDashboard.addParticipant")}
          </button>
        </div>

        {/* Participants Table Component */}
        <ParticipantTable 
          participants={participants} 
          loading={loading} 
        />
      </div>

      {/* Add Modal Component */}
      <AddParticipantModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        projectId={projectId}
        protocols={protocols}
        onSuccess={() => {
          // Refresh list after successful creation
          getParticipants(projectId).then(setParticipants);
        }}
      />
    </div>
  );
}