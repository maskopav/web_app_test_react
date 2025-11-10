// src/components/ProtocolEditor/ProtocolForm.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import ProtocolLanguageSelector from "../ProtocolLanguageSelector";
import { getAllParams, getResolvedParams, translateTaskName } from "../../utils/translations";

export default function ProtocolForm({
  tasks,
  protocolData,
  setProtocolData,
  reorderMode,
  setReorderMode,
  onEdit,
  onDelete,
  onAddQuestionnaire,
  onSave,
  onShowProtocol,
  onDragStart,
  onDrop,
  dragIndex,
  nameError,
}) {
  const { t } = useTranslation(["admin", "tasks"]);

  const handleLanguageChange = (lang) => {
    setProtocolData((prev) => ({ ...prev, language: lang }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setProtocolData((prev) => ({ ...prev, name }));
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setProtocolData((prev) => ({ ...prev, description }));
  };

  return (
    <div className="protocol-section">
      <div className="protocol-header">
          <h3 className="protocol-current">
            {t("protocolEditor.currentProtocol")}
          </h3>

          <div className="protocol-values">
            <div className="protocol-field">
              <label className="protocol-label">
                {t("protocolDashboard.namePlaceholder")}:
              </label>
              <input
                type="text"
                className={`protocol-name-input ${nameError ? "name-input-error" : ""}`}
                placeholder={t("protocolDashboard.namePlaceholder")}
                value={protocolData?.name || ""}
                onChange={handleNameChange}
              />
              {nameError && <div className="error-text">{nameError}</div>}
            </div>

              <ProtocolLanguageSelector
                value={protocolData?.language || "en"}
                onChange={handleLanguageChange}
              />


            <div className="protocol-field">
              <label className="protocol-label">
                {t("protocolDashboard.descriptionPlaceholder")}:
              </label>
              <textarea
                className="protocol-description-input"
                placeholder={t(
                  "protocolDashboard.descriptionPlaceholder"
                )}
                value={protocolData?.description || ""}
                onChange={handleDescriptionChange}
              />
            </div>

          </div>

          <div className="button-block">
            <button className="btn-add-questionnaire" onClick={onAddQuestionnaire}>
              {t("protocolEditor.addQuestionnaire")}
            </button>

            <button
              className={`reorder-btn ${reorderMode ? "active" : ""}`}
              onClick={() => setReorderMode(!reorderMode)}
            >
              {reorderMode ? t("protocolEditor.finishReordering") : t("protocolEditor.reorderTasks")}
            </button>

          </div>
      </div>

      <ul className="protocol-list">
        {tasks.length === 0 ? (
          <li className="empty-protocol">
            <em>{t("protocolEditor.noTasks")}</em>
          </li>
        ) : (
          tasks.map((task, idx) => {
            const params = getAllParams(task.category);
            const resolved = getResolvedParams(task.category, task);

            return (
              <li
                key={idx}
                draggable={reorderMode}
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(idx)}
                className={`protocol-item ${dragIndex === idx ? "dragging" : ""}`}
              >
                <div className="protocol-row">
                  <div className="task-title">
                    {idx + 1}. {translateTaskName(task.category)}
                  </div>
                  {!reorderMode && (
                    <div className="action-buttons">
                      <span className="edit-icon" title={t("protocolEditor.tooltips.edit")} onClick={() => onEdit(idx)}>✎</span>
                      <span className="delete-icon" title={t("protocolEditor.tooltips.delete")} onClick={() => onDelete(idx)}>✖</span>
                    </div>
                  )}
                </div>
                <div className="param-inline">
                  {Object.entries(params).map(([key, p], i) => (
                    <span key={key}>
                      {i > 0 && " • "}
                      <strong>{p.label}:</strong> <em>{resolved[key] ?? task[key]}</em>
                    </span>
                  ))}
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className="button-row">
        <button className="button-show-tasks" onClick={onShowProtocol} disabled={!tasks.length || reorderMode}>
          {t("protocolEditor.showProtocol")}
        </button>
        <button className="button-save" 
          onClick={() => onSave()} 
          disabled={!tasks.length  || !protocolData?.name?.trim() || !!nameError || reorderMode}
        >
          {t("protocolEditor.saveProtocol")}
        </button>
      </div>
    </div>
  );
}
