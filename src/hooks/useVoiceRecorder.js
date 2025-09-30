// hooks/useVoiceRecorder.js - Reusable hook for voice recording logic
import { useState, useRef, useEffect } from 'react';

export const useVoiceRecorder = (options = {}) => {
    const {
        onRecordingComplete = () => {},
        onError = () => {},
        audioFormat = "audio/webm",
        subtitle,           // initial subtitle
        subtitleActive,     // subtitle after START
        audioExample,       // optional audio example URL
        maxDuration         // optional duration of task in seconds
    } = options;

    // Recording states
    const IDLE = "idle";
    const RECORDING = "recording";
    const PAUSED = "paused";
    const RECORDED = "recorded";

    // State management
    const [recordingStatus, setRecordingStatus] = useState(IDLE);
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(maxDuration || null);
    const [audioLevels, setAudioLevels] = useState(new Array(12).fill(0));
    const [activeSubtitle, setActiveSubtitle] = useState(subtitle);
    const [exampleAudio, setExampleAudio] = useState(null);

    // Refs
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const timerInterval = useRef(null);
    const analyser = useRef(null);
    const audioContext = useRef(null);
    const animationFrame = useRef(null);

    // Get microphone permission
    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
                });
                setPermission(true);
                setStream(streamData);
                return true;
            } catch (err) {
                onError(err);
                setPermission(false);
                return false;
            }
        } else {
            const error = new Error("MediaRecorder API is not supported in this browser.");
            onError(error);
            return false;
        }
    };

    // Timer functions
    const startTimer = () => {
        timerInterval.current = setInterval(() => {
            if (maxDuration) {
                setRemainingTime(prev => {
                    if (prev == null) return null;
                    if (prev <= 1) {
                        stopRecording();
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                setRecordingTime(prev => prev + 1);
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    };

    // Recording functions
    const startRecording = () => {
        if (stream) {
            stopExample(); // stop example playback if active
            setRecordingStatus(RECORDING);
            if (maxDuration) {
                setRemainingTime(maxDuration);
            } else {
                setRecordingTime(0);
            }

            if (subtitleActive) {
                setActiveSubtitle(subtitleActive); // switch subtitle
            }
            
            const recorder = new MediaRecorder(stream, { mimeType: audioFormat });
            mediaRecorder.current = recorder;
            
            recorder.start();
            startTimer();
            
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            // Setup audio context + analyser for visualization
            if (!audioContext.current) {
                audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const source = audioContext.current.createMediaStreamSource(stream);
            analyser.current = audioContext.current.createAnalyser();
            analyser.current.fftSize = 256;
            source.connect(analyser.current);
        }
    };


    const pauseRecording = () => {
        if (mediaRecorder.current && recordingStatus === RECORDING) {
            setRecordingStatus(PAUSED);
            mediaRecorder.current.pause();
            stopTimer();
        }
    };

    const resumeRecording = () => {
        if (mediaRecorder.current && recordingStatus === PAUSED) {
            setRecordingStatus(RECORDING);
            mediaRecorder.current.resume();
            startTimer();
        }
    };

    const stopRecording = () => {
        setRecordingStatus(RECORDED);
        stopTimer();
        
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: audioFormat });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                onRecordingComplete(audioBlob, url);
            };
        }
    };

    const repeatRecording = () => {
        stopExample(); // stop example playback if active

        if (audioURL) {
            URL.revokeObjectURL(audioURL);
            setAudioURL(null);
        }
        
        audioChunks.current = [];
        setRecordingTime(0);
        setRecordingStatus(IDLE);
        setAudioLevels(new Array(12).fill(0));
        stopTimer();
        
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }

        if (audioContext.current && audioContext.current.state !== "closed") {
            audioContext.current.close();
            audioContext.current = null;
        }
    };

    // Play audio example
    const playExample = () => {
        if (!audioExample) return;
      
        // Stop previous example if playing
        if (exampleAudio) {
          exampleAudio.pause();
          exampleAudio.currentTime = 0;
        }
      
        const audio = new Audio(audioExample);
        setExampleAudio(audio);
    
        audio.play().catch(err => {
          console.error("Error playing example audio:", err);
          setExampleAudio(null);
        });

        audio.onended = () => {
            setExampleAudio(null); // cleanup
        };
      };
      
      // Stop Example function (used by startRecording/repeatRecording)
      const stopExample = () => {
        if (exampleAudio) {
            exampleAudio.pause();
            exampleAudio.currentTime = 0;
            setExampleAudio(null);
        }
      };

    // Audio Visualization Effect 
    useEffect(() => {
        if (!analyser.current) return;

        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        let levels = new Array(12).fill(0); // Use a local array for current frame

        const updateLevels = () => {
        if (recordingStatus === RECORDING) {
            analyser.current.getByteFrequencyData(dataArray);

            const newLevels = [];
            const step = Math.floor(dataArray.length / 12);

            for (let i = 0; i < 12; i++) {
                const start = i * step;
                const end = start + step;
                let sum = 0;

                for (let j = start; j < end && j < dataArray.length; j++) {
                    sum += dataArray[j];
                }

                const average = sum / step;
                // Normalize to 0-100 range
                const normalized = Math.min((average / 255) * 100, 100);
                newLevels.push(normalized);
            }
            levels = newLevels;
            setAudioLevels(newLevels);

        } else {
            // Fade out when not recording (PAUSED or IDLE after recording)
            const isFading = levels.some(level => level > 0);

            if (isFading) {
                levels = levels.map(level => Math.max(0, level - 5)); // Fade by 5 units per frame
                setAudioLevels(levels);
            } else if (recordingStatus === RECORDED) {
                // Stop the visualization loop only when levels are zero and status is RECORDED
                // (Keeps levels on PAUSED)
            return;
            }
        }

        animationFrame.current = requestAnimationFrame(updateLevels);
        };

        // Initial kick-off
        updateLevels();

        return () => {
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        };
    }, [recordingStatus, RECORDING, RECORDED]);

    // Cleanup effect
    useEffect(() => {
        return () => {
        stopTimer();
        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
        }
        if (audioContext.current) {
            // Only close if it's not already closed
            if (audioContext.current.state !== "closed") {
                audioContext.current.close().catch(err => {
                console.warn("AudioContext close failed:", err);
                });
            }
            audioContext.current = null; // reset ref
                }
        };
    }, [audioURL]);

return {
    // State
    recordingStatus,
    permission,
    audioURL,
    recordingTime,
    remainingTime,
    audioLevels,
    activeSubtitle,
    exampleAudio,
    
    // Actions
    getMicrophonePermission,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    repeatRecording,
    playExample,
    stopExample,
    
    // Utilities
    formatTime: (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Constants
    RECORDING_STATES: { IDLE, RECORDING, PAUSED, RECORDED }
    };
};
