import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { taskBaseConfig } from "../../config/tasksBase";
import {
  getDefaultParams,
} from "../../utils/translations";

import TaskList from "./TaskList";
import ProtocolEditor from "./ProtocolEditor";
import TaskModal from "./TaskModal";
import QuestionnaireModal from "./QuestionnaireModal";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";

import "./AdminTaskEditor.css";

export function AdminTaskEditor({ initialTasks = [], onSave = () => {}, onChange = () => {} }) {
  const { t } = useTranslation(["admin", "tasks", "common"]);

  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [creatingNewTask, setCreatingNewTask] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [protocolLanguage, setProtocolLanguage] = useState("en");

  function startCreatingTask(category) {
    const base = taskBaseConfig[category];
    if (!base) return;
    const task = {
      type: base.type,
      category,
      recording: base.recording,
      ...getDefaultParams(category),
    };
    setEditingData(task);
    setCreatingNewTask(true);
  }

  function addTaskToProtocol(taskData) {
    setTasks((prev) => {
      const next = [...prev, taskData];
      onChange(next);
      return next;
    });
  }

  function updateTask(updatedData, index) {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...updatedData } : t))
    );
    onChange(tasks);
  }

  // Drag & Drop
  const handleDragStart = (i) => setDragIndex(i);
  const handleDrop = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    setTasks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);
      onChange(updated);
      return updated;
    });
    setDragIndex(null);
  };

  return (
    <div className="admin-container">
      <h2>{t("title")}</h2>

      <div className="admin-grid">
        <TaskList onCreate={startCreatingTask} />

        <ProtocolEditor
          tasks={tasks}
          protocolLanguage={protocolLanguage}
          setProtocolLanguage={setProtocolLanguage}
          reorderMode={reorderMode}
          setReorderMode={setReorderMode}
          onEdit={setEditingTask}
          onDelete={(i) =>
            setTasks((prev) => {
              const next = prev.filter((_, idx) => idx !== i);
              onChange(next);
              return next;
            })
          }
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          dragIndex={dragIndex}
          onAddQuestionnaire={() => setShowQuestionnaireModal(true)}
          onSave={onSave}
        />
      </div>

      {/* Global language switcher (editor UI language) */}
      <div className="editor-language">
        <LanguageSwitcher />
      </div>

      {/* Task edit/create modal */}
      <TaskModal
        open={editingTask != null || creatingNewTask}
        creatingNewTask={creatingNewTask}
        editingTask={editingTask}
        editingData={editingData}
        tasks={tasks}
        setEditingData={setEditingData}
        onClose={() => {
          setEditingTask(null);
          setEditingData(null);
          setCreatingNewTask(false);
        }}
        onSave={(data) => {
          if (creatingNewTask) addTaskToProtocol(data);
          else if (editingTask != null) updateTask(data, editingTask);
          setEditingTask(null);
          setEditingData(null);
          setCreatingNewTask(false);
        }}
      />

      <QuestionnaireModal
        open={showQuestionnaireModal}
        onClose={() => setShowQuestionnaireModal(false)}
        onSave={() => setShowQuestionnaireModal(false)}
      />
    </div>
  );
}
