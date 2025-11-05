// src/pages/ProtocolDashboardPage.jsx
import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProtocolContext } from "../context/ProtocolContext";
import Protocols from "../components/Protocols/Protocols";
import "./Pages.css"

export default function ProtocolDashboardPage() {
  const { setSelectedProtocol } = useContext(ProtocolContext);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleSelectProtocol = (protocol) => {
    setSelectedProtocol(protocol);
    navigate(`/projects/${projectId}/protocols/${protocol.id}`, {
      state: { protocol }, 
    });
  };

  return (
    <div className="protocol-dashboard-page">
      <Protocols onSelectProtocol={handleSelectProtocol} />
    </div>
  );
}
