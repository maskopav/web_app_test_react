import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMappings } from "../../context/MappingContext";
import ProtocolLanguageSelector from "../ProtocolLanguageSelector";
import { useProtocolActions } from "../../hooks/useProtocolActions";
import "./Protocols.css";

export default function Protocols({ onSelectProtocol }) {
  const { t } = useTranslation(["admin", "common"]);
  const { mappings, loading, error } = useMappings();
  const [protocolName, setProtocolName] = useState("");
  const [protocolDescription, setProtocolDescription] = useState("");
  const [protocolLanguage, setProtocolLanguage] = useState("en");
  const { viewProtocol, editProtocol, duplicateProtocol  } = useProtocolActions();

  const protocols = mappings?.protocols || [];
  const languages = mappings?.languages || [];

  const existingNames = protocols.map((p) => p.name.toLowerCase().trim());
  const nameExists = existingNames.includes(protocolName.toLowerCase().trim());

  const getLangName = (id) =>
    languages.find((l) => l.id === id)?.name || id;

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="protocols-container">
      <h2>{t("protocolDashboard.title")}</h2>

      {/* Create protocol section */}
      <div className="protocol-create card">
        <div className="protocol-create-header">
          <h3>{t("protocolDashboard.createNew")}</h3>
          <button
            className="btn-create"
            disabled={!protocolName.trim() || nameExists}
            onClick={() =>
              onSelectProtocol({ name: protocolName, language: protocolLanguage, description: protocolDescription })
            }
          >
            {t("protocolDashboard.buttons.create")}
          </button>
        </div>

        <div className="protocol-create-fields">
          <div className="input-wrapper">
            <label className="protocol-label">
                {t("protocolDashboard.namePlaceholder")}:
            </label>
            <input
              type="text"
              className={`protocol-input ${nameExists ? "input-error" : ""}`}
              placeholder={t("protocolDashboard.namePlaceholder")}
              value={protocolName}
              onChange={(e) => setProtocolName(e.target.value)}
            />
            {nameExists && (
              <div className="error-text">
                {t("protocolDashboard.nameExists")}
              </div>
            )}
          </div>
          
          <div className="input-wrapper">
            <label className="protocol-label">
              {t("protocolDashboard.descriptionPlaceholder")}:
            </label>
            <textarea
              className="protocol-input optional"
              placeholder={t("protocolDashboard.descriptionPlaceholder")}
              value={protocolDescription}
              onChange={(e) => setProtocolDescription(e.target.value)}
            />
          </div>
          
          <ProtocolLanguageSelector
            value={protocolLanguage}
            onChange={setProtocolLanguage}
          />
        </div>
      </div>

      {/* Protocol list */}
      <div className="protocol-list card">
        <div className="protocol-list-header">
          <h3>{t("protocolDashboard.existingProtocols")}</h3>
          {/* Future filter/search 
          <input
            className="protocol-filter"
            placeholder={t("protocolDashboard.search", "Filter protocols...")}
          />*/}
        </div>

        <div className="protocol-table-wrapper">
          <table className="protocol-table">
            <thead>
              <tr>
                <th>{t("protocolDashboard.table.name")}</th>
                <th>{t("protocolDashboard.table.language")}</th>
                <th>{t("protocolDashboard.table.description")}</th>
                <th>{t("protocolDashboard.table.version")}</th>
                <th>{t("protocolDashboard.table.questionnaire")}</th>
                <th>{t("protocolDashboard.table.createdAt")}</th>
                <th>{t("protocolDashboard.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {protocols.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    {t("protocolDashboard.noData")}
                  </td>
                </tr>
              ) : (
                protocols.map((p) => (
                  <tr key={p.id}>
                    <td className="highlighted">{p.name}</td>
                    <td>{getLangName(p.language_id)}</td>
                    <td>{p.description}</td>
                    <td>{p.version}</td>
                    <td>{p.questionnaires_id}</td>
                    <td>{p.created_at?.slice(0, 10)}</td>
                    <td className="actions">
                      <button
                        className="btn-view"
                        onClick={() => viewProtocol(p.id)}
                      >
                        {t("protocolDashboard.buttons.show")}
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => editProtocol(p.id)}
                      >
                        {t("protocolDashboard.buttons.edit")}
                      </button>
                      <button
                        className="btn-duplicate"
                        onClick={() =>
                          duplicateProtocol(p.id)
                        }
                      >
                        {t("protocolDashboard.buttons.duplicate")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
