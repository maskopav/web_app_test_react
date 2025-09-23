import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const App = () => {
  const IDLE = "idle";
  const RECORDING = "recording";
  const RECORDED = "recorded";

  const [recordingStatus, setRecordingStatus] = useState(IDLE);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioRef = useRef(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        console.error("Permission denied or microphone not found:", err);
        setPermission(false);
      }
    } else {
      console.error("MediaRecorder API is not supported in this browser.");
    }
  };

  const startRecording = () => {
    if (stream) {
      setRecordingStatus(RECORDING);
      const recorder = new MediaRecorder(stream, { type: "audio/webm" });
      mediaRecorder.current = recorder;
      recorder.start();
      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
    }
  };

  const stopRecording = () => {
    setRecordingStatus(RECORDED);
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunks.current = [];
    };
  };

  const saveRecording = () => {
    if (audioURL) {
      console.log("Simulating save to database...");
      alert("Recording saved successfully!");
    } else {
      alert("No recording to save!");
    }
  };

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  return (
    <div className="app-container">
      <div className="card">
        <h1>Voice Recorder</h1>
        <p>A simple, easy-to-use voice recording app.</p>

        <div className="status">
          Status:{" "}
          {recordingStatus === RECORDING
            ? "Recording..."
            : "Ready"}
        </div>

        {!permission && (
          <button onClick={getMicrophonePermission}>
            Get Microphone Permission
          </button>
        )}

        {permission && recordingStatus === IDLE && (
          <button onClick={startRecording}>Start Recording</button>
        )}

        {recordingStatus === RECORDING && (
          <button className="stop" onClick={stopRecording}>
            Stop Recording
          </button>
        )}

        {audioURL && (
          <>
            <audio ref={audioRef} src={audioURL} controls></audio>
            <button className="save" onClick={saveRecording}>
              Save Recording
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
