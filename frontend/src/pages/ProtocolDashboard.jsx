// src/pages/ProtocolDashboard.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import AdminTaskEditor from "../components/AdminTaskEditor";
import Protocols from "../components/Protocols/Protocols";
import { ProtocolContext } from "../context/ProtocolContext";
import "./Pages.css"

export default function ProtocolDashboard() {
  const { selectedProtocol, setSelectedProtocol } = useContext(ProtocolContext);
  const [configuredTasks, setConfiguredTasks] = useState([]);
  const { projectId } = useParams();
  const currentProject = projectId || "demo"; // fallback for test
  const navigate = useNavigate();

  const handleSelectProtocol = (protocol) => {
    setSelectedProtocol(protocol);
    navigate(`/projects/${projectId}/protocols/${protocol.id}`);
  };

  return (
    <div className="protocol-dashboard-page">
      <Protocols onSelectProtocol={handleSelectProtocol} />
    </div>
  );
}
