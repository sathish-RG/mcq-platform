"use client"

import { QuestionPreview } from "@/components/question-preview"
import type { Question } from "@/lib/types"

interface ExamQuestionProps {
  question: Question
  selectedAnswers: string[]
  onAnswerChange: (selectedOptions: string[]) => void
}

export function ExamQuestion({ question, selectedAnswers, onAnswerChange }: ExamQuestionProps) {
  return (
    <div className="space-y-4">
      <QuestionPreview
        question={question}
        selectedAnswers={selectedAnswers}
        onAnswerChange={onAnswerChange}
        showAnswer={false}
        disabled={false}
      />
    </div>
  )
}
