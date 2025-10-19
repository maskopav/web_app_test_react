// src/components/AdminTaskEditor/AdminTaskEditor.jsx
import React, { useState, useMemo } from "react";
import { collectInputPaths } from "./helpers";
import Modal from "./Modal";
import { useTranslation } from "react-i18next";
import {
  translateTaskName,
  getAllParams,
  getDefaultParams,
  getResolvedParams,
  translateTaskDescription,
} from "../../utils/translations";
import InfoTooltip from "./InfoTooltip";
import { taskBaseConfig} from "../../config/tasksBase.js"
import "./AdminTaskEditor.css";

export function AdminTaskEditor({ initialTasks = [], onSave = () => {}, onChange = () => {} }) {
  const { t } = useTranslation(["admin", "tasks", "common"]); // use all namespaces

  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [creatingNewTask, setCreatingNewTask] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  function startCreatingTask(category) {
    const defaults = getDefaultParams(category);
    const base = taskBaseConfig[category];
    if (!base) return;

    const task = {
      type: base.type,
      category,
      recording: base.recording,
      ...defaults,
    };
    
    setCreatingNewTask(true);
    setEditingData(task);
  }

  function addTaskToProtocol(taskData) {
    setTasks((prev) => {
      const next = [...prev, taskData];
      onChange(next);
      return next;
    });
  }

  function updateTask(index, patch) {
    setTasks((prev) => {
      const next = prev.map((t, i) => (i === index ? { ...t, ...patch } : t));
      onChange(next);
      return next;
    });
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
      onChange(updated);
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
        <div className="task-section">
          <h3>{t("availableTasks")}</h3>

          <ul className="task-list">
          {Object.keys(taskBaseConfig).map((cat) => {
            const translatedName = translateTaskName(cat);
            const description = translateTaskDescription(cat);
            const params = getAllParams(cat);
            const defaults = getDefaultParams(cat);
            return (
              <div key={cat} className="task-option" onClick={() => startCreatingTask(cat)}>
                <div className="task-title">
                  {translatedName}
                  <InfoTooltip text={description} /> 
                </div>
                <div className="task-params">
                  {/* Inline parameter summary (compact like in Current Protocol) */}
                  <div className="param-inline">
                    {Object.entries(params).map(([pKey, pInfo], i) => {
                      const defaultVal = defaults?.[pKey] ?? pInfo.default ?? "";
                      // If enum, show the translated label for the default key; else show the literal value
                      const enumOption = (pInfo.values || []).find((v) => v.key === defaultVal);
                      const shown = enumOption ? enumOption.label : String(defaultVal);
                      return (
                        <span key={pKey}>
                          {i > 0 && " • "}
                          <strong>{pInfo.label}:</strong>{" "}
                          <em>{shown}</em>
                        </span>
                      );
                    })}
                  </div>

                </div>
              </div>
            );
          })}
          </ul>
        </div>

        {/* Right column */}
        <div className="protocol-section">
          <div className="protocol-header">
            <h3>{t("currentProtocol")}</h3>
            <button
              className={`reorder-btn ${reorderMode ? "active" : ""}`}
              onClick={() => setReorderMode(!reorderMode)}
            >
              {reorderMode ? t("finishReordering") : t("reorderTasks")}
            </button>
          </div>

          <ul className="protocol-list">
            {tasks.length === 0 ? (
              <li className="empty-protocol">
                <em>{t("noTasks")}</em>
              </li>
            ) : (
              tasks.map((task, idx) => {
              const params = getAllParams(task.category);
              console.log(`Params for task ${idx} (${task.category}):`, params);

              // Build live params reflecting in-progress edits for this row
              const paramKeys = Object.keys(params);
              const liveParams = Object.fromEntries(
                paramKeys.map((k) => [
                  k,
                  (idx === editingTask && editingData && editingData[k] !== undefined)
                    ? editingData[k]
                    : (task[k] !== undefined ? task[k] : params[k].default)
                ])
              );

              const resolvedParams = getResolvedParams(task.category, liveParams);
              console.log(`Resolved params for task ${idx} (${task.category}):`, resolvedParams);
              return (
                <li
                  key={idx}
                  draggable={reorderMode}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className={`protocol-item ${dragIndex === idx ? "dragging" : ""}`}
                >
                  <div className="protocol-row">
                    <div className="task-title">
                      {idx + 1}. {translateTaskName(task.category)}
                    </div>
                    {!reorderMode && (
                      <div className="action-buttons">
                        <span
                          className="edit-icon"
                          title={t("tooltips.edit")}
                          onClick={() => setEditingTask(idx)}
                        >
                          ✎
                        </span>
                        <span
                          className="delete-icon"
                          title={t("tooltips.delete")}
                          onClick={() =>
                            setTasks((prev) => {
                              const next = prev.filter((_, i) => i !== idx);
                              onChange(next);
                              return next;
                            })
                          }
                        >
                          ✖
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Inline parameter summary */}
                  <div className="param-inline">
                    {Object.entries(params).map(([pKey, pInfo], i) => {
                      // Prefer translated/expanded live value; fall back to raw live value or default
                      const val = resolvedParams[pKey] ?? liveParams[pKey] ?? pInfo.default ?? "";
                      return (
                        <span key={pKey}>
                          {i > 0 && " • "}
                          <strong>{pInfo.label}:</strong>{" "}
                          <em>{String(val)}</em>
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })
            )}
          </ul>

      <div className="button-row">
        <button
          className="button-done"
          onClick={() => onSave(tasks)}
          disabled={tasks.length === 0}
        >
          {t("done")}
        </button>
      </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editingTask != null || creatingNewTask}
        onClose={() => {
          // just close without saving
          setEditingTask(null);
          setEditingData(null);
          setCreatingNewTask(false);
        }}
        onSave={() => {
          if (creatingNewTask && editingData) {
            // Add new task to protocol
            addTaskToProtocol(editingData);
            setCreatingNewTask(false);
          } else if (editingTask != null && editingData) {
            // Update existing task
            setTasks(prev =>
              prev.map((t, i) => (i === editingTask ? { ...t, ...editingData } : t))
            );
            setEditingTask(null);
          }
          setEditingData(null);
        }}
      >
        {(editingTask != null || creatingNewTask) && (() => {
          const category = creatingNewTask ? editingData?.category : tasks[editingTask]?.category;
          const params = getAllParams(category);

          // Initialize editing data when modal opens
          if (!editingData) {
            if (creatingNewTask) {
              return null; // This shouldn't happen, but just in case
            }
            const currentTask = tasks[editingTask];
            setEditingData({ ...currentTask });
            return null; // prevent rendering until initialized
          }

          return (
            <div className="edit-window">
              <h2>
                {creatingNewTask 
                  ? t("addTask", { category: translateTaskName(category) })
                  : t("editTask", { category: translateTaskName(category) })
                }
              </h2>
              {Object.keys(params).map((param) => {
                const paramInfo = params[param];

                // Use either current value or fallback to default from params
                const currentValue = editingData[param];
                const value =
                  currentValue !== undefined && currentValue !== null
                    ? currentValue
                    : paramInfo.default ?? "";


                const hasEnumValues = paramInfo.values && paramInfo.values.length > 0;
                const isNumeric = paramInfo.type === "number";

                return (
                  <div key={param} className="form-group">
                    <label>{paramInfo.label}</label>
                    {hasEnumValues ? (
                      <select
                        value={value}
                        onChange={(e) => 
                          setEditingData((prev) => ({
                            ...prev,
                            [param]: e.target.value,
                          }))
                        }
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
                          setEditingData((prev) => ({
                            ...prev,
                            [param]: isNumeric
                              ? Number(e.target.value)
                              : e.target.value,
                          }))
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
