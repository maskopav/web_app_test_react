import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import VoiceRecorder from './components/VoiceRecorder';
import CompletionScreen from "./components/CompletionScreen";
import { TASKS as TASK_DEFS } from "./tasks";
import { resolveTranslationParams } from "./utils/translation";
import './App.css';

// App.jsx
function App() {
  const { t } = useTranslation();
  const [taskIndex, setTaskIndex] = useState(0);

  // Expand tasks with repeat count
  const rawTasks = TASK_DEFS;
  const expandedTasks = rawTasks.flatMap(task => {
    if (task.repeat && task.repeat > 1) {
      return Array.from({length: task.repeat }, (_, i) => ({
        ...task,
        _repeatIndex: i + 1,
        _repeatTotal: task.repeat,

      }));
    }
    return {...task, _repeatIndex: 1, _repeatTotal: 1}
  });

  const TASK_LABELS = {
    voice: t("taskLabels.voice"),
    motor: t("taskLabels.motor"),
    camera: t("taskLabels.camera"),
  };

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
    const currentTask = expandedTasks[taskIndex];
    console.log(currentTask)


    // If all tasks are completed, show a final message
    if (!currentTask) return <CompletionScreen />;

    // auto-resolve all params once
    const params = resolveTranslationParams(currentTask.translationParams);

    // Render the appropriate component based on task type
    switch (currentTask.type) {
      case 'voice':
        return (
          <VoiceRecorder
            key={taskIndex} // Key ensures the component remounts for each new task
            title={currentTask._repeatTotal > 1
              ? `${t(currentTask.titleKey, params)} #${currentTask._repeatIndex}`
              : t(currentTask.titleKey, params)
            }
            subtitle={t(currentTask.subtitleKey, params)}
            subtitleActive={currentTask.subtitleActiveKey
              ? t(currentTask.subtitleActiveKey, params)
              : undefined
            }
            audioExample={currentTask.audioExample}
            mode={currentTask.recording.mode}
            maxDuration={currentTask.recording.maxDuration}
            onNextTask={handleNextTask}
            //showNextButton={true} // Hide next button on last task
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

  return (
    <div className="app-container">
      <div className="task-wrapper">
        {taskIndex < expandedTasks.length && (
          <div className="task-progress">
            {TASK_LABELS[currentType] || "Task"} {currentOfType}/{totalOfType}
          </div>
        )}
  
        <div className="card">
          {renderCurrentTask()}
        </div>
      </div>
        
    </div>
  );
}

export { App as default };
