// src/pages/ParticipantDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { useMappings } from "../context/MappingContext";

// API
import { getParticipants } from "../api/participants";
import { getProtocolsByProjectId } from "../api/protocols";
import { fetchParticipantProtocolView } from "../api/participantProtocols";

// Components
import ParticipantTable from "../components/Participants/ParticipantTable";
import AddParticipantModal from "../components/Participants/AddParticipantModal";
import ParticipantProtocolTable from "../components/Participants/ParticipantProtocolTable";

// Styles
import "./Pages.css";
import "../components/Protocols/Protocols.css"; 
import "./ParticipantDashboardPage.css"; 

export default function ParticipantDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { refreshMappings, mappings } = useMappings(); // used to refresh dropdowns context if needed

  // --- State ---
  const [participants, setParticipants] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [protocols, setProtocols] = useState([]); // for the modal dropdown
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // --- Data Loading ---
  async function loadData() {
    setLoading(true);
    try {
      // Parallel fetch for efficiency
      const [partsData, assignsData, protosData] = await Promise.all([
        getParticipants(projectId),
        fetchParticipantProtocolView({ project_id: projectId }),
        getProtocolsByProjectId(projectId)
      ]);

      setParticipants(partsData);
      setAssignments(assignsData);

      // Filter for current protocols only
      const currentProtocols = protosData.filter(p => p.is_current === 1);
      setProtocols(currentProtocols);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    refreshMappings(["protocols", "project_protocols"]);
    loadData();
  }, [projectId]);

  // Resolve project name for the title
  const currentProject = mappings?.projects?.find(p => p.id === Number(projectId));
  const projectName = currentProject?.name || "";

  // --- Handlers ---
  const handleAddClick = () => {
    setSelectedParticipant(null); // Clear selection for Add mode
    setShowModal(true);
  };

  const handleEditClick = (participant) => {
    setSelectedParticipant(participant); // Set data for Edit mode
    setShowModal(true);
  };

  const handleSuccess = () => {
    // Refresh both tables (Participants & Assignments)
    // Creating a participant creates an assignment, so both lists change.
    loadData();
  };

  const handleAssignmentChange = () => {
    // Refresh assignments when user activates/deactivates a protocol
    fetchParticipantProtocolView({ project_id: projectId })
      .then(setAssignments)
      .catch(console.error);
  };

  return (
    <div className="dashboard-page">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      {/* Page Title with Project Name */}
      <h2 className="page-title">
        {projectName ? `${projectName}: ` : ""}
        {t("participantDashboard.title")}
      </h2>

      {/* Main Content */}
      <div className="dashboard-split-container">
        
        {/* --- SECTION 1: Participants Management --- */}
        <section className="card compact-create">
          <div className="section-header create-header-row">
            <div className="header-text-group">
                <div className="section-title">{t("participantDashboard.title")}</div>
                <span className="section-subtitle">
                    {t("participantDashboard.subtitle")}
                </span>
            </div>
            <button className="btn-create small" onClick={handleAddClick}>
              + {t("participantDashboard.addParticipant")}
            </button>
          </div>
  
            <ParticipantTable 
              participants={participants} 
              loading={loading}
              onEdit={handleEditClick}
            />
        </section>

        {/* --- SECTION 2: Protocol Assignments --- */}
        <section className="dashboard-section card">
          <div className="section-header">
            <div className="header-text-group">
                <div className="section-title">{t("participantProtocol.title", "Protocol Assignments")}</div>
                <span className="section-subtitle">
                    {t("participantProtocol.subtitle")}
                </span>
            </div>
          </div>

            <ParticipantProtocolTable 
              rows={assignments} 
              onRefresh={handleAssignmentChange}
            />
        </section>

      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        open={showModal}
        onClose={() => setShowModal(false)}
        projectId={projectId}
        protocols={protocols}
        participantToEdit={selectedParticipant}
        onSuccess={handleSuccess}
      />
    </div>
  );
}