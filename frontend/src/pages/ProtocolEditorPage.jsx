// src/pages/ProtocolEditorPage.jsx
import React, { useState, useContext, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import ProtocolEditor from "../components/ProtocolEditor";
import { ProtocolContext } from "../context/ProtocolContext";
import "./Pages.css"

export default function ProtocolEditorPage() {
  const { projectId, protocolId } = useParams();
  const { state } = useLocation();
  const { selectedProtocol, setSelectedProtocol } = useContext(ProtocolContext);

  const [configuredTasks, setConfiguredTasks] = useState([]);
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

  return (
    <div className="protocol-editor-page">
      <LanguageSwitcher />
      <ProtocolEditor
        initialTasks={configuredTasks}
        onChange={setConfiguredTasks}
        protocol={protocolData}
        onSave={() => console.log("Save protocol", protocolId)}
      />
    </div>
  );
}
