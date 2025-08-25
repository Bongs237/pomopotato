// all the timer logic goes here.
import { useState, useEffect, useRef } from "react";

import { formatTime } from "@/lib/time_utils";
import { primeAudio } from "@/lib/audio";

const DEFAULT_WORK_SECS = 25 * 60;
const DEFAULT_BREAK_SECS = 5 * 60;

export default function useTimer() {
  const [workSeconds, setWorkSeconds] = useState(DEFAULT_WORK_SECS);
  const [breakSeconds, setBreakSeconds] = useState(DEFAULT_BREAK_SECS);

  // this is for if you're in the middle of the timer running and you change settings
  // then it should only take effect on next cycle
  const [nextWorkSeconds, setNextWorkSeconds] = useState(workSeconds);
  const [nextBreakSeconds, setNextBreakSeconds] = useState(breakSeconds);

  const [timeLeft, setTimeLeft] = useState(workSeconds);

  const [isWorkMode, setIsWorkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const [timerStartTime, setTimerStartTime] = useState(null);
  const [pausedTimeLeft, setPausedTimeLeft] = useState(null);

  const [showTransition, setShowTransition] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const totalTime = isWorkMode ? workSeconds : breakSeconds;

  const intervalRef = useRef(null);
  const workSoundRef = useRef(null);
  const breakSoundRef = useRef(null);

  // set up audio
  useEffect(() => {
    workSoundRef.current = new Audio("/work.opus");
    breakSoundRef.current = new Audio("/break.opus");
  }, []);

  const handleContinue = () => {
    setShowTransition(false);
    switchModes(nextWorkSeconds, nextBreakSeconds);
    setIsRunning(true);
  };

  // Load from local storage
  useEffect(() => {
    const localWorkSeconds = localStorage.getItem("workSeconds");
    const localBreakSeconds = localStorage.getItem("breakSeconds");
    const localSkipTransition = localStorage.getItem("skipTransition");

    let localTimeLeft = localStorage.getItem("timeLeft");
    let localIsWorkMode = localStorage.getItem("isWorkMode");

    if (localWorkSeconds) {
      setWorkSeconds(localWorkSeconds);
      setNextWorkSeconds(localWorkSeconds);

      if (!localTimeLeft) {
        console.log("Local work seconds", localWorkSeconds)
        setTimeLeft(localWorkSeconds);
      }
    }
    if (localBreakSeconds) {
      setBreakSeconds(localBreakSeconds);
      setNextBreakSeconds(localBreakSeconds);

      if (!localTimeLeft) {
        setTimeLeft(localBreakSeconds);
      }
    }
    if (localSkipTransition !== null) {
      setSkipTransition(localSkipTransition === "true");
    }

    if (localTimeLeft) {
      console.log("Local time left", localTimeLeft)
      setTimeLeft(localTimeLeft);
      setPausedTimeLeft(localTimeLeft);
    }

    if (localIsWorkMode) {
      setIsWorkMode(localIsWorkMode === "true");
    }
  }, []);

  const handleSettingsSave = (newWorkTotalSeconds, newBreakTotalSeconds, newSkipTransition) => {
    setNextWorkSeconds(newWorkTotalSeconds);
    setNextBreakSeconds(newBreakTotalSeconds);
    setSkipTransition(newSkipTransition);

    if (totalTime === timeLeft) {
      // If your timer is not in progress
      setWorkSeconds(newWorkTotalSeconds);
      setBreakSeconds(newBreakTotalSeconds);

      if (isWorkMode) {
        setTimeLeft(newWorkTotalSeconds);
      } else {
        setTimeLeft(newBreakTotalSeconds);
      }
    }

    localStorage.setItem("workSeconds", newWorkTotalSeconds);
    localStorage.setItem("breakSeconds", newBreakTotalSeconds);
    localStorage.setItem("skipTransition", newSkipTransition);

    setIsSettingsOpen(false);
  };
  
  // Save current time left, and mode in local storage so you can pick up where you left off when reloading page
  useEffect(() => {
    if (timeLeft < 0) {
      return;
    }
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("isWorkMode", isWorkMode);
  }, [timeLeft, isWorkMode]);

  useEffect(() => {
    if (isRunning && timerStartTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - timerStartTime) / 1000);
        const remainingTime = totalTime - elapsedSeconds;
        
        setTimeLeft(remainingTime);
        
        const modeText = isWorkMode ? "work" : "break";
        document.title = `${formatTime(remainingTime)} | ${modeText}`;

        // Check if timer has finished
        if (remainingTime < 0) {
          // Stop the timer
          setIsRunning(false);
          clearInterval(intervalRef.current);
          setTimerStartTime(null);

          // update w/ next cycle settings
          setWorkSeconds(nextWorkSeconds);
          setBreakSeconds(nextBreakSeconds);

          // Show transition screen only if skip transition is disabled
          if (!skipTransition) {
            setShowTransition(true);
          } else {
            // Skip transition and go straight to next mode
            switchModes(nextWorkSeconds, nextBreakSeconds);
            setIsRunning(true);
          }
        }
      }, 1000);
    } else if (isRunning && !timerStartTime) {
      // Next mode just started I think? Man this logic is confusing
      setTimerStartTime(Date.now());
    } else {
      // Not running
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    timerStartTime,
    timeLeft,
    isWorkMode,
    workSeconds,
    breakSeconds,
    nextWorkSeconds,
    nextBreakSeconds,
    skipTransition,
  ]);

  const toggleTimer = () => {
    if (isRunning) {
      // Pause the timer
      setIsRunning(false);
      setPausedTimeLeft(timeLeft);
      setTimerStartTime(null);
    } else {
      // Resume or start the timer
      primeAudio(workSoundRef);
      primeAudio(breakSoundRef);

      setIsRunning(true);
      if (pausedTimeLeft !== null) {
        // Resuming from pause
        setTimeLeft(pausedTimeLeft);
        setPausedTimeLeft(null);

        // "hack" the start time so you start off on the right time
        const diff = (totalTime - pausedTimeLeft) * 1000;
        setTimerStartTime(Date.now() - diff);
      } else {
        setTimerStartTime(Date.now());
      }
    }
  };

  const switchModes = (nextWorkSeconds, nextBreakSeconds) => {
    setIsWorkMode((prev) => {
      const newTime = prev ? nextBreakSeconds : nextWorkSeconds;
      setTimeLeft(newTime);
      setPausedTimeLeft(null);
      setTimerStartTime(null);
      return !prev;
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerStartTime(null);
    setPausedTimeLeft(null);

    setWorkSeconds(nextWorkSeconds);
    setBreakSeconds(nextBreakSeconds);

    setTimeLeft(totalTime);
  };

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      toggleTimer();
    }
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  return {
    nextWorkSeconds,
    nextBreakSeconds,
    timeLeft,
    isWorkMode,
    isRunning,
    totalTime,
    switchModes,
    
    handleKeyDown,
    toggleTimer,
    resetTimer,
    handleContinue,
    showTransition,
    skipTransition,

    // settings
    isSettingsOpen,

    handleSettingsSave,
    openSettings,
    closeSettings,
  };
}
