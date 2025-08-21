"use client"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import TimerDisplay from "@/components/TimerDisplay"
import SettingsDialog from "@/components/SettingsDialog"
import TransitionScreen from "@/components/TransitionScreen"
import { COLORS } from "@/lib/colors"
import { formatTime } from "@/lib/time_utils";

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
  const [showTransition, setShowTransition] = useState(false);

  const intervalRef = useRef(null);

  // Request notification permission on app load
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.error('Failed to request notification permission:', error);
        }
      }
    };

    requestNotificationPermission();
  }, []);

  // I'm gonna local on your storage lil bro
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

  const switchModes = () => {
    setIsWorkMode((prev) => !prev);
    const newTime = isWorkMode ? breakSeconds : workSeconds;
    setTimeLeft(newTime);
  };

  const handleContinue = () => {
    setShowTransition(false);
    switchModes();
    setIsRunning(true);
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft >= 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const modeText = isWorkMode ? "work" : "break";

          document.title = `${formatTime(newTime)} | ${modeText}`;
          return newTime;
        });
      }, 1000);
    } else if (timeLeft < 0) {
      // Stop the timer
      setIsRunning(false);
      clearInterval(intervalRef.current);
      
      // Show transition screen
      setShowTransition(true);
      
      // update w/ next cycle settings
      setWorkSeconds(nextWorkSeconds);
      setBreakSeconds(nextBreakSeconds);
    } else {
      // Not running
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, isWorkMode, workSeconds, breakSeconds, nextWorkSeconds, nextBreakSeconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  /*
  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkMode(true);

    setWorkSeconds(nextWorkSeconds);
    setBreakSeconds(nextBreakSeconds);

    setTimeLeft(nextWorkSeconds);
  };
  */

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

  const totalTime = isWorkMode ? workSeconds : breakSeconds;
  
  // Get animation colors based on current mode. Since this is the transition, needs to be the other mode
  const colors = isWorkMode ? COLORS.break.animation : COLORS.work.animation;

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center"
      animate={showTransition ? {
        backgroundColor: [
          colors.light,
          colors.medium,
          colors.dark,
          colors.darker,
          colors.dark,
          colors.medium,
          colors.light
        ]
      } : {
        backgroundColor: isWorkMode ? "rgb(239 246 255)" : "rgb(240 253 244)"
      }}

      transition={showTransition ? {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      } : {
        duration: 1,
        ease: "easeInOut"
      }}
    >
      {showTransition ? (
        <TransitionScreen 
          isWorkMode={isWorkMode}
          onContinue={handleContinue}
        />
      ) : (
        <TimerDisplay 
          timeLeft={timeLeft}
          isWorkMode={isWorkMode}
          totalTime={totalTime}
          arcSize={600}
          strokeWidth={40}
          fontSize="text-8xl"

          timerControlsProps={{
            isRunning,
            onToggleTimer: toggleTimer,
            onNextMode: () => setTimeLeft(-1),
            onOpenSettings: openSettings,
          }}
        />
      )}

      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={closeSettings}

        workTotalSeconds={nextWorkSeconds}
        breakTotalSeconds={nextBreakSeconds}

        onSave={handleSettingsSave}
      />
    </motion.div>
  );
}
