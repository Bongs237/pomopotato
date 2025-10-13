// all the timer logic goes here.
import { useState, useEffect, useRef } from "react";
import type { UseTimerReturn } from "@/types";

import { formatTime } from "@/lib/time_utils";
import { primeAudio } from "@/lib/audio";

const DEFAULT_WORK_SECS = 25 * 60;
const DEFAULT_BREAK_SECS = 5 * 60;

export default function useTimer(): UseTimerReturn {
  const [workSeconds, setWorkSeconds] = useState<number>(DEFAULT_WORK_SECS);
  const [breakSeconds, setBreakSeconds] = useState<number>(DEFAULT_BREAK_SECS);
  // this is for if you're in the middle of the timer running and you change settings
  // then it should only take effect on next cycle
  const [nextWorkSeconds, setNextWorkSeconds] = useState<number>(workSeconds);
  const [nextBreakSeconds, setNextBreakSeconds] =
    useState<number>(breakSeconds);

  const [timeLeft, setTimeLeft] = useState<number>(workSeconds);

  const [isWorkMode, setIsWorkMode] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [pausedTimeLeft, setPausedTimeLeft] = useState<number | null>(null);

  const [showTransition, setShowTransition] = useState<boolean>(false);
  const [skipTransition, setSkipTransition] = useState<boolean>(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const totalTime = isWorkMode ? workSeconds : breakSeconds;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const workSoundRef = useRef<HTMLAudioElement | null>(null);
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);

  // set up audio
  useEffect(() => {
    workSoundRef.current = new Audio("/work.opus");
    breakSoundRef.current = new Audio("/break.opus");
  }, []);

  // --- Local Storage ---

  // Load it
  useEffect(() => {
    const localWorkSeconds = localStorage.getItem("workSeconds");
    const localBreakSeconds = localStorage.getItem("breakSeconds");
    const localNextWorkSeconds = localStorage.getItem("nextWorkSeconds");
    const localNextBreakSeconds = localStorage.getItem("nextBreakSeconds");

    const localSkipTransition = localStorage.getItem("skipTransition");

    let localTimeLeft = localStorage.getItem("timeLeft");
    let localIsWorkMode = localStorage.getItem("isWorkMode");

    if (localWorkSeconds) {
      setWorkSeconds(Number(localWorkSeconds));
      setNextWorkSeconds(Number(localNextWorkSeconds));

      if (!localTimeLeft) {
        setTimeLeft(Number(localWorkSeconds));
      }
    }
    if (localBreakSeconds) {
      setBreakSeconds(Number(localBreakSeconds));
      setNextBreakSeconds(Number(localNextBreakSeconds));

      if (!localTimeLeft) {
        setTimeLeft(Number(localBreakSeconds));
      }
    }
    if (localSkipTransition !== null) {
      setSkipTransition(localSkipTransition === "true");
    }

    if (localTimeLeft) {
      setTimeLeft(Number(localTimeLeft));
      setPausedTimeLeft(Number(localTimeLeft));
    }

    if (localIsWorkMode) {
      setIsWorkMode(localIsWorkMode === "true");
    }
  }, []);

  const handleSettingsSave = (
    newWorkTotalSeconds: number,
    newBreakTotalSeconds: number,
    newSkipTransition: boolean,
  ): void => {
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

    localStorage.setItem("skipTransition", String(newSkipTransition));

    setIsSettingsOpen(false);
  };

  // Save current time left and mode in local storage, so you can pick up where you left off when reloading page
  useEffect(() => {
    if (timeLeft < 0) {
      return;
    }
    localStorage.setItem("timeLeft", String(timeLeft));
    localStorage.setItem("isWorkMode", String(isWorkMode));
  }, [timeLeft, isWorkMode]);

  useEffect(() => {
    localStorage.setItem("workSeconds", String(workSeconds));
    localStorage.setItem("breakSeconds", String(breakSeconds));
    localStorage.setItem("nextWorkSeconds", String(nextWorkSeconds));
    localStorage.setItem("nextBreakSeconds", String(nextBreakSeconds));
  }, [workSeconds, breakSeconds, nextWorkSeconds, nextBreakSeconds]);

  // title setting
  useEffect(() => {
    if (!showTransition) {
      const modeText = isWorkMode ? "work" : "break";
      document.title = `${formatTime(timeLeft)} | ${modeText}`;
    } else {
      const modeText = !isWorkMode ? "work" : "break";
      document.title = `it's ${modeText} time!`;
    }
  }, [timeLeft, isWorkMode, showTransition]);

  // --- Timer stuff ---
  useEffect(() => {
    if (isRunning && timerStartTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - timerStartTime) / 1000);
        const remainingTime = totalTime - elapsedSeconds;

        setTimeLeft(remainingTime);

        if (remainingTime < 0) {
          // Stop the timer
          setIsRunning(false);
          clearInterval(intervalRef.current);
          setTimerStartTime(null);

          // update w/ next cycle settings
          setWorkSeconds(nextWorkSeconds);
          setBreakSeconds(nextBreakSeconds);

          if (Notification.permission === "granted" && document.hidden) {
            try {
              new Notification(`it's ${!isWorkMode ? "work" : "break"} time!`, {
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                requireInteraction: false,
                silent: false,
              });
            } catch (error) {
              console.error("Failed to send notification:", error);
            }
          }

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

  const toggleTimer = (): void => {
    if (showTransition) {
      handleContinue();
      return;
    }

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

  const handleContinue = (): void => {
    setShowTransition(false);
    switchModes(nextWorkSeconds, nextBreakSeconds);
    setIsRunning(true);
  };

  const switchModes = (
    nextWorkSeconds: number,
    nextBreakSeconds: number,
  ): void => {
    setIsWorkMode((prev) => {
      const newTime = prev ? nextBreakSeconds : nextWorkSeconds;
      setTimeLeft(newTime);
      setPausedTimeLeft(null);
      setTimerStartTime(null);
      return !prev;
    });
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    setTimerStartTime(null);
    setPausedTimeLeft(null);

    setWorkSeconds(nextWorkSeconds);
    setBreakSeconds(nextBreakSeconds);

    setTimeLeft(totalTime);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.code === "Space") {
      toggleTimer();
    }
  };

  const openSettings = (): void => {
    setIsSettingsOpen(true);
  };

  const closeSettings = (): void => {
    setIsSettingsOpen(false);
  };

  return {
    // Timer configuration
    workSeconds,
    breakSeconds,
    nextWorkSeconds,
    nextBreakSeconds,

    // Timer state
    timeLeft,
    isWorkMode,
    isRunning,
    totalTime,
    timerStartTime,
    pausedTimeLeft,

    // UI state
    showTransition,
    skipTransition,
    isSettingsOpen,

    // Actions
    handleSettingsSave,
    toggleTimer,
    handleContinue,
    switchModes,
    resetTimer,
    handleKeyDown,
    openSettings,
    closeSettings,
  };
}
