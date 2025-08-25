import { useEffect } from "react";
import { formatTime } from "@/lib/time_utils";

// Update title when mode changes
export default function useTitle(isWorkMode, timeLeft, showTransition) {
  useEffect(() => {
    if (!showTransition) {
      const modeText = isWorkMode ? "work" : "break";
      document.title = `${formatTime(timeLeft)} | ${modeText}`;
    }
  }, [isWorkMode, timeLeft, showTransition]);
}
