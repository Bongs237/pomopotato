"use client"
import { useState, useEffect, useRef } from "react";

import TimerDisplay from "@/components/TimerDisplay"
import SettingsDialog from "@/components/SettingsDialog"

const DEFAULT_WORK_SECS = 25 * 60;
const DEFAULT_BREAK_SECS = 5 * 60;

export default function PomodoroTimer() {
  const [workSeconds, setWorkSeconds] = useState(DEFAULT_WORK_SECS);
  const [breakSeconds, setBreakSeconds] = useState(DEFAULT_BREAK_SECS);

  // this is for if you're in the middle of the timer running and you change settings
  // then it should only take effect on next cycle
  const [nextWorkSeconds, setNextWorkSeconds] = useState(workSeconds);
  const [nextBreakSeconds, setNextBreakSeconds] = useState(breakSeconds);

  const [timeLeft, setTimeLeft] = useState(workSeconds);

  const [isWorkMode, setIsWorkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const intervalRef = useRef(null);

  // I'm gonna local on your storage
  useEffect(() => {
    const localWork = localStorage.getItem("workSeconds");
    const localBreak = localStorage.getItem("breakSeconds");

    if (localWork) {
      setWorkSeconds(localWork);
      setNextWorkSeconds(localWork);

      setTimeLeft(localWork);
    }
    if (localBreak) {
      setBreakSeconds(localBreak);
      setNextBreakSeconds(localBreak);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft >= 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft < 0) {
      // update w/ next cycle settings
      setWorkSeconds(nextWorkSeconds);
      setBreakSeconds(nextBreakSeconds);

      // Switch modes
      setIsWorkMode((prev) => !prev);
      const newTime = isWorkMode ? breakSeconds : workSeconds;
      setTimeLeft(newTime);
    } else {
      // Not running
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isWorkMode, workSeconds, breakSeconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkMode(true);
    setTimeLeft(workSeconds);
  };

  const handleSettingsSave = (newWorkTotalSeconds, newBreakTotalSeconds) => {
    setNextWorkSeconds(newWorkTotalSeconds);
    setNextBreakSeconds(newBreakTotalSeconds);

    if (totalTime === timeLeft) { // If your timer is not in progress
      setWorkSeconds(newWorkTotalSeconds);
      setBreakSeconds(newWorkTotalSeconds);

      if (isWorkMode) {
        setTimeLeft(newWorkTotalSeconds);
      } else {
        setTimeLeft(newBreakTotalSeconds);
      }
    }

    localStorage.setItem("workSeconds", newWorkTotalSeconds);
    localStorage.setItem("breakSeconds", newBreakTotalSeconds);

    setIsSettingsOpen(false);
  };

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  // Calculate total time for progress
  const totalTime = isWorkMode ? workSeconds : breakSeconds;

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

        workTotalSeconds={nextWorkSeconds}
        breakTotalSeconds={nextBreakSeconds}

        onSave={handleSettingsSave}
      />
    </div>
  );
}
