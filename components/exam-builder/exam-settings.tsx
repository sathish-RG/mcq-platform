"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Clock, Shield } from "lucide-react"
import type { ExamSettings as ExamSettingsType, ProctoringSettings } from "@/lib/types"

interface ExamSettingsProps {
  examSettings: ExamSettingsType
  proctoringSettings: ProctoringSettings
  onExamSettingsChange: (settings: ExamSettingsType) => void
  onProctoringSettingsChange: (settings: ProctoringSettings) => void
}

export function ExamSettings({
  examSettings,
  proctoringSettings,
  onExamSettingsChange,
  onProctoringSettingsChange,
}: ExamSettingsProps) {
  const handleExamSettingChange = (field: keyof ExamSettingsType, value: any) => {
    onExamSettingsChange({ ...examSettings, [field]: value })
  }

  const handleProctoringChange = (field: keyof ProctoringSettings, value: any) => {
    onProctoringSettingsChange({ ...proctoringSettings, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Basic Exam Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <CardTitle>Exam Configuration</CardTitle>
          </div>
          <CardDescription>Configure timing, attempts, and scoring settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="480"
                value={examSettings.duration}
                onChange={(e) => handleExamSettingChange("duration", Number.parseInt(e.target.value) || 60)}
              />
              <p className="text-sm text-gray-600 mt-1">Maximum time allowed for the exam</p>
            </div>

            <div>
              <Label htmlFor="attempts">Attempts Allowed</Label>
              <Select
                value={examSettings.attemptsAllowed.toString()}
                onValueChange={(value) => handleExamSettingChange("attemptsAllowed", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Attempt</SelectItem>
                  <SelectItem value="2">2 Attempts</SelectItem>
                  <SelectItem value="3">3 Attempts</SelectItem>
                  <SelectItem value="5">5 Attempts</SelectItem>
                  <SelectItem value="999">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="negativeMarking">Negative Marking</Label>
              <Select
                value={examSettings.negativeMarking.toString()}
                onValueChange={(value) => handleExamSettingChange("negativeMarking", Number.parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Negative Marking</SelectItem>
                  <SelectItem value="-0.25">-0.25 per wrong answer</SelectItem>
                  <SelectItem value="-0.33">-0.33 per wrong answer</SelectItem>
                  <SelectItem value="-0.5">-0.5 per wrong answer</SelectItem>
                  <SelectItem value="-1">-1 per wrong answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="showSolutions">Show Solutions</Label>
              <Select
                value={examSettings.showSolutions}
                onValueChange={(value) => handleExamSettingChange("showSolutions", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="after_submit">After Submission</SelectItem>
                  <SelectItem value="after_window">After Exam Window</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Question & Answer Options</h4>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="partialCredit"
                  checked={examSettings.partialCredit}
                  onCheckedChange={(checked) => handleExamSettingChange("partialCredit", checked)}
                />
                <Label htmlFor="partialCredit">Allow partial credit for multi-select questions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shuffleQuestions"
                  checked={examSettings.shuffleQuestions}
                  onCheckedChange={(checked) => handleExamSettingChange("shuffleQuestions", checked)}
                />
                <Label htmlFor="shuffleQuestions">Shuffle question order for each student</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shuffleOptions"
                  checked={examSettings.shuffleOptions}
                  onCheckedChange={(checked) => handleExamSettingChange("shuffleOptions", checked)}
                />
                <Label htmlFor="shuffleOptions">Shuffle answer options within questions</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Exam Window (Optional)</h4>
            <p className="text-sm text-gray-600">
              Set specific start and end times for when students can take the exam
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startWindow">Start Date & Time</Label>
                <Input
                  id="startWindow"
                  type="datetime-local"
                  value={examSettings.startWindow ? new Date(examSettings.startWindow).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    handleExamSettingChange("startWindow", e.target.value ? new Date(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="endWindow">End Date & Time</Label>
                <Input
                  id="endWindow"
                  type="datetime-local"
                  value={examSettings.endWindow ? new Date(examSettings.endWindow).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    handleExamSettingChange("endWindow", e.target.value ? new Date(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proctoring Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle>Anti-Cheat & Proctoring</CardTitle>
          </div>
          <CardDescription>Configure security measures to prevent cheating</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fullscreenRequired"
                checked={proctoringSettings.fullscreenRequired}
                onCheckedChange={(checked) => handleProctoringChange("fullscreenRequired", checked)}
              />
              <Label htmlFor="fullscreenRequired">Require fullscreen mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="blockCopyPaste"
                checked={proctoringSettings.blockCopyPaste}
                onCheckedChange={(checked) => handleProctoringChange("blockCopyPaste", checked)}
              />
              <Label htmlFor="blockCopyPaste">Block copy/paste operations</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireWebcam"
                checked={proctoringSettings.requireWebcam}
                onCheckedChange={(checked) => handleProctoringChange("requireWebcam", checked)}
              />
              <Label htmlFor="requireWebcam">Require webcam access</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireMicrophone"
                checked={proctoringSettings.requireMicrophone}
                onCheckedChange={(checked) => handleProctoringChange("requireMicrophone", checked)}
              />
              <Label htmlFor="requireMicrophone">Require microphone access</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="maxTabSwitches">Maximum Tab Switches Allowed</Label>
            <Select
              value={proctoringSettings.maxTabSwitches.toString()}
              onValueChange={(value) => handleProctoringChange("maxTabSwitches", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No tab switching allowed</SelectItem>
                <SelectItem value="1">1 tab switch</SelectItem>
                <SelectItem value="2">2 tab switches</SelectItem>
                <SelectItem value="3">3 tab switches</SelectItem>
                <SelectItem value="5">5 tab switches</SelectItem>
                <SelectItem value="999">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">Students exceeding this limit may have their exam invalidated</p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <h4 className="font-medium text-yellow-900 mb-2">Proctoring Guidelines</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Enable fullscreen mode for high-stakes exams</li>
              <li>• Webcam/microphone requirements need student consent</li>
              <li>• Consider accessibility needs when setting restrictions</li>
              <li>• Test proctoring settings before the actual exam</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
