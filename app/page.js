"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

import TimerDisplay from "@/components/TimerDisplay";
import SettingsDialog from "@/components/SettingsDialog";
import TransitionScreen from "@/components/TransitionScreen";
import TimerControls from "@/components/TimerControls";

import { COLORS } from "@/lib/colors";
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
  const [skipTransition, setSkipTransition] = useState(false);

  const [dimensions, setDimensions] = useState({
    arcSize: 400,
    strokeWidth: 20
  });

  const intervalRef = useRef(null);

  // Responsive dimensions calculation
  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      
      // Calculate responsive arc size (between 300 and 600)
      const responsiveArcSize = Math.max(300, Math.min(600, screenWidth * 0.8));
      
      // Calculate responsive stroke width (between 12 and 30)
      const responsiveStrokeWidth = Math.max(12, Math.min(30, screenWidth * 0.02));
      
      setDimensions({
        arcSize: responsiveArcSize,
        strokeWidth: responsiveStrokeWidth
      });
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Request notification permission on app load
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (error) {
          console.error("Failed to request notification permission:", error);
        }
      }
    };

    requestNotificationPermission();
  }, []);

  // I'm gonna local on your storage lil bro
  useEffect(() => {
    const localWork = localStorage.getItem("workSeconds");
    const localBreak = localStorage.getItem("breakSeconds");
    const localSkipTransition = localStorage.getItem("skipTransition");

    if (localWork) {
      setWorkSeconds(localWork);
      setNextWorkSeconds(localWork);

      setTimeLeft(localWork);
    }
    if (localBreak) {
      setBreakSeconds(localBreak);
      setNextBreakSeconds(localBreak);
    }
    if (localSkipTransition !== null) {
      setSkipTransition(localSkipTransition === "true");
    }
  }, []);

  const switchModes = useCallback(() => {
    setIsWorkMode((prev) => {
      const newTime = prev ? breakSeconds : workSeconds;
      setTimeLeft(newTime);
      return !prev;
    });
  }, [breakSeconds, workSeconds]);

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

          // only update title if time is not negative
          if (newTime >= 0) {
            document.title = `${formatTime(newTime)} | ${modeText}`;
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft < 0) {
      // Stop the timer
      setIsRunning(false);
      clearInterval(intervalRef.current);

      // Show transition screen only if skip transition is disabled
      if (!skipTransition) {
        setShowTransition(true);
      } else {
        // Skip transition and go straight to next mode
        switchModes();
        setIsRunning(true);
      }

      // update w/ next cycle settings
      setWorkSeconds(nextWorkSeconds);
      setBreakSeconds(nextBreakSeconds);
    } else {
      // Not running
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [
    isRunning,
    timeLeft,
    isWorkMode,
    workSeconds,
    breakSeconds,
    nextWorkSeconds,
    nextBreakSeconds,
    skipTransition,
    switchModes,
  ]);

  // Update title when mode changes
  useEffect(() => {
    if (!showTransition) {
      const modeText = isWorkMode ? "work" : "break";
      document.title = `${formatTime(timeLeft)} | ${modeText}`;
    }
  }, [isWorkMode, timeLeft, showTransition]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkMode(true);

    setWorkSeconds(nextWorkSeconds);
    setBreakSeconds(nextBreakSeconds);

    setTimeLeft(nextWorkSeconds);
  };

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

  const openSettings = () => {
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const totalTime = isWorkMode ? workSeconds : breakSeconds;

  // Get animation colors based on current mode. Since this is the transition, needs to be the other mode
  const colors = !isWorkMode ? COLORS.work.animation : COLORS.break.animation;

  return (
    <motion.div
      key={showTransition ? 'transition' : 'normal'}
      className="min-h-screen flex items-center justify-center"
      animate={{
        backgroundColor: showTransition
          ? [
              colors.light,
              colors.medium,
              colors.dark,
              colors.darker,
              colors.dark,
              colors.medium,
              colors.light,
            ]
          : isWorkMode
          ? COLORS.work.light
          : COLORS.break.light,
      }}
      transition={
        showTransition
          ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : {
              duration: 0.5,
              ease: "easeInOut",
            }
      }
    >
      {showTransition ? (
        <TransitionScreen isWorkMode={isWorkMode} onContinue={handleContinue} />
      ) : (
        <div className="flex flex-col justify-center items-center">
          <TimerDisplay
            timeLeft={timeLeft}
            isWorkMode={isWorkMode}
            totalTime={totalTime}
            fontSize="text-5xl sm:text-6xl md:text-8xl"
            arcSize={dimensions.arcSize}
            strokeWidth={dimensions.strokeWidth}
          />

          <TimerControls
            isWorkMode={isWorkMode}
            isRunning={isRunning}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            onNextMode={() => setTimeLeft(-1)}
            onOpenSettings={openSettings}
          />
        </div>
      )}

      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={closeSettings}
        workTotalSeconds={nextWorkSeconds}
        breakTotalSeconds={nextBreakSeconds}
        skipTransition={skipTransition}
        onSave={handleSettingsSave}
      />
    </motion.div>
  );
}
