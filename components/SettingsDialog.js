"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsDialog({
  isOpen,
  onOpenChange,
  workMinutes,
  workSeconds,
  breakMinutes,
  breakSeconds,
  onWorkMinutesChange,
  onWorkSecondsChange,
  onBreakMinutesChange,
  onBreakSecondsChange,
  onSave
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
                  max="59"
                  value={workMinutes}
                  onChange={(e) => onWorkMinutesChange(Number.parseInt(e.target.value) || 0)}
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
                  max="59"
                  value={workSeconds}
                  onChange={(e) => onWorkSecondsChange(Number.parseInt(e.target.value) || 0)}
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
                  max="59"
                  value={breakMinutes}
                  onChange={(e) => onBreakMinutesChange(Number.parseInt(e.target.value) || 0)}
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
                  max="59"
                  value={breakSeconds}
                  onChange={(e) => onBreakSecondsChange(Number.parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Button onClick={onSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
