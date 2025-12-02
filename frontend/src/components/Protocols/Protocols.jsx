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
  const { viewProtocol, editProtocol, duplicateProtocol } = useProtocolActions();

  const protocols = mappings?.protocols || [];
  const languages = mappings?.languages || [];

  const existingNames = protocols.map((p) => p.name.toLowerCase().trim());
  const nameExists = existingNames.includes(protocolName.toLowerCase().trim());

  const getLangName = (id) =>
    languages.find((l) => l.id === id)?.name || id;

  const currentProtocols = protocols.filter(p => p.is_current == 1);
  const archivedProtocols = protocols.filter(p => p.is_current != 1);

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Internal helper for table sections
  const ProtocolTableSection = ({ list, title, allowEdit }) => (
    <div className="protocol-section card">
      <h4 className="protocol-section-header">{title}</h4>
      <div className="protocol-table-scroll-area">
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
            {list.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  {t("protocolDashboard.noData", "No protocols found.")}
                </td>
              </tr>
            ) : (
              list.map((p) => (
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
                      title={t("protocolDashboard.buttons.show")}
                    >
                      {t("protocolDashboard.buttons.show")}
                    </button>
                    {allowEdit && (
                      <button
                        className="btn-edit"
                        onClick={() => editProtocol(p.id)}
                        title={t("protocolDashboard.buttons.edit")}
                      >
                        {t("protocolDashboard.buttons.edit")}
                      </button>
                    )}
                    <button
                      className="btn-duplicate"
                      onClick={() => duplicateProtocol(p.id)}
                      title={t("protocolDashboard.buttons.duplicate")}
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
  );

  return (
    <div className="protocols-container">
      {/* Header Title - Smaller padding */}
      <h2 className="page-title">{t("protocolDashboard.title")}</h2>

      {/* Create Section - Header with Button + Inputs Row */}
      <div className="card compact-create">
        {/* Header Row: Title on Left, Button on Right */}
        <div className="protocol-section-header create-header-row">
          <span>{t("protocolDashboard.createNew")}</span>
          <button
            className="btn-create"
            disabled={!protocolName.trim() || nameExists}
            onClick={() =>
              onSelectProtocol({
                name: protocolName,
                language: protocolLanguage,
                description: protocolDescription,
              })
            }
          >
            + {t("protocolDashboard.buttons.create")}
          </button>
        </div>

        {/* Inputs Row */}
        <div className="create-inputs-container">
          <div className="create-inputs-row">
            <div className="input-group name-group">
              <label>{t("protocolDashboard.namePlaceholder")}:</label>
              <input
                type="text"
                className={`protocol-input ${nameExists ? "input-error" : ""}`}
                value={protocolName}
                onChange={(e) => setProtocolName(e.target.value)}
              />
            </div>

            <div className="input-group grow">
              <label>{t("protocolDashboard.descriptionPlaceholder")}:</label>
              <input
                type="text"
                className="protocol-input"
                value={protocolDescription}
                onChange={(e) => setProtocolDescription(e.target.value)}
              />
            </div>

            <div className="input-group lang-group">
              <ProtocolLanguageSelector
                value={protocolLanguage}
                onChange={setProtocolLanguage}
              />
            </div>
          </div>
          
          {nameExists && (
            <div className="error-text">
              {t("protocolDashboard.nameExists")}
            </div>
          )}
        </div>
      </div>

      {/* Two Separate Tables */}
      <ProtocolTableSection
        list={currentProtocols}
        title={t("protocolDashboard.currentProtocols")}
        allowEdit={true}
      />

      <ProtocolTableSection
        list={archivedProtocols}
        title={t("protocolDashboard.archivedProtocols")}
        allowEdit={false}
      />
    </div>
  );
}