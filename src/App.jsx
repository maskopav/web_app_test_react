import React, { useState } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import doneCheckmarkIcon from "./assets/done-checkmark-icon.svg";
import './App.css';

// App.jsx
// Define your tasks in an easily extendable array
const TASKS = [
  {
    type: 'voice',
    title: 'Prolonged phonation #1',
    subtitle: 'Press the START button to start the countdown. When it runs out, take a deep breath and perform a sustained phonation of /a/, as long and steadily as possible. When you are out of breath, press the STOP button.',
  },
  {
    type: 'voice',
    title: 'PA-TA-KA #2',
    subtitle: 'Press the START button to start the countdown. When it runs out, take a deep breath and reapeat the syllables /pa/-/ta/-/ka/ as quickly and accurately as possible until the timer runs out. ',
    audioExample: '/audio/pataka.mp3', // optional example file
  },
  {
    type: 'voice',
    title: 'Reading #1',
    subtitle: 'Press the START button to start the countdown. When it runs out, read the text that appears on the screen with pitch and loudness comfortable to you. Press the STOP button at the end. ',
    subtitleActive: 'When you first put a seedling in a ground, you look at it three times a day: has it grown or not? And he holds his breath, leans over it, presses a little soil at its roots, fluffs up its leaves, and generally bothers it with various actions which he considers useful care. And when the seedling nevertheless takes hold and grows like water, one marvels at this wonder of nature, feels something like a miracle, and considers it one of his greatest personal achievements.',
  },
  // In the future, you can add other task types here:
  // {
  //   type: 'camera',
  //   title: 'TASK 3: CAPTURE PHOTO',
  //   subtitle: 'Capture a clear photo of the object.'
  // }
];

// Labels for each type
const TASK_LABELS = {
  voice: "Vocal Task",
  motor: "Motor Task",
  camera: "Camera Task",
  // Add more types here as needed
};

function App() {
  const [taskIndex, setTaskIndex] = useState(0);

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
