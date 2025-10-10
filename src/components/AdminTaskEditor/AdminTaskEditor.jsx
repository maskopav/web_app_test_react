// src/components/AdminTaskEditor/AdminTaskEditor.jsx
import React, { useState, useMemo } from "react";
import { collectInputPaths } from "./helpers";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";
import {
  translateTaskName,
  translateParamName,
  translateParamValue,
  getAllParams,
  getDefaultParams,
} from "../../utils/translations";
import { taskBaseConfig} from "../../config/tasksBase.js"
import "./AdminTaskEditor.css";

export function AdminTaskEditor({ i18nJson = {}, initialTasks = [], onSave = () => {} }) {
  const { t } = useTranslation(["admin", "tasks", "common"]); // use all namespaces
  const inputOptions = useMemo(() => collectInputPaths(i18nJson), [i18nJson]);

  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  function addTask(category) {
    const defaults = getDefaultParams(category);
    const base = taskBaseConfig[category];
    if (!base) return;

    const task = {
      type: base.type,
      category,
      recording: base.recording,
      ...defaults,
    };
    setTasks((prev) => [...prev, task]);
  }

  function updateTask(index, patch) {
    setTasks((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDrop(targetIndex) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setTasks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
    setDragIndex(null);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="admin-container">
      <h2>{t("title")}</h2>

      <div className="admin-grid">
        {/* Left column */}
        <div className="task-list">
          <h3>{t("availableTasks")}</h3>
          {Object.keys(taskBaseConfig).map((cat) => {
            const translatedName = translateTaskName(cat);
            const params = getAllParams(cat);
            console.log("All params - getAllParams method.")
            console.log(params);
            const paramLabels = Object.values(params).map((p) => p.label);

            return (
              <div key={cat} className="task-option" onClick={() => addTask(cat)}>
                <div className="task-title">{translatedName}</div>
                <div className="task-params">
                  ({paramLabels.join(", ")})
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="protocol-section">
          <h3>{t("currentProtocol")}</h3>
          {tasks.length === 0 && <p className="empty-text">{t("noTasks")}</p>}

          <ul className="protocol-list">
            {tasks.map((task, idx) => (
              <li
                key={idx}
                draggable={reorderMode}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(idx)}
                className={`protocol-item ${dragIndex === idx ? "dragging" : ""}`}
              >
                <div className="protocol-row">
                  <strong>{idx + 1}. {translateTaskName(task.category)}</strong>
                  {!reorderMode && (
                    <div className="action-buttons">
                      <span
                        className="edit-icon"
                        title={t("tooltips.edit")}
                        onClick={() => setEditingTask(idx)}
                      >✎</span>
                      <span
                        className="delete-icon"
                        title={t("tooltips.delete")}
                        onClick={() =>
                          setTasks((prev) => prev.filter((_, i) => i !== idx))
                        }
                      >✖</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="button-row">
            <button onClick={() => setReorderMode(!reorderMode)}>
              {reorderMode ? t("finishReordering") : t("reorderTasks")}
            </button>
            <button className="button-done" onClick={() => onSave(tasks)}>{t("done")}</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editingTask != null}
        onClose={() => setEditingTask(null)}
        onSave={() => setEditingTask(null)}
      >
        {editingTask != null && (() => {
          const category = tasks[editingTask].category;
          const params = getAllParams(category);
          const currentTask = tasks[editingTask];

          return (
            <div className="edit-window">
              <h2>{t("editTask", { category: translateTaskName(category) })}</h2>
              {Object.keys(params).map((param) => {
                const paramInfo = params[param];
                const value = currentTask[param] ?? "";
                const hasEnumValues = paramInfo.values && paramInfo.values.length > 0;
                const isNumeric = typeof value === "number" || /^[0-9.]+$/.test(value);

                return (
                  <div key={param} className="form-group">
                    <label>{paramInfo.label}</label>
                    {hasEnumValues ? (
                      <select
                        value={value}
                        onChange={(e) => updateTask(editingTask, { [param]: e.target.value })}
                      >
                        {paramInfo.values.map((v) => (
                          <option key={v.key} value={v.key}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={isNumeric ? "number" : "text"}
                        value={value}
                        onChange={(e) =>
                          updateTask(editingTask, {
                            [param]: isNumeric ? Number(e.target.value) : e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
