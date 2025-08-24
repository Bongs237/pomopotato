"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

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

  // Timer state based on start time
  const [timerStartTime, setTimerStartTime] = useState(null);
  const [pausedTimeLeft, setPausedTimeLeft] = useState(null);

  const intervalRef = useRef(null);

  const workSoundRef = useRef(null);
  const breakSoundRef = useRef(null);

  // set audio refs
  useEffect(() => {
    workSoundRef.current = new Audio("work.opus");
    breakSoundRef.current = new Audio("break.opus");
  }, []);

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

  // load from localstorage
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
      setTimeLeft(localTimeLeft);
      setPausedTimeLeft(localTimeLeft);
    }

    if (localIsWorkMode) {
      setIsWorkMode(localIsWorkMode === "true");
    }
  }, []);

  const switchModes = useCallback(() => {
    setIsWorkMode((prev) => {
      const newTime = prev ? breakSeconds : workSeconds;
      setTimeLeft(newTime);
      setPausedTimeLeft(null);
      setTimerStartTime(null);
      return !prev;
    });
  }, [breakSeconds, workSeconds]);

  const handleContinue = () => {
    setShowTransition(false);
    switchModes();
    setIsRunning(true);
  };

  // force browser to load audio
  const primeAudio = (audioRef) => {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    });
  };

  // Save current time left, and mode in local storage so you can pick up where you left off when reloading page
  useEffect(() => {
    if (timeLeft < 0) {
      return;
    }
    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("isWorkMode", isWorkMode);
  }, [timeLeft, isWorkMode]);

  // Timer logic based on start time
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

  const resetTimer = () => {
    setIsRunning(false);
    setTimerStartTime(null);
    setPausedTimeLeft(null);

    setWorkSeconds(nextWorkSeconds);
    setBreakSeconds(nextBreakSeconds);

    setTimeLeft(totalTime);
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

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      toggleTimer();
    }
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
      onKeyDown={handleKeyDown}
      tabIndex={0} /* make it focusable to receive key events */
    >
      {showTransition ? (
        <TransitionScreen isWorkMode={isWorkMode} onContinue={handleContinue} />
      ) : (
        <div className="flex flex-col justify-center items-center">
          <TimerDisplay
            timeLeft={timeLeft}
            isWorkMode={isWorkMode}
            totalTime={totalTime}
            fontSize="text-6xl sm:text-8xl"
            arcSize={dimensions.arcSize}
            strokeWidth={dimensions.strokeWidth}
          />

          <TimerControls
            isWorkMode={isWorkMode}
            isRunning={isRunning}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            onNextMode={switchModes}
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
