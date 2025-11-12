// src/pages/ProtocolDashboardPage.jsx
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import { ProtocolContext } from "../context/ProtocolContext";
import Protocols from "../components/Protocols/Protocols";
import "./Pages.css"

export default function ProtocolDashboardPage() {
  const { t } = useTranslation(["common"]);
  const { setSelectedProtocol } = useContext(ProtocolContext);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleSelectProtocol = (protocol) => {
    setSelectedProtocol(protocol);
    navigate(`/projects/${projectId}/protocols/${protocol.id}`, {
      state: { protocol }, 
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
