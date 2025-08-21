"use client"

import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { COLORS } from "@/lib/colors"
import { useEffect } from "react";

export default function TransitionScreen({ 
  nextMode, 
  onContinue 
}) {
  const isWorkMode = nextMode === 'work';
  const colors = isWorkMode ? COLORS.work : COLORS.break;

  useEffect(() => {
    document.title = `it's ${nextMode} time!`;
    
    // Request notification permission and send notification
    const sendNotification = async () => {
      try {
        // Request permission if not already granted
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            return; // User denied permission
          }
        }
        
        // Send notification if permission is granted
        if (Notification.permission === 'granted') {
          new Notification(`it's ${nextMode} time!`, {
            icon: '/favicon.ico', // You can replace this with a custom icon
            badge: '/favicon.ico',
            tag: 'pomodoro-transition', // Prevents duplicate notifications
            requireInteraction: false,
            silent: false
          });
        }
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    };

    sendNotification();
  }, [nextMode, isWorkMode]);
  
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className={`text-6xl font-bold mb-1 ${colors.text}`}>
          it's {isWorkMode ? "work" : "break"} time!
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
