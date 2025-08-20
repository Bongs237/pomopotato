"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toMinSec } from "@/lib/time_utils"

export default function SettingsDialog({
  isOpen,
  onOpenChange,

  workTotalSeconds,
  breakTotalSeconds,
  
  onSave,
}) {
  const [workMinutes, workSeconds] = toMinSec(workTotalSeconds);
  const [breakMinutes, breakSeconds] = toMinSec(breakTotalSeconds);

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

  const parseOr0 = (strNum) => Number.parseInt(strNum) || 0;

  const handleChange = (setter) => (e) => {
    const val = e.target.value;
    if (val.trim() === "") {
      setter("");
      console.log("Thing 1")
    } else if (Number.parseInt(val)) {
      setter(Number.parseInt(val));
      console.log("Thing 2")
    } else {
      setter(0);
      console.log("Thing 3")
    }
  };

  const sendSetTimes = () => {
    const newWorkTotalSeconds = parseOr0(localWorkMinutes) * 60 + parseOr0(localWorkSeconds);
    const newBreakTotalSeconds = parseOr0(localBreakMinutes) * 60 + parseOr0(localBreakSeconds);
    
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
                  min="0"
                  value={localWorkMinutes}
                  onChange={handleChange(setLocalWorkMinutes)}
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
                  min="0"
                  value={localWorkSeconds}
                  onChange={handleChange(setLocalWorkSeconds)}
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
                  min="0"
                  value={localBreakMinutes}
                  onChange={handleChange(setLocalBreakMinutes)}
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
                  min="0"
                  value={localBreakSeconds}
                  onChange={handleChange(setLocalBreakSeconds)}
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
