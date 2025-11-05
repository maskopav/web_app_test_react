import React, { useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ProtocolContext } from "../context/ProtocolContext";
import { createTask } from "../tasks";
import { resolveTasks, resolveTask } from "../utils/taskResolver";
import { VoiceRecorder } from "../components/VoiceRecorder/VoiceRecorder";
import CompletionScreen from "../components/CompletionScreen";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import "./Pages.css";

export default function ParticipantInterfacePage() {
  const { t } = useTranslation(["tasks", "common"]);
  const { selectedProtocol } = useContext(ProtocolContext);
  const [taskIndex, setTaskIndex] = useState(0);

  if (!selectedProtocol) {
    return <p>No protocol selected.</p>;
  }

  // Generate runtime tasks from the selected protocol
  const runtimeTasks = useMemo(() => {
    const configured = selectedProtocol.tasks ?? [];
    const raw = configured.map((t) => createTask(t.category, t));
    return resolveTasks(raw);
  }, [selectedProtocol]);

  const handleNextTask = (data) => {
    console.log(`Task ${taskIndex + 1} completed`, data);
    setTaskIndex((i) => i + 1);
  };

  const renderCurrentTask = () => {
    const rawTask = runtimeTasks[taskIndex];
    if (!rawTask) return <CompletionScreen />;

    const currentTask = resolveTask(rawTask, t);
    console.log("▶ Current task:", currentTask);

    switch (currentTask.type) {
      case "voice":
        return (
          <VoiceRecorder
            key={taskIndex}
            title={currentTask.title}
            instructions={currentTask.instructions}
            instructionsActive={currentTask.instructionsActive}
            audioExample={currentTask.illustration}
            mode={currentTask.recording.mode}
            duration={currentTask.recording.duration}
            onNextTask={handleNextTask}
          />
        );
      default:
        return null;
    }
  };

  // Progress bar logic
  const currentTask = runtimeTasks[taskIndex];
  const currentType = currentTask?.type;
  const totalOfType = runtimeTasks.filter((t) => t.type === currentType).length;
  const currentOfType = runtimeTasks
    .slice(0, taskIndex + 1)
    .filter((t) => t.type === currentType).length;

  const taskLabel = t(`taskLabels.${currentType}`, { ns: "common" });

  return (
    <div className="app-container">
      <div className="task-wrapper">
        {taskIndex < runtimeTasks.length && (
          <div className="task-progress">
            {taskLabel || "Task"} {currentOfType}/{totalOfType}
          </div>
        )}
        <div className="task-card">{renderCurrentTask()}</div>
      </div>
    </div>
  );
}
