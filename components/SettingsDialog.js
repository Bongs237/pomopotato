"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsDialog({
  isOpen,
  onOpenChange,

  workTotalSeconds,
  breakTotalSeconds,
  
  onSave,
}) {
  // Convert total seconds to minutes and seconds for display
  const workMinutes = Math.floor(workTotalSeconds / 60);
  const workSeconds = workTotalSeconds % 60;
  const breakMinutes = Math.floor(breakTotalSeconds / 60);
  const breakSeconds = breakTotalSeconds % 60;

  const [localWorkMinutes, setLocalWorkMinutes] = useState(workMinutes);
  const [localWorkSeconds, setLocalWorkSeconds] = useState(workSeconds);

  const [localBreakMinutes, setLocalBreakMinutes] = useState(breakMinutes);
  const [localBreakSeconds, setLocalBreakSeconds] = useState(breakSeconds);

  useEffect(() => {
    setLocalWorkMinutes(workMinutes);
    setLocalWorkSeconds(workSeconds);
    setLocalBreakMinutes(breakMinutes);
    setLocalBreakSeconds(breakSeconds);
  }, [workTotalSeconds, breakTotalSeconds]);

  const sendSetTimes = () => {
    const newWorkTotalSeconds = localWorkMinutes * 60 + localWorkSeconds;
    const newBreakTotalSeconds = localBreakMinutes * 60 + localBreakSeconds;
    
    onSave(newWorkTotalSeconds, newBreakTotalSeconds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Work time settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Work Time</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="work-minutes" className="text-sm text-gray-600">
                  Minutes
                </Label>
                <Input
                  id="work-minutes"
                  type="number"
                  value={localWorkMinutes}
                  onChange={(e) => setLocalWorkMinutes(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="work-seconds" className="text-sm text-gray-600">
                  Seconds
                </Label>
                <Input
                  id="work-seconds"
                  type="number"
                  value={localWorkSeconds}
                  onChange={(e) => setLocalWorkSeconds(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Break time settings */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Break Time</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="break-minutes" className="text-sm text-gray-600">
                  Minutes
                </Label>
                <Input
                  id="break-minutes"
                  type="number"
                  value={localBreakMinutes}
                  onChange={(e) => setLocalBreakMinutes(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="break-seconds" className="text-sm text-gray-600">
                  Seconds
                </Label>
                <Input
                  id="break-seconds"
                  type="number"
                  value={localBreakSeconds}
                  onChange={(e) => setLocalBreakSeconds(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={sendSetTimes} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
