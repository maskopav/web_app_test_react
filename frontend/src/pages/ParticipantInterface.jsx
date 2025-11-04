// src/pages/ParticipantInterface.jsx
import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import VoiceRecorder from "../components/VoiceRecorder";
import CompletionScreen from "../components/CompletionScreen";
import { createTask } from "../tasks";
import { resolveTasks, resolveTask } from "../utils/taskResolver";
import { ProtocolContext } from "../context/ProtocolContext";
import "./Pages.css"

export default function ParticipantInterface() {
  const { token } = useParams();
  const { t } = useTranslation(["tasks", "common"]);
  const [taskIndex, setTaskIndex] = useState(0);
  const { selectedProtocol } = useContext(ProtocolContext);

  const runtimeTasks = selectedProtocol?.tasks?.map(t => createTask(t.category, t)) || [];
  const expandedTasks = resolveTasks(runtimeTasks);

  const handleNext = () => setTaskIndex(prev => prev + 1);

  const rawTask = expandedTasks[taskIndex];
  if (!rawTask) return <CompletionScreen />;

  const task = resolveTask(rawTask, t);

  return (
    <div className="participant-interface">
      {task.type === "voice" && (
        <VoiceRecorder
          key={taskIndex}
          title={task.title}
          instructions={task.instructions}
          audioExample={task.illustration}
          mode={task.recording.mode}
          duration={task.recording.duration}
          onNextTask={handleNext}
        />
      )}
    </div>
  );
}
