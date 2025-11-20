// src/pages/ParticipantProtocolPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import ParticipantProtocolTable from "../components/ParticipantProtocol/ParticipantProtocol";
import { fetchParticipantProtocolView } from "../api/participantProtocols";
import "./Pages.css";

export default function ParticipantProtocolPage() {
  const { t } = useTranslation(["common"]);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const didLoad = useRef(false);

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

  const handleBack = () => navigate(`/projects/${projectId}`);

  return (
    <div className="protocol-dashboard-page">
      <div className="top-bar">
        <button className="btn-back" onClick={handleBack}>
          ← {t("buttons.back")}
        </button>
        <LanguageSwitcher />
      </div>

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
