import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import VoiceRecorder from './components/VoiceRecorder';
import doneCheckmarkIcon from "./assets/done-checkmark-icon.svg";
import './App.css';

// App.jsx
// Define your tasks in an easily extendable array

function App() {
  const { t } = useTranslation();
  const [taskIndex, setTaskIndex] = useState(0);

  const TASKS = [
    {
      type: "voice",
      title: t("tasks.prolongedPhonationA.title"),
      subtitle: t("tasks.prolongedPhonationA.subtitle"),
    },
    {
      type: "voice",
      title: t("tasks.pataka.title"),
      subtitle: t("tasks.pataka.subtitle"),
      audioExample: "/audio/pataka.mp3",
    },
    {
      type: "voice",
      title: t("tasks.readingSeedling.title"),
      subtitle: t("tasks.readingSeedling.subtitle"),
      subtitleActive: t("tasks.readingSeedling.subtitleActive"),
    }
  ];

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
    const currentTask = TASKS[taskIndex];

    // If all tasks are completed, show a final message
    if (!currentTask) {
      return (
        <div className="completion-screen">
          <h1>All Tasks Completed!</h1>
          <p>You have successfully finished all assignments.</p>
          <img
            src={doneCheckmarkIcon}
            style={{ width: 120, height: 120 }}
          />
        </div>
      );
    }

    // Render the appropriate component based on task type
    switch (currentTask.type) {
      case 'voice':
        return (
          <VoiceRecorder
            key={taskIndex} // Key ensures the component remounts for each new task
            title={currentTask.title}
            subtitle={currentTask.subtitle}
            subtitleActive={currentTask.subtitleActive}
            audioExample={currentTask.audioExample}
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
  const currentTask = TASKS[taskIndex];
  const currentType = currentTask?.type;

  const totalOfType = TASKS.filter(t => t.type === currentType).length;
  const currentOfType = TASKS
    .slice(0, taskIndex + 1)
    .filter(t => t.type === currentType).length;

  return (
    <div className="app-container">
      <div className="task-wrapper">
        {taskIndex < TASKS.length && (
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
