// src/pages/ProtocolEditorPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import ProtocolEditor from "../components/ProtocolEditor";
import { ProtocolContext } from "../context/ProtocolContext";
import { useMappings } from "../context/MappingContext";
import "./Pages.css"

export default function ProtocolEditorPage() {
  const { t } = useTranslation(["tasks", "common"]);
  const { projectId, protocolId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedProtocol, setSelectedProtocol } = useContext(ProtocolContext);
  const { refreshMappings } = useMappings();

  const [configuredTasks, setConfiguredTasks] = useState(state?.protocol?.tasks || selectedProtocol?.tasks || []);
  const [protocolData, setProtocolData] = useState(
    state?.protocol || selectedProtocol || null
  );

  // Keep context in sync (in case of page refresh)
  useEffect(() => {
    if (state?.protocol && !selectedProtocol) {
      setSelectedProtocol(state.protocol);
    }
  }, [state, selectedProtocol, setSelectedProtocol]);

  useEffect(() => {
    console.log("Loaded protocol:", protocolId, protocolData);
    if (!protocolData) {
      // TODO: fetch from backend using protocolId if needed
    }
  }, [protocolId, protocolData]);

  async function handleSave(result) {
    console.log("✅ Protocol saved, refreshing mappings...");
    try {
      await refreshMappings(["protocols"]); // reload relevant tables
      console.log("Mappings refreshed successfully.");
    } catch (err) {
      console.error("❌ Failed to refresh mappings:", err);
    }
  }

  // Back navigation handler
  const handleBackToDashboard = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to go back? Any unsaved changes will be lost."
    );
    if (userConfirmed) {
      // Clean environment
      setSelectedProtocol(null);
      // Redirect to dashboard
      navigate(`/projects/${projectId}/protocols`);
    }
  };

  return (
    <div className="protocol-editor-page">
      <div className="top-bar"> 
        <button
          className="btn-back"
          onClick={handleBackToDashboard}
        >
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      <ProtocolEditor
        initialTasks={configuredTasks}
        onChange={setConfiguredTasks}
        protocol={protocolData}
        onSave={handleSave}
      />
    </div>
  );
}
