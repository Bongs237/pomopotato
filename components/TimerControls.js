"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings, ChevronLast } from "lucide-react";
import { COLORS } from "@/lib/colors";

export default function TimerControls({
  isRunning,
  isWorkMode,
  onToggleTimer,
  onNextMode,
  onOpenSettings,
}) {
  const colors = isWorkMode ? COLORS.work : COLORS.break;

  return (
    <div className="flex items-center gap-4 md:relative bottom-50">
      <Button
        onClick={onToggleTimer}
        size="lg"
        className={`w-16 h-16 rounded-full ${colors.button}`}
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} />}
      </Button>

      <Button
        onClick={onNextMode}
        size="lg"
        variant="outline"
        className="w-16 h-16 rounded-full bg-transparent"
      >
        <ChevronLast size={24} />
      </Button>

      <Button
        onClick={onOpenSettings}
        size="lg"
        variant="outline"
        className="w-16 h-16 rounded-full bg-transparent"
      >
        <Settings size={24} />
      </Button>
    </div>
  );
}
