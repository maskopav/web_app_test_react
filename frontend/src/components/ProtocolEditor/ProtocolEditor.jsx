// src/components/ProtocolEditor/ProtocolEditor.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { taskBaseConfig } from "../../config/tasksBase";
import { getDefaultParams } from "../../utils/translations"; 

import TaskList from "./TaskList";
import ProtocolForm from "./ProtocolForm";
import TaskModal from "./TaskModal";
import QuestionnaireModal from "./QuestionnaireModal";
import { LanguageSwitcher } from "../LanguageSwitcher/LanguageSwitcher";
import { useMappings } from "../../context/MappingContext";
import { useProtocolManager } from "../../hooks/useProtocolManager";
import { ProtocolContext } from "../../context/ProtocolContext";

import "./ProtocolEditor.css";

export function ProtocolEditor({ initialTasks = [], onSave = () => {}, onChange = () => {}, protocol }) {
  const { t } = useTranslation(["admin", "tasks", "common"]);
  const navigate = useNavigate();
  const { mappings, loading, error } = useMappings();
  const { selectedProtocol, setSelectedProtocol } = useContext(ProtocolContext);
  const { saveNewProtocol } = useProtocolManager();

  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [creatingNewTask, setCreatingNewTask] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);

  const [protocolData, setProtocolData] = useState(protocol || selectedProtocol || {});

  const protocols = mappings?.protocols || [];
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (protocol) {
      setProtocolData(protocol);
      setSelectedProtocol(protocol);
    }
  }, [protocol, setSelectedProtocol]);

  // Whenever local protocolData changes, reflect it globally
  useEffect(() => {
    if (protocolData) {
      setSelectedProtocol(protocolData);
    }
  }, [protocolData, setSelectedProtocol]);  

  useEffect(() => {
    if (!protocolData?.name) {
      setNameError("");
      return;
    }
  
    const existingNames = protocols
      .filter(p => p.id !== protocolData.id) // ignore itself if editing
      .map(p => p.name.toLowerCase().trim());
  
    if (existingNames.includes(protocolData.name.toLowerCase().trim())) {
      setNameError("A protocol with this name already exists.");
    } else {
      setNameError("");
    }
  }, [protocolData?.name, protocols]);

  useEffect(() => {
    if (onChange) {
      onChange(tasks);
    }
  }, [tasks, onChange]);  

  if (loading) {
    return <p>Loading mappings...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

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
    setTasks((prev) => [...prev, taskData]);
  }

  function updateTask(updatedData, index) {
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...updatedData } : t))
    );    
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

  // Save to backend
  async function handleSave() {
    try {
      const result = await saveNewProtocol(tasks, protocolData);
      alert("Protocol saved successfully!");
      onSave(result);
    } catch (err) {
      alert("Failed to save protocol. Check console.");
    }
  }

  function handleShowProtocol() {
    // Ensure tasks are synced into global context
    setSelectedProtocol({
      ...protocolData,
      tasks,
    });
  
    // Redirect to participant view in testing mode (additional back, skip buttons, data is not being saved)
    navigate("/participant/test", { state: { testing: true, protocol: { ...protocolData, tasks } } });
  }  

  return (
    <div className="admin-container">
      <h2>{t("title")}</h2>

      <div className="admin-grid">
        <TaskList onCreate={startCreatingTask} />

        <ProtocolForm
          tasks={tasks}
          protocolData={protocolData}
          setProtocolData={setProtocolData}
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
          onSave={handleSave}
          onShowProtocol={handleShowProtocol}
          nameError={nameError} 
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
