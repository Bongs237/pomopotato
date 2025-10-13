"use client";

import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  ChevronLast,
  EllipsisVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { COLORS } from "@/lib/colors";
import { TimerControlsProps } from "@/types";

export default function TimerControls({
  isRunning,
  isWorkMode,
  onToggleTimer,
  onNextMode,
  onResetTimer,
  onOpenSettings,
}: TimerControlsProps) {
  const colors = isWorkMode ? COLORS.work : COLORS.break;

  return (
    <div className="flex items-center gap-4 md:relative bottom-50">
      <Button
        onClick={onToggleTimer}
        size="lg"
        variant="default"
        className={`w-16 h-16 rounded-full ${colors.button}`}
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} />}
      </Button>

      <Button
        onClick={onOpenSettings}
        size="lg"
        variant="outline"
        className="w-16 h-16 rounded-full bg-transparent"
      >
        <Settings size={24} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="mx-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={onNextMode}
            className="cursor-pointer"
            inset
          >
            <ChevronLast className="mr-2 h-4 w-4" />
            skip to next mode
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onResetTimer}
            className="cursor-pointer"
            inset
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            reset timer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
