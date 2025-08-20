"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"

export default function TimerControls({ 
  isRunning, 
  isWorkMode, 
  onToggleTimer, 
  onResetTimer, 
  onOpenSettings 
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onToggleTimer}
        size="lg"
        className={`w-16 h-16 rounded-full ${
          isWorkMode ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} />}
      </Button>

      <Button 
        onClick={onResetTimer} 
        size="lg" 
        variant="outline" 
        className="w-16 h-16 rounded-full bg-transparent"
      >
        <RotateCcw size={24} />
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
