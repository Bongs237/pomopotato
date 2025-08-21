"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { COLORS } from "@/lib/colors";
import { useEffect, useRef } from "react";

export default function TransitionScreen({ isWorkMode, onContinue }) {
  const nextMode = !isWorkMode ? "work" : "break";
  const colors = !isWorkMode ? COLORS.work : COLORS.break;
  const notificationSentRef = useRef(false);

  useEffect(() => {
    document.title = `it's ${nextMode} time!`;

    // Send notification if permission is granted and we haven't sent one yet
    if (Notification.permission === "granted" && !notificationSentRef.current) {
      try {
        new Notification(`it's ${nextMode} time!`, {
          icon: "/favicon.ico", // You can replace this with a custom icon
          badge: "/favicon.ico",
          requireInteraction: false,
          silent: false,
        });
        notificationSentRef.current = true;
      } catch (error) {
        console.error("Failed to send notification:", error);
      }
    }
  }, [isWorkMode, nextMode]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className={`text-6xl font-bold mb-1 ${colors.text}`}>
          it's {!isWorkMode ? "work" : "break"} time!
        </h1>
      </div>

      <Button
        onClick={onContinue}
        size="lg"
        className={`px-8 py-4 text-lg font-semibold ${colors.button} text-white`}
      >
        <Play size={20} className="mr-2" />
        continue
      </Button>
    </div>
  );
}
