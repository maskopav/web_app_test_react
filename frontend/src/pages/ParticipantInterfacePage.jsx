import React, { useState, useContext, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ProtocolContext } from "../context/ProtocolContext";
import { createTask } from "../tasks";
import { resolveTasks, resolveTask } from "../utils/taskResolver";
import { VoiceRecorder } from "../components/VoiceRecorder/VoiceRecorder";
import CompletionScreen from "../components/CompletionScreen";
import "./Pages.css";

export default function ParticipantInterfacePage() {
  const { i18n, t } = useTranslation(["tasks", "common"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProtocol, setSelectedProtocol } = useContext(ProtocolContext);
  const [taskIndex, setTaskIndex] = useState(0);

  // Determine testing mode and protocol
  const testingMode = location.state?.testing ?? false;
  const protocolData = location.state?.protocol || selectedProtocol;

  // Restore protocol in context if provided via state
  useEffect(() => {
    if (protocolData && !selectedProtocol) {
      setSelectedProtocol(protocolData);
    }
  }, [protocolData, selectedProtocol, setSelectedProtocol]);

  // Handle language switching temporarily
  useEffect(() => {
    if (!protocolData) return;
    const protocolLang = protocolData.language || "en";
    const previousLang = i18n.language;
    if (protocolLang !== previousLang) {
      i18n.changeLanguage(protocolLang);
    }
    return () => {
      i18n.changeLanguage(previousLang);
    };
  }, [protocolData, i18n]);

  if (!protocolData) {
    return <p>No protocol selected.</p>;
  }

  // Generate runtime tasks from the selected protocol
  const runtimeTasks = useMemo(() => {
    if (!selectedProtocol) return [];
    const configured = selectedProtocol.tasks ?? [];
    const raw = configured.map((t) => createTask(t.category, t));
    return resolveTasks(raw);
  }, [selectedProtocol, i18n.language]);

  const handleNextTask = (data) => {
    console.log(`Task ${taskIndex + 1} completed`, data);
    setTaskIndex((i) => i + 1);
  };

  const handleBack = () => {
    // Return to ProtocolEditor with preserved protocol
    navigate(`/projects/${protocolData.projectId || "demo"}/protocols/${protocolData.id || "test"}`, {
      state: { protocol: protocolData },
    });
  };

  const handleSkip = () => {
    setTaskIndex((i) => Math.min(i + 1, runtimeTasks.length));
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
        <div className="top-controls-participant">
          {testingMode && (
          <button className="btn-back" onClick={handleBack}>
            ← {t("buttons.back", { ns: "common" })}
          </button>
          )}

          {taskIndex < runtimeTasks.length && (
            <>
            <div className="task-progress">
              {taskLabel || "Task"} {currentOfType}/{totalOfType}
            </div>

            {testingMode && (
              <button className="btn-skip" onClick={handleSkip}>
                {t("buttons.skip", { ns: "common" })} →
              </button>
            )}
            </>
          )}
        </div>
        <div className="task-card">{renderCurrentTask()}</div>
      </div>
    </div>
  );
}
