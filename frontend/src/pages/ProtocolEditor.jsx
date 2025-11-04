// src/pages/ProtocolEditor.jsx
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import AdminTaskEditor from "../components/AdminTaskEditor";
import { ProtocolContext } from "../context/ProtocolContext";
import "./Pages.css"

export default function ProtocolEditorPage() {
  const { protocolId } = useParams();
  const { selectedProtocol } = useContext(ProtocolContext);
  const [configuredTasks, setConfiguredTasks] = useState([]);

  useEffect(() => {
    console.log("Loaded protocol", protocolId, selectedProtocol);
  }, [protocolId, selectedProtocol]);

  return (
    <div className="protocol-editor-page">
      <LanguageSwitcher />
      <AdminTaskEditor
        initialTasks={configuredTasks}
        onChange={setConfiguredTasks}
        onSave={() => console.log("Save protocol")}
      />
    </div>
  );
}
