"use client"

import { useState, useEffect, useRef } from "react"

export function usePomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [isWorkMode, setIsWorkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const intervalRef = useRef(null);

  // Initialize timer with work time
  useEffect(() => {
    setTimeLeft(workMinutes * 60 + workSeconds);
  }, [workMinutes, workSeconds])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch modes when timer reaches 0
      setIsWorkMode((prev) => !prev);
      const newTime = isWorkMode ? breakMinutes * 60 + breakSeconds : workMinutes * 60 + workSeconds;
      setTimeLeft(newTime);
      setIsRunning(false);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isWorkMode, workMinutes, workSeconds, breakMinutes, breakSeconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  }

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkMode(true);
    setTimeLeft(workMinutes * 60 + workSeconds);
  }

  const handleSettingsSave = () => {
    if (isWorkMode) {
      setTimeLeft(workMinutes * 60 + workSeconds);
    } else {
      setTimeLeft(breakMinutes * 60 + breakSeconds);
    }
    setIsSettingsOpen(false);
  }

  const openSettings = () => {
    setIsSettingsOpen(true);
  }

  const closeSettings = () => {
    setIsSettingsOpen(false);
  }

  // Calculate total time for progress
  const totalTime = isWorkMode ? workMinutes * 60 + workSeconds : breakMinutes * 60 + breakSeconds;

  return {
    // State
    workMinutes,
    workSeconds,
    breakMinutes,
    breakSeconds,
    isWorkMode,
    isRunning,
    timeLeft,
    isSettingsOpen,
    totalTime,
    
    // Actions
    setWorkMinutes,
    setWorkSeconds,
    setBreakMinutes,
    setBreakSeconds,
    toggleTimer,
    resetTimer,
    openSettings,
    closeSettings,
    handleSettingsSave
  };
}
