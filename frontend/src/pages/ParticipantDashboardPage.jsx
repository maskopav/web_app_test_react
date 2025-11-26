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
import ParticipantProtocolTable from "../components/ParticipantProtocol/ParticipantProtocol";

// Styles
import "./Pages.css";
import "../components/Protocols/Protocols.css"; 
import "./ParticipantDashboardPage.css"; 

export default function ParticipantDashboardPage() {
  const { t } = useTranslation(["admin", "common"]);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { refreshMappings } = useMappings(); // used to refresh dropdowns context if needed

  // --- State ---
  const [participants, setParticipants] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [protocols, setProtocols] = useState([]); // for the modal dropdown
  
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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
      setProtocols(protosData);
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

  // --- Handlers ---
  const handleParticipantCreated = () => {
    loadData(); // Refresh both tables as a new participant creates an assignment too
  };

  const handleAssignmentChange = () => {
    // Refresh assignments when user activates/deactivates a protocol
    fetchParticipantProtocolView({ project_id: projectId })
      .then(setAssignments)
      .catch(console.error);
  };

  return (
    <div className="project-dashboard-page full-height">
      {/* Top Bar */}
      <div className="top-bar">
        <button className="btn-back" onClick={() => navigate(`/projects/${projectId}`)}>
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      <div className="dashboard-split-container">
        
        {/* --- SECTION 1: Participants Management --- */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="header-text-group">
                <h3>{t("participantDashboard.title")}</h3>
                <span className="section-subtitle">
                    {t("participantDashboard.subtitle")}
                </span>
            </div>
            <button className="btn-create small" onClick={() => setShowAddModal(true)}>
              + {t("participantDashboard.addParticipant")}
            </button>
          </div>
          
          <div className="table-wrapper-fix">
            <ParticipantTable 
              participants={participants} 
              loading={loading}
              onEdit={(p) => alert(`Editing ${p.full_name} (Not implemented)`)}
            />
          </div>
        </section>

        {/* --- SECTION 2: Protocol Assignments --- */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="header-text-group">
                <h3>{t("participantProtocol.title", "Protocol Assignments")}</h3>
                <span className="section-subtitle">
                    {t("participantProtocol.subtitle")}
                </span>
            </div>
          </div>

          <div className="table-wrapper-fix">
            <ParticipantProtocolTable 
              rows={assignments} 
              onRefresh={handleAssignmentChange}
            />
          </div>
        </section>

      </div>

      {/* Add Participant Modal */}
      <AddParticipantModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        projectId={projectId}
        protocols={protocols}
        onSuccess={handleParticipantCreated}
      />
    </div>
  );
}