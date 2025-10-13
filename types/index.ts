// Timer-related types
export interface TimerState {
  nextWorkSeconds: number;
  nextBreakSeconds: number;
  timeLeft: number;
  isWorkMode: boolean;
  isRunning: boolean;
  totalTime: number;
  showTransition: boolean;
  isSettingsOpen: boolean;
  skipTransition: boolean;
}

// Component prop types
export interface TimerDisplayProps {
  timeLeft: number;
  isWorkMode: boolean;
  totalTime: number;
  arcSize?: number;
  strokeWidth?: number;
  fontSize?: string;
}

export interface TimerControlsProps {
  isRunning: boolean;
  isWorkMode: boolean;
  onToggleTimer: () => void;
  onNextMode: () => void;
  onResetTimer: () => void;
  onOpenSettings: () => void;
}

export interface TransitionScreenProps {
  isWorkMode: boolean;
  onContinue: () => void;
}

export interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workTotalSeconds: number;
  breakTotalSeconds: number;
  skipTransition: boolean;
  onSave: (
    workSeconds: number,
    breakSeconds: number,
    skipTransition: boolean,
  ) => void;
}

export interface UseDimensionsReturn {
  arcSize: number;
  strokeWidth: number;
}

// Utility types
export type TimeInput = number | string;

export interface TimeValues {
  minutes: number;
  seconds: number;
}

// Additional types for useTimer hook
export interface TimerConfig {
  workSeconds: number;
  breakSeconds: number;
  nextWorkSeconds: number;
  nextBreakSeconds: number;
}

export interface TimerTiming {
  timerStartTime: number | null;
  pausedTimeLeft: number | null;
}

export interface TimerUI {
  showTransition: boolean;
  skipTransition: boolean;
  isSettingsOpen: boolean;
}

export interface AudioRefs {
  workSoundRef: React.RefObject<HTMLAudioElement>;
  breakSoundRef: React.RefObject<HTMLAudioElement>;
}

export interface UseTimerState extends TimerConfig, TimerTiming, TimerUI {
  timeLeft: number;
  isWorkMode: boolean;
  isRunning: boolean;
  totalTime: number;
}

export interface UseTimerActions {
  handleSettingsSave: (
    newWorkTotalSeconds: number,
    newBreakTotalSeconds: number,
    newSkipTransition: boolean,
  ) => void;
  toggleTimer: () => void;
  handleContinue: () => void;
  switchModes: (nextWorkSeconds: number, nextBreakSeconds: number) => void;
  resetTimer: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  openSettings: () => void;
  closeSettings: () => void;
}

export type UseTimerReturn = UseTimerState & UseTimerActions;
