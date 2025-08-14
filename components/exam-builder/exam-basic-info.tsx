"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ExamBasicInfoProps {
  basicInfo: {
    title: string
    description: string
  }
  onChange: (info: { title: string; description: string }) => void
}

export function ExamBasicInfo({ basicInfo, onChange }: ExamBasicInfoProps) {
  const handleChange = (field: keyof typeof basicInfo, value: string) => {
    onChange({ ...basicInfo, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title">Exam Title *</Label>
        <Input
          id="title"
          placeholder="Enter exam title (e.g., 'Mathematics Final Exam 2024')"
          value={basicInfo.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
        <p className="text-sm text-gray-600 mt-1">
          Choose a clear, descriptive title that students will easily recognize
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide instructions, topics covered, or any important information for students..."
          value={basicInfo.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
        />
        <p className="text-sm text-gray-600 mt-1">Include exam instructions, topics covered, materials allowed, etc.</p>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-medium text-blue-900 mb-2">Tips for Better Exams</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use clear, specific titles that indicate subject and level</li>
          <li>• Include important instructions in the description</li>
          <li>• Mention any special requirements or materials needed</li>
          <li>• Set clear expectations about exam format and duration</li>
        </ul>
      </div>
    </div>
  )
}
