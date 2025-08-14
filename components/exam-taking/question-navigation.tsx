"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Flag } from "lucide-react"
import type { Question, AttemptAnswer } from "@/lib/types"

interface QuestionNavigationProps {
  questions: Question[]
  currentIndex: number
  answers: Record<string, AttemptAnswer>
  onQuestionSelect: (index: number) => void
  getQuestionStatus: (questionId: string) => "answered" | "review" | "not-visited"
}

export function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  onQuestionSelect,
  getQuestionStatus,
}: QuestionNavigationProps) {
  const getStatusIcon = (questionId: string) => {
    const status = getQuestionStatus(questionId)
    switch (status) {
      case "answered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "review":
        return <Flag className="h-4 w-4 text-orange-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (questionId: string) => {
    const status = getQuestionStatus(questionId)
    switch (status) {
      case "answered":
        return "bg-green-100 border-green-300 text-green-800"
      case "review":
        return "bg-orange-100 border-orange-300 text-orange-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-600"
    }
  }

  const answeredCount = questions.filter((q) => getQuestionStatus(q.id) === "answered").length
  const reviewCount = questions.filter((q) => getQuestionStatus(q.id) === "review").length
  const notVisitedCount = questions.length - answeredCount - reviewCount

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Question Palette</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Answered</span>
            </div>
            <Badge variant="secondary">{answeredCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-orange-500" />
              <span>For Review</span>
            </div>
            <Badge variant="secondary">{reviewCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>Not Visited</span>
            </div>
            <Badge variant="secondary">{notVisitedCount}</Badge>
          </div>
        </div>

        {/* Question Grid */}
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => (
            <Button
              key={question.id}
              variant="outline"
              size="sm"
              className={`
                h-10 w-10 p-0 relative
                ${index === currentIndex ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                ${getStatusColor(question.id)}
              `}
              onClick={() => onQuestionSelect(index)}
            >
              <span className="text-xs font-medium">{index + 1}</span>
              <div className="absolute -top-1 -right-1">{getStatusIcon(question.id)}</div>
            </Button>
          ))}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Not Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
            <span>Current Question</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
