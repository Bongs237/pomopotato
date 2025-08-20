"use client"
import { useState, useEffect, useRef } from "react";

import TimerDisplay from "@/components/TimerDisplay"
import SettingsDialog from "@/components/SettingsDialog"

export default function PomodoroTimer() {
  const [workTotalSeconds, setWorkTotalSeconds] = useState(25 * 60); // 25 minutes in seconds
  const [breakTotalSeconds, setBreakTotalSeconds] = useState(5 * 60); // 5 minutes in seconds

  const [isWorkMode, setIsWorkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const intervalRef = useRef(null);

  // Initialize timer with work time
  useEffect(() => {
    setTimeLeft(workTotalSeconds);
  }, [workTotalSeconds])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch modes when timer reaches 0
      setIsWorkMode((prev) => !prev);
      const newTime = isWorkMode ? breakTotalSeconds : workTotalSeconds;
      setTimeLeft(newTime);
      setIsRunning(false);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isWorkMode, workTotalSeconds, breakTotalSeconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  }

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkMode(true);
    setTimeLeft(workTotalSeconds);
  }

  const handleSettingsSave = (newWorkTotalSeconds, newBreakTotalSeconds) => {
    setWorkTotalSeconds(newWorkTotalSeconds);
    setBreakTotalSeconds(newBreakTotalSeconds);
    
    if (isWorkMode) {
      setTimeLeft(newWorkTotalSeconds);
    } else {
      setTimeLeft(newBreakTotalSeconds);
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
  const totalTime = isWorkMode ? workTotalSeconds : breakTotalSeconds;

  // Dynamic background color based on mode
  const bgColor = isWorkMode
    ? "bg-gradient-to-br from-red-50 to-red-100"
    : "bg-gradient-to-br from-green-50 to-green-100";

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${bgColor}`}>
      <TimerDisplay 
        timeLeft={timeLeft}
        isWorkMode={isWorkMode}
        totalTime={totalTime}
        arcSize={600}
        strokeWidth={40}
        fontSize="text-8xl"

        isRunning={isRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onOpenSettings={openSettings}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={closeSettings}

        workTotalSeconds={workTotalSeconds}
        breakTotalSeconds={breakTotalSeconds}

        onSave={handleSettingsSave}
      />
    </div>
  );
}
