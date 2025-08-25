"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { COLORS } from "@/lib/colors";
import { useEffect } from "react";

export default function TransitionScreen({ isWorkMode, onContinue }) {
  const nextMode = !isWorkMode ? "work" : "break";
  const colors = !isWorkMode ? COLORS.work : COLORS.break;

  useEffect(() => {
    document.title = `it's ${nextMode} time!`;
  }, [isWorkMode]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className={`text-5xl lg:text-6xl font-bold mb-1 ${colors.text}`}>
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

      <audio autoPlay>
        <source src={`${nextMode}.opus`} />
      </audio>
    </div>
  );
}
