// components/AdminTaskEditor/AdminTaskEditor.jsx - Main component
import React, { useState, useMemo } from "react";
import { collectInputPaths } from "./helpers";
import Modal from "./Modal";
import taskParams from "../../config/taskParams.json";
import "./AdminTaskEditor.css";

export const TASK_FIELD_SCHEMA = {
  phonation: [{ name: "duration", label: "Duration (seconds)", type: "int" }],
  syllableRepeating: [
    { name: "repeats", label: "Number of repeats", type: "int" },
    { name: "syllable", label: "Syllable", type: "translation", path: "syllables" },
  ],
  retelling: [{ name: "story", label: "Story", type: "translation", path: "stories" }],
  reading: [{ name: "text", label: "Text", type: "translation", path: "texts" }],
  monologue: [
    { name: "topic", label: "Topic", type: "translation", path: "topics" },
    { name: "duration", label: "Duration (seconds)", type: "int" },
  ],
};


export function AdminTaskEditor({ i18nJson = {}, initialTasks = [], onSave = () => {} }) {
  const inputOptions = useMemo(() => collectInputPaths(i18nJson), [i18nJson]);
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  function addTask(category) {
    const defaults = taskParams[category]?.defaults || {};
    const task = {
      type: "voice",
      category,
      titleKey: `tasks.${category}.title`,
      subtitleKey: `tasks.${category}.subtitle`,
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
  function handleDragOver(e) { e.preventDefault(); }

  return (
    <div className="admin-container">
      <h2>Admin Task Editor</h2>

      <div className="admin-grid">
        {/* Left column */}
        <div className="task-list">
          <h3>Available tasks:</h3>
          {Object.keys(taskParams).map((cat) => (
          <div key={cat} className="task-option" onClick={() => addTask(cat)}>
            <div className="task-title">{cat}</div>
            <div className="task-params">
              ({(taskParams[cat].params || []).join(", ")})
            </div>
          </div>
        ))}
        </div>

        {/* Right column */}
        <div className="protocol-section">
          <h3>Current protocol:</h3>
          {tasks.length === 0 && <p className="empty-text">No tasks added yet.</p>}
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
                  <strong>{idx + 1}. {task.category}</strong>
                  {!reorderMode && (
                    <div className="action-buttons">
                      <span
                        className="edit-icon"
                        title="Edit task"
                        onClick={() => setEditingTask(idx)}
                      >✎</span>
                      <span
                        className="delete-icon"
                        title="Remove task"
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
              {reorderMode ? "Finish Reordering" : "Reorder Tasks"}
            </button>
            <button className="button-done" onClick={() => onSave(tasks)}>Done</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editingTask != null}
        onClose={() => setEditingTask(null)}
        onSave={() => setEditingTask(null)} // you can later replace with save logic if needed
      >
        {editingTask != null && (() => {
          const category = tasks[editingTask].category;
          const params = taskParams[category]?.params || [];
          const defaults = taskParams[category]?.defaults || {};
          const currentTask = tasks[editingTask];

          return (
            <div className="edit-window">
              <h2>Edit task: {category}</h2>
              {params.map((param) => {
                const value = currentTask[param] ?? defaults[param] ?? "";
                const isNumeric = typeof value === "number" || /^[0-9.]+$/.test(value);
                return (
                  <div key={param} className="form-group">
                    <label>{param}</label>
                    <input
                      type={isNumeric ? "number" : "text"}
                      value={value}
                      onChange={(e) =>
                        updateTask(editingTask, {
                          [param]: isNumeric ? Number(e.target.value) : e.target.value,
                        })
                      }
                    />
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