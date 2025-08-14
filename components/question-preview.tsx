"use client"

import { type Question, QuestionType } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle } from "lucide-react"

interface QuestionPreviewProps {
  question: Question
  showAnswer?: boolean
  selectedAnswers?: string[]
  onAnswerChange?: (answers: string[]) => void
  disabled?: boolean
}

export function QuestionPreview({
  question,
  showAnswer = false,
  selectedAnswers = [],
  onAnswerChange,
  disabled = false,
}: QuestionPreviewProps) {
  const handleSingleSelect = (optionId: string) => {
    if (!disabled && onAnswerChange) {
      onAnswerChange([optionId])
    }
  }

  const handleMultiSelect = (optionId: string, checked: boolean) => {
    if (!disabled && onAnswerChange) {
      if (checked) {
        onAnswerChange([...selectedAnswers, optionId])
      } else {
        onAnswerChange(selectedAnswers.filter((id) => id !== optionId))
      }
    }
  }

  const handleNumericalChange = (value: string) => {
    if (!disabled && onAnswerChange) {
      onAnswerChange([value])
    }
  }

  const renderOptions = () => {
    switch (question.type) {
      case QuestionType.SINGLE_CORRECT:
        return (
          <RadioGroup value={selectedAnswers[0] || ""} onValueChange={handleSingleSelect} disabled={disabled}>
            {question.options.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className={`flex-1 cursor-pointer ${
                    showAnswer && option.isCorrect ? "text-green-600 font-medium" : ""
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option.text}
                  {showAnswer && option.isCorrect && <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />}
                  {showAnswer && !option.isCorrect && selectedAnswers.includes(option.id) && (
                    <XCircle className="inline h-4 w-4 ml-2 text-red-600" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case QuestionType.MULTI_SELECT:
        return (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedAnswers.includes(option.id)}
                  onCheckedChange={(checked) => handleMultiSelect(option.id, !!checked)}
                  disabled={disabled}
                />
                <Label
                  htmlFor={option.id}
                  className={`flex-1 cursor-pointer ${
                    showAnswer && option.isCorrect ? "text-green-600 font-medium" : ""
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option.text}
                  {showAnswer && option.isCorrect && <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />}
                  {showAnswer && !option.isCorrect && selectedAnswers.includes(option.id) && (
                    <XCircle className="inline h-4 w-4 ml-2 text-red-600" />
                  )}
                </Label>
              </div>
            ))}
          </div>
        )

      case QuestionType.TRUE_FALSE:
        return (
          <RadioGroup value={selectedAnswers[0] || ""} onValueChange={handleSingleSelect} disabled={disabled}>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label
                  htmlFor={option.id}
                  className={`cursor-pointer ${showAnswer && option.isCorrect ? "text-green-600 font-medium" : ""}`}
                >
                  {option.text}
                  {showAnswer && option.isCorrect && <CheckCircle className="inline h-4 w-4 ml-2 text-green-600" />}
                  {showAnswer && !option.isCorrect && selectedAnswers.includes(option.id) && (
                    <XCircle className="inline h-4 w-4 ml-2 text-red-600" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case QuestionType.NUMERICAL:
        return (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Enter your answer"
              value={selectedAnswers[0] || ""}
              onChange={(e) => handleNumericalChange(e.target.value)}
              disabled={disabled}
              className={showAnswer && selectedAnswers[0] === question.options[0]?.text ? "border-green-500" : ""}
            />
            {showAnswer && <p className="text-sm text-green-600">Correct answer: {question.options[0]?.text}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{question.type.replace("_", " ")}</Badge>
              <Badge variant="outline">Difficulty: {question.difficulty}</Badge>
              {question.topic && <Badge variant="secondary">{question.topic}</Badge>}
            </div>
            <CardTitle className="text-lg leading-relaxed">{question.stem}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renderOptions()}

          {showAnswer && question.explanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}

          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-4 border-t">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
