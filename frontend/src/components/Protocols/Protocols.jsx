// src/components/Protocols/protocols.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMappings } from "../../context/MappingContext";
import "./Protocols.css";

/**
 * 3b) Protocols Page
 * Placeholder version — select or create a protocol by name.
 */
export default function Protocols({ onSelectProtocol }) {
  const { t } = useTranslation(["admin", "common"]);
  const { mappings, loading, error } = useMappings(); 
  const [protocolName, setProtocolName] = useState("");
  const [language, setLanguage] = useState("en");

  const protocols = mappings?.protocols || [];
  const languages = mappings?.languages || [];
  console.log(protocols);

  const getLangName = (id) =>
    languages.find((l) => l.id === id)?.name || id;

  return (
    <div className="protocols-container">
      <h2>{t("protocolsPage.title", "Protocols Management")}</h2>

      {/* Create new protocol */}
      <div className="protocol-create">
        <h3>{t("protocolsPage.createNew", "Create New Protocol")}</h3>
        <input
          type="text"
          value={protocolName}
          onChange={(e) => setProtocolName(e.target.value)}
          placeholder={t("protocolsPage.namePlaceholder", "Enter protocol name")}
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="cs">Czech</option>
          {/* Later — populate from DB */}
        </select>

        <button
          onClick={() =>
            onSelectProtocol({ name: protocolName, language })
          }
          disabled={!protocolName.trim()}
        >
          {t("protocolsPage.continue", "Continue to editor")}
        </button>
      </div>

      {/* Real protocols from DB */}
      <div className="protocol-list">
        <h3>{t("protocolsPage.existing", "Existing Protocols")}</h3>
        <table>
          <thead>
            <tr>
              <th>{t("protocolsPage.name", "Name")}</th>
              <th>{t("protocolsPage.language", "Language")}</th>
              <th>{t("protocolsPage.description", "Description")}</th>
              <th>{t("protocolsPage.version", "Version")}</th>
              <th>{t("protocolsPage.questionnaires_id", "Questionnaire")}</th>
              <th>{t("protocolsPage.created_at", "Created at")}</th>
              <th>{t("protocolsPage.created_by", "Created by")}</th>
              <th>{t("protocolsPage.updated_at", "Updated at")}</th>
              <th>{t("protocolsPage.updated_by", "Updated by")}</th>
              <th>{t("protocolsPage.actions", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {protocols.length === 0 ? (
              <tr>
                <td colSpan="10">{t("protocolsPage.noData", "No protocols found")}</td>
              </tr>
            ) : (
              protocols.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{getLangName(p.language_id)}</td> 
                  <td>{p.description}</td> 
                  <td>{p.version}</td> 
                  <td>{p.questionnaires_id}</td> 
                  <td>{p.created_at}</td> 
                  <td>{p.created_by}</td> 
                  <td>{p.updated_at}</td> 
                  <td>{p.updated_by}</td> 
                  <td>
                    <button onClick={() => onSelectProtocol(p)}>
                      {t("protocolsPage.edit", "Edit")}
                    </button>
                    <button onClick={() => onSelectProtocol(p)}>
                      {t("protocolsPage.createNew", "Create new based on this protocol")}
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
}
