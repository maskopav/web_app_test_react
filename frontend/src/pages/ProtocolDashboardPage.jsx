// src/pages/ProtocolDashboardPage.jsx
import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { ProtocolContext } from "../context/ProtocolContext";
import { useMappings } from "../context/MappingContext";
import Protocols from "../components/Protocols/Protocols";
import "./Pages.css"

export default function ProtocolDashboardPage() {
  const { t } = useTranslation(["common"]);
  const { setSelectedProtocol } = useContext(ProtocolContext);
  const { refreshMappings } = useMappings();
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Refresh only once, when page is mounted the first time
  const didRefresh = useRef(false);
  useEffect(() => {
    if (!didRefresh.current) {
      refreshMappings();
      didRefresh.current = true;
    }
  }, [refreshMappings]);

  const handleSelectProtocol = (protocol) => {
    const testingMode = true; // always in test mode for admin
    const editingMode = false; // because user opens it for creating
    setSelectedProtocol(protocol);
    navigate(`/projects/${projectId}/protocols/${protocol.id}`, {
      state: { 
        protocol,
        testingMode,
        editingMode,
      }, 
    });
  };

  // Back navigation handler
  const handleBackToDashboard = () => {
    // Clean environment
    setSelectedProtocol(null);
    // Redirect to dashboard
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="protocol-dashboard-page">
      <div className="top-bar"> 
        <button
          className="btn-back"
          onClick={handleBackToDashboard}
        >
          ← {t("buttons.back", { ns: "common" })}
        </button>
        <LanguageSwitcher />
      </div>

      <Protocols onSelectProtocol={handleSelectProtocol} />
    </div>
  );
}
