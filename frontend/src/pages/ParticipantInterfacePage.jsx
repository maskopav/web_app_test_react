import React, { useState, useContext, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ProtocolContext } from "../context/ProtocolContext";
import { createTask } from "../tasks";
import { resolveTasks, resolveTask } from "../utils/taskResolver";
import { VoiceRecorder } from "../components/VoiceRecorder/VoiceRecorder";
import Questionnaire from "../components/Questionnaire/Questionnaire";
import CompletionScreen from "../components/CompletionScreen";
import "./Pages.css";

export default function ParticipantInterfacePage() {
  const { i18n, t } = useTranslation(["tasks", "common"]);
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProtocol, setSelectedProtocol } = useContext(ProtocolContext);

  const [taskIndex, setTaskIndex] = useState(0);
  const [langReady, setLangReady] = useState(false);

  const testingMode = location.state?.testingMode ?? false;
  const editingMode = location.state?.editingMode ?? false;
  const protocolData = location.state?.protocol || selectedProtocol;  
  // For saving recordings in the future.....
  const participant = location.state?.participant;
  const accessToken = location.state?.token;

  // Restore protocol in context
  useEffect(() => {
    if (protocolData && !selectedProtocol) {
      setSelectedProtocol(protocolData);
    }
  }, [protocolData, selectedProtocol, setSelectedProtocol]);

  // Handle language switching
  useEffect(() => {
    if (!protocolData) return;
    const protocolLang = protocolData.language || "en";
    const prevLang = i18n.language;

    setLangReady(false);
    if (protocolLang !== prevLang) {
      i18n.changeLanguage(protocolLang).then(() => setLangReady(true));
    } else {
      setLangReady(true);
    }

    return () => {
      i18n.changeLanguage(prevLang);
    };
  }, [protocolData, i18n]);

  // Generate runtime tasks + inject Questionnaire if present from the selected protocol
  const runtimeTasks = useMemo(() => {
    if (!selectedProtocol) return [];

    // 1. Prepare Voice Tasks
    const configured = selectedProtocol.tasks ?? [];
    const rawVoiceTasks = configured.map((t) => createTask(t.category, t));
    const resolvedVoiceTasks = resolveTasks(rawVoiceTasks);
    
    // 2. Check for Questionnaire
    // Assuming protocolData.questionnaire contains the JSON object from the editor
    // or it was fetched and attached to the protocol object.
    if (selectedProtocol.questionnaire) {
      const qTask = {
        type: "questionnaire",
        data: selectedProtocol.questionnaire,
        category: "questionnaire" // for label lookup
      };
      
      // Decide position: usually at the end or beginning. 
      // Let's append it to the end for now.
      return [...resolvedVoiceTasks, qTask];
    }

    return resolvedVoiceTasks;
  }, [selectedProtocol, i18n.language]);


  // --- early return only after all hooks are declared
  if (!protocolData) return <p>No protocol selected.</p>;
  if (!langReady) return <p>Loading translations...</p>;

  // --- Handlers
  const handleTaskComplete = (data) => {
    console.log("✅ Task Completed:", data);
    setResults(prev => [...prev, data]);
    
    // Move to next
    setTaskIndex((i) => i + 1);
  };
  function handleBack() {
    if (location.state?.returnTo === "dashboard") {
      navigate(`/projects/${protocolData.projectId}/protocols`);
      return;
    }
  
    // default → return to editor
    navigate(`/projects/${protocolData.projectId}/protocols/${protocolData.id}`, {
      state: { protocol: protocolData, testingMode, editingMode },
    });
  }
  const handleSkip = () => setTaskIndex((i) => Math.min(i + 1, runtimeTasks.length));

  const renderCurrentTask = () => {
    const rawTask = runtimeTasks[taskIndex];
    if (!rawTask) return <CompletionScreen />;

    const currentTask = resolveTask(rawTask, t);
    console.log("▶ Current task:", currentTask);

    // 1. Render Voice Task
    if (currentTask.type === "voice")
      return (
        <VoiceRecorder
          key={taskIndex}
          title={currentTask.title}
          instructions={currentTask.instructions}
          instructionsActive={currentTask.instructionsActive}
          audioExample={currentTask.illustration}
          mode={currentTask.recording.mode}
          duration={currentTask.recording.duration}
          onNextTask={handleTaskComplete}
        />
      );
    // 2. Render Questionnaire
    if (currentTask.type === "questionnaire") {
      // The data we saved (title, questions) is now in resolvedParams
      // because resolveTask merges params into resolvedParams
      const { title, description, questions } = currentTask.resolvedParams;

      // Construct the data object expected by your Questionnaire component
      const questionnaireData = {
        title,
        description,
        questions
      };

      return (
        <Questionnaire
          key={taskIndex}
          data={questionnaireData}
          onNextTask={(results) => {
             console.log("Questionnaire results:", results);
             // Save results logic here if needed
             handleNextTask();
          }}
        />
      );
    }
    return <p>Unknown task type: {currentTask.type}</p>;
  };

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
