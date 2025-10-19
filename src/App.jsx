import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import VoiceRecorder from './components/VoiceRecorder';
import CompletionScreen from "./components/CompletionScreen";
import ModeSwitchButton from "./components/ModeSwitchButton";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { TASKS as TASK_DEFS, createTask } from "./tasks";
import {
  translateTaskTitle,
  translateTaskInstructions,
  translateTaskInstructionsActive,
  getResolvedParams
} from "./utils/translations";
import { resolveTasks, resolveTask } from "./utils/taskResolver";
import AdminTaskEditor from "./components/AdminTaskEditor";
import './App.css';

// App.jsx
function App() {
  const { t } = useTranslation(["tasks", "common"]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [adminMode, setAdminMode] = useState(true); // start in admin mode
  const [configuredTasks, setConfiguredTasks] = useState(TASK_DEFS);

  // Convert admin-configured tasks to runtime TaskInstances, then expand with repeat
  const runtimeTasks = configuredTasks.map((t) => createTask(t.category, t));
  const expandedTasks = resolveTasks(runtimeTasks);

  const handleNextTask = (taskData) => {
    // This is where you would process the data from the completed task
    console.log(`Task ${taskIndex + 1} completed with data:`, taskData);
    
    // Placeholder for saving data to backend/storage
    // TODO: Implement actual data saving logic here
    // Example: await saveTaskData(taskIndex, taskData);

    // Move to the next task
    setTaskIndex(prevIndex => prevIndex + 1);
  };

  const renderCurrentTask = () => {
    const rawTask = expandedTasks[taskIndex];
    if (!rawTask) return <CompletionScreen />;
  
    const currentTask = resolveTask(rawTask, t);
    console.log("🧭 Prepared task:", currentTask);

    // Render the appropriate component based on task type
    switch (currentTask.type) {
      case 'voice':
        return (
          <VoiceRecorder
            key={taskIndex}
            title={currentTask.title}
            instructions={currentTask.instructions}
            instructionsActive={currentTask.instructionsActive}
            audioExample={currentTask.audioExample}
            mode={currentTask.recording.mode}
            duration={currentTask.recording.duration}
            onNextTask={handleNextTask}
          />
        );
      case 'camera':
        // Placeholder for future implementation
        // return <CameraCapture onNextTask={handleNextTask} />;
        return null;
      default:
        return null;
    }
  };

  // Progress counts
  const currentTask = expandedTasks[taskIndex];
  const currentType = currentTask?.type;

  const totalOfType = expandedTasks.filter(t => t.type === currentType).length;
  const currentOfType = expandedTasks
    .slice(0, taskIndex + 1)
    .filter(t => t.type === currentType).length;
    
  // Translated label for the task type (voice, motor, camera)
  const taskLabel = t(`taskLabels.${currentType}`, { ns: "common"});

return (
  <div className="app-container" style={{ position: "relative" }}>
    <LanguageSwitcher /> 
    {adminMode ? (
      <>
        <AdminTaskEditor
          initialTasks={configuredTasks}
          onChange={(tasks) => setConfiguredTasks(tasks)}
          onSave={(tasks) => {
            setConfiguredTasks(tasks);
            setAdminMode(false);
            setTaskIndex(0);
          }}
        />
        <ModeSwitchButton
          adminMode={adminMode}
          onToggle={() => setAdminMode(false)}
        />
      </>
    ) : (
      <>
        <div className="task-wrapper">
          {taskIndex < expandedTasks.length && (
            <div className="task-progress">
              {taskLabel || "Task"} {currentOfType}/{totalOfType}
            </div>
          )}
          <div className="card">{renderCurrentTask()}</div>
        </div>
      </>
    )}
  </div>
);
}

export { App as default };
