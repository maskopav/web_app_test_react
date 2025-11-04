// src/components/AdminTaskEditor/ProtocolEditor.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import ProtocolLanguageSelector from "../ProtocolLanguageSelector";
import { getAllParams, getResolvedParams, translateTaskName } from "../../utils/translations";

export default function ProtocolEditor({
  tasks,
  protocolLanguage,
  setProtocolLanguage,
  reorderMode,
  setReorderMode,
  onEdit,
  onDelete,
  onAddQuestionnaire,
  onSave,
  onDragStart,
  onDrop,
  dragIndex,
}) {
  const { t } = useTranslation(["admin", "tasks"]);

  return (
    <div className="protocol-section">
      <div className="protocol-header">
        <h3>{t("currentProtocol")}</h3>
        <div className="header-controls">
          <ProtocolLanguageSelector
            value={protocolLanguage}
            onChange={setProtocolLanguage}
          />

          <button className="btn-add-questionnaire" onClick={onAddQuestionnaire}>
            {t("addQuestionnaire")}
          </button>

          <button
            className={`reorder-btn ${reorderMode ? "active" : ""}`}
            onClick={() => setReorderMode(!reorderMode)}
          >
            {reorderMode ? t("finishReordering") : t("reorderTasks")}
          </button>
        </div>
      </div>

      <ul className="protocol-list">
        {tasks.length === 0 ? (
          <li className="empty-protocol">
            <em>{t("noTasks")}</em>
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
                      <span className="edit-icon" title={t("tooltips.edit")} onClick={() => onEdit(idx)}>✎</span>
                      <span className="delete-icon" title={t("tooltips.delete")} onClick={() => onDelete(idx)}>✖</span>
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
        <button className="button-show-tasks" onClick={() => onSave(tasks)} disabled={!tasks.length}>
          {t("showProtocol")}
        </button>
        <button className="button-save" onClick={() => onSave()} disabled={!tasks.length}>
          {t("saveProtocol")}
        </button>
      </div>
    </div>
  );
}
