import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMappings } from "../../context/MappingContext";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import ProtocolLanguageSelector from "../ProtocolLanguageSelector";
import "./Protocols.css";

export default function Protocols({ onSelectProtocol }) {
  const { t } = useTranslation(["admin", "common"]);
  const { mappings, loading, error } = useMappings();
  const [protocolName, setProtocolName] = useState("");
  const [protocolDescription, setProtocolDescription] = useState("");
  const [protocolLanguage, setProtocolLanguage] = useState("en");

  const protocols = mappings?.protocols || [];
  const languages = mappings?.languages || [];

  const getLangName = (id) =>
    languages.find((l) => l.id === id)?.name || id;

  if (loading) return <p>{t("loading")}</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="protocols-container">
      <div className="protocols-header">
        <h2>{t("protocolsPage.title", "Protocols Management")}</h2>
        <LanguageSwitcher />
      </div>

      {/* Create protocol section */}
      <div className="protocol-create card">
        <div className="protocol-create-header">
          <h3>{t("protocolsPage.createNew", "Create New Protocol")}</h3>
          <button
            className="btn-create"
            disabled={!protocolName.trim()}
            onClick={() =>
              onSelectProtocol({ name: protocolName, language: protocolLanguage, description: protocolDescription })
            }
          >
            {t("protocolsPage.create", "Create Protocol")}
          </button>
        </div>

        <div className="protocol-create-fields">
          <input
            type="text"
            className="protocol-input"
            placeholder={t("protocolsPage.namePlaceholder", "Protocol name")}
            value={protocolName}
            onChange={(e) => setProtocolName(e.target.value)}
          />
          <textarea
            className="protocol-input optional"
            placeholder={t("protocolsPage.descriptionPlaceholder", "Description (optional)")}
            value={protocolDescription}
            onChange={(e) => setProtocolDescription(e.target.value)}
          />
          <ProtocolLanguageSelector
            value={protocolLanguage}
            onChange={setProtocolLanguage}
          />
        </div>
      </div>

      {/* Protocol list */}
      <div className="protocol-list card">
        <div className="protocol-list-header">
          <h3>{t("protocolsPage.existing", "Existing Protocols")}</h3>
          {/* Future filter/search 
          <input
            className="protocol-filter"
            placeholder={t("protocolsPage.search", "Filter protocols...")}
          />*/}
        </div>

        <div className="protocol-table-wrapper">
          <table className="protocol-table">
            <thead>
              <tr>
                <th>{t("protocolsPage.name", "Name")}</th>
                <th>{t("protocolsPage.language", "Language")}</th>
                <th>{t("protocolsPage.description", "Description")}</th>
                <th>{t("protocolsPage.version", "Version")}</th>
                <th>{t("protocolsPage.questionnaires_id", "Questionnaire")}</th>
                <th>{t("protocolsPage.created_at", "Created at")}</th>
                <th>{t("protocolsPage.actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {protocols.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    {t("protocolsPage.noData", "No protocols found")}
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
                        onClick={() => onSelectProtocol(p)}
                      >
                        {t("protocolsPage.show", "Show")}
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => onSelectProtocol(p)}
                      >
                        {t("protocolsPage.edit", "Edit")}
                      </button>
                      <button
                        className="btn-duplicate"
                        onClick={() =>
                          onSelectProtocol({
                            ...p,
                            id: undefined,
                            name: `${p.name} Copy`,
                          })
                        }
                      >
                        {t("protocolsPage.duplicate", "Duplicate")}
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
