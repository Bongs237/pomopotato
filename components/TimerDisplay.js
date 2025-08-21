"use client";

import TimerControls from "@/components/TimerControls";
import { formatTime } from "@/lib/time_utils";
import { COLORS } from "@/lib/colors";

export default function TimerDisplay({
  timeLeft,
  isWorkMode,
  totalTime,
  arcSize = 400,
  strokeWidth = 20,
  fontSize = "text-6xl",

  timerControlsProps,
}) {
  // Calculate progress for the arc
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Calculate radius based on size (keeping some padding)
  const radius = arcSize * 0.45; // 45% of size for radius
  const center = arcSize / 2;

  const colors = isWorkMode ? COLORS.work : COLORS.break;

  return (
    <div className="relative">
      <svg width={arcSize} height={arcSize} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.strokeLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${2 * Math.PI * radius}`}
          strokeDashoffset={`${2 * Math.PI * radius * (1 - progress / 100)}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mb-10">
          <div
            className={`text-sm md:text-lg font-medium mb-4 px-4 py-2 rounded-full ${colors.badge}`}
          >
            {isWorkMode ? "work 💪" : "break 😴"}
          </div>

          <div className={`font-bold text-gray-800 ${fontSize}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
}
