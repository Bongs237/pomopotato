"use client";
import { useEffect } from "react";
import { motion } from "motion/react";

import TimerDisplay from "@/components/TimerDisplay";
import SettingsDialog from "@/components/SettingsDialog";
import TransitionScreen from "@/components/TransitionScreen";
import TimerControls from "@/components/TimerControls";

import useTitle from "@/hooks/useTitle";
import useDimensions from "@/hooks/dimensions";
import useTimer from "@/hooks/useTimer";

import { COLORS } from "@/lib/colors";

export default function PomodoroTimer() {
  const dimensions = useDimensions();
  const {
    // timer
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
  } = useTimer();
  useTitle(isWorkMode, timeLeft, showTransition);

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
            onNextMode={() => switchModes(nextWorkSeconds, nextBreakSeconds)}
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
