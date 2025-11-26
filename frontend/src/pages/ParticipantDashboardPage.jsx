import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { getParticipants } from "../api/participants";
import { getProtocolsByProjectId } from "../api/protocols"; // Make sure this import exists
import { fetchParticipantProtocolView } from "../api/participantProtocols";

// Import components
import ParticipantTable from "../components/Participants/ParticipantTable";
import AddParticipantModal from "../components/Participants/AddParticipantModal";
import ParticipantProtocolTable from "../components/ParticipantProtocol/ParticipantProtocol";

import "./Pages.css";
import "../components/Protocols/Protocols.css"; 

export default function ParticipantDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const didLoad = useRef(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

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

  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;

    async function load() {
      try {
        const data = await fetchParticipantProtocolView({ project_id: projectId });
        setRows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [projectId]);


  const handleAddClick = () => {
    setSelectedParticipant(null); // Clear selection for Add mode
    setShowModal(true);
  };

  const handleEditClick = (participant) => {
    setSelectedParticipant(participant); // Set data for Edit mode
    setShowModal(true);
  };

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
          <button className="btn-create" onClick={handleAddClick}>
            {t("participantDashboard.addParticipant")}
          </button>
        </div>

        {/* Participants Table Component */}
        <ParticipantTable 
          participants={participants} 
          loading={loading} 
          onEdit={handleEditClick}
        />
      </div>

      {/* Add Modal Component */}
      <AddParticipantModal
        open={showModal}
        onClose={() => setShowModal(false)}
        projectId={projectId}
        protocols={protocols}
        participantToEdit={selectedParticipant}
        onSuccess={() => {
          // Refresh list after successful creation
          getParticipants(projectId).then(setParticipants);
        }}
      />

      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <ParticipantProtocolTable 
        rows={rows}
        onRefresh={() => {
            // reload table after changes
            fetchParticipantProtocolView({ project_id: projectId }).then(setRows);
        }}
        />
      )}
    </div>
  );
}