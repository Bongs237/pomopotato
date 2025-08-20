"use client"

import { usePomodoroTimer } from "@/hooks/usePomodoroTimer"
import TimerDisplay from "@/components/TimerDisplay"
import SettingsDialog from "@/components/SettingsDialog"

export default function PomodoroTimer() {
  const {
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
  } = usePomodoroTimer();

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
        strokeWidth={20}
        fontSize="text-8xl"

        isRunning={isRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onOpenSettings={openSettings}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={closeSettings}
        workMinutes={workMinutes}
        workSeconds={workSeconds}
        breakMinutes={breakMinutes}
        breakSeconds={breakSeconds}
        onWorkMinutesChange={setWorkMinutes}
        onWorkSecondsChange={setWorkSeconds}
        onBreakMinutesChange={setBreakMinutes}
        onBreakSecondsChange={setBreakSeconds}
        onSave={handleSettingsSave}
      />
    </div>
  );
}
