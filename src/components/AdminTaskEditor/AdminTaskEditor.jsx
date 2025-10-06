import React, { useState, useMemo } from "react";
import { collectInputPaths } from "./helpers";
import Modal from "./Modal";
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

export const DEFAULTS = {
  phonation: { duration: 10 },
  syllableRepeating: { repeats: 5, syllable: "syllables.default" },
  retelling: { story: "stories.default" },
  reading: { text: "texts.default" },
  monologue: { topic: "topics.default", duration: 60 },
};



export function AdminTaskEditor({ i18nJson = {}, initialTasks = [], onSave = () => {} }) {
  const inputOptions = useMemo(() => collectInputPaths(i18nJson), [i18nJson]);
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  function addTask(category) {
    const defaults = DEFAULTS[category];
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
          {Object.keys(DEFAULTS).map((cat) => (
            <div key={cat} className="task-item" onClick={() => addTask(cat)}>
              {cat}
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
            <button onClick={() => onSave(tasks)}>Done</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={editingTask != null} onClose={() => setEditingTask(null)}>
        {editingTask != null && (
          <>
            <h2>Edit task: {tasks[editingTask].category}</h2>
            {(TASK_FIELD_SCHEMA[tasks[editingTask].category] || []).map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.label}</label>
                {field.type === "int" && (
                  <input
                    type="number"
                    value={tasks[editingTask][field.name] ?? ""}
                    onChange={(e) =>
                      updateTask(editingTask, { [field.name]: Number(e.target.value) })
                    }
                  />
                )}
                {field.type === "translation" && (
                  <select
                    value={tasks[editingTask][field.name] ?? ""}
                    onChange={(e) =>
                      updateTask(editingTask, { [field.name]: e.target.value })
                    }
                  >
                    <option value="">-- select --</option>
                    {(inputOptions[field.path] || []).map((o) => (
                      <option key={o.key} value={`${field.path}.${o.key}`}>
                        {o.value}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            <div className="modal-actions">
              <button onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}