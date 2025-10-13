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

export interface TimerActions {
  switchModes: (workSeconds: number, breakSeconds: number) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  handleContinue: () => void;
  skipTransition: () => void;
  handleSettingsSave: (
    workSeconds: number,
    breakSeconds: number,
    skipTransition: boolean,
  ) => void;
  openSettings: () => void;
  closeSettings: () => void;
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

// Hook return types
export interface UseTimerReturn extends TimerState, TimerActions {}

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
