"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Shield, Eye, FileText, Settings } from "lucide-react"
import { QuestionService } from "@/lib/question-service"
import { QuestionPreview } from "@/components/question-preview"
import type { Question, ExamSettings, ProctoringSettings, RandomizationRule } from "@/lib/types"

interface ExamPreviewProps {
  basicInfo: {
    title: string
    description: string
  }
  selectedQuestions: string[]
  randomizationRule: RandomizationRule | null
  examSettings: ExamSettings
  proctoringSettings: ProctoringSettings
}

export function ExamPreview({
  basicInfo,
  selectedQuestions,
  randomizationRule,
  examSettings,
  proctoringSettings,
}: ExamPreviewProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [selectedQuestions])

  const loadQuestions = async () => {
    if (selectedQuestions.length === 0) {
      setQuestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const questionPromises = selectedQuestions.map((id) => QuestionService.getQuestion(id))
      const questionResults = await Promise.all(questionPromises)
      const validQuestions = questionResults.filter((q): q is Question => q !== null)
      setQuestions(validQuestions)
    } catch (error) {
      console.error("Error loading questions:", error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const getQuestionTypeCount = (type: string) => {
    return questions.filter((q) => q.type === type).length
  }

  const getDifficultyCount = (difficulty: number) => {
    return questions.filter((q) => q.difficulty === difficulty).length
  }

  const getTopicCounts = () => {
    const counts: Record<string, number> = {}
    questions.forEach((q) => {
      counts[q.topic] = (counts[q.topic] || 0) + 1
    })
    return counts
  }

  const totalQuestions = randomizationRule ? randomizationRule.totalQuestions : selectedQuestions.length

  return (
    <div className="space-y-6">
      {/* Exam Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <CardTitle>Exam Overview</CardTitle>
          </div>
          <CardDescription>Review your exam configuration before publishing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{basicInfo.title}</h3>
            <p className="text-gray-600">{basicInfo.description}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                <strong>{totalQuestions}</strong> Questions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                <strong>{examSettings.duration}</strong> Minutes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                <strong>{examSettings.attemptsAllowed === 999 ? "Unlimited" : examSettings.attemptsAllowed}</strong>{" "}
                Attempts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                <strong>{examSettings.negativeMarking === 0 ? "No" : examSettings.negativeMarking}</strong> Negative
                Marking
              </span>
            </div>
          </div>

          {examSettings.startWindow && examSettings.endWindow && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Exam Window:</strong> {new Date(examSettings.startWindow).toLocaleString()} -{" "}
                {new Date(examSettings.endWindow).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Question Analysis</CardTitle>
          <CardDescription>Breakdown of questions by type, difficulty, and topic</CardDescription>
        </CardHeader>
        <CardContent>
          {randomizationRule ? (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-medium text-purple-900 mb-2">Smart Randomization Active</h4>
                <p className="text-sm text-purple-800">Questions will be randomly selected based on your criteria:</p>
                <ul className="text-sm text-purple-800 mt-2 space-y-1">
                  <li>• Total Questions: {randomizationRule.totalQuestions}</li>
                  <li>• Easy: {randomizationRule.difficultyDistribution.easy}%</li>
                  <li>• Medium: {randomizationRule.difficultyDistribution.medium}%</li>
                  <li>• Hard: {randomizationRule.difficultyDistribution.hard}%</li>
                </ul>
              </div>
            </div>
          ) : loading ? (
            <div className="text-center py-4">Loading question analysis...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No questions selected</div>
          ) : (
            <div className="space-y-6">
              {/* Question Types */}
              <div>
                <h4 className="font-medium mb-3">Question Types</h4>
                <div className="flex flex-wrap gap-2">
                  {getQuestionTypeCount("SINGLE_CORRECT") > 0 && (
                    <Badge variant="outline">Single Correct: {getQuestionTypeCount("SINGLE_CORRECT")}</Badge>
                  )}
                  {getQuestionTypeCount("MULTI_SELECT") > 0 && (
                    <Badge variant="outline">Multi Select: {getQuestionTypeCount("MULTI_SELECT")}</Badge>
                  )}
                  {getQuestionTypeCount("TRUE_FALSE") > 0 && (
                    <Badge variant="outline">True/False: {getQuestionTypeCount("TRUE_FALSE")}</Badge>
                  )}
                  {getQuestionTypeCount("NUMERICAL") > 0 && (
                    <Badge variant="outline">Numerical: {getQuestionTypeCount("NUMERICAL")}</Badge>
                  )}
                </div>
              </div>

              {/* Difficulty Distribution */}
              <div>
                <h4 className="font-medium mb-3">Difficulty Distribution</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((diff) => {
                    const count = getDifficultyCount(diff)
                    if (count === 0) return null
                    return (
                      <Badge key={diff} variant="secondary">
                        Level {diff}: {count} questions
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Topic Distribution */}
              <div>
                <h4 className="font-medium mb-3">Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(getTopicCounts()).map(([topic, count]) => (
                    <Badge key={topic} variant="outline">
                      {topic}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Summary</CardTitle>
          <CardDescription>Review your exam and proctoring settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Exam Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{examSettings.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Attempts:</span>
                  <span>{examSettings.attemptsAllowed === 999 ? "Unlimited" : examSettings.attemptsAllowed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Negative Marking:</span>
                  <span>{examSettings.negativeMarking === 0 ? "None" : examSettings.negativeMarking}</span>
                </div>
                <div className="flex justify-between">
                  <span>Partial Credit:</span>
                  <span>{examSettings.partialCredit ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shuffle Questions:</span>
                  <span>{examSettings.shuffleQuestions ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shuffle Options:</span>
                  <span>{examSettings.shuffleOptions ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Show Solutions:</span>
                  <span>{examSettings.showSolutions.replace("_", " ")}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Proctoring Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fullscreen Required:</span>
                  <span>{proctoringSettings.fullscreenRequired ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Tab Switches:</span>
                  <span>
                    {proctoringSettings.maxTabSwitches === 999 ? "Unlimited" : proctoringSettings.maxTabSwitches}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Block Copy/Paste:</span>
                  <span>{proctoringSettings.blockCopyPaste ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Require Webcam:</span>
                  <span>{proctoringSettings.requireWebcam ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Require Microphone:</span>
                  <span>{proctoringSettings.requireMicrophone ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Level Indicator */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Security Level:</span>
              <Badge
                variant={
                  proctoringSettings.fullscreenRequired &&
                  proctoringSettings.blockCopyPaste &&
                  proctoringSettings.maxTabSwitches <= 2
                    ? "destructive"
                    : proctoringSettings.fullscreenRequired || proctoringSettings.blockCopyPaste
                      ? "default"
                      : "secondary"
                }
              >
                {proctoringSettings.fullscreenRequired &&
                proctoringSettings.blockCopyPaste &&
                proctoringSettings.maxTabSwitches <= 2
                  ? "High Security"
                  : proctoringSettings.fullscreenRequired || proctoringSettings.blockCopyPaste
                    ? "Medium Security"
                    : "Basic Security"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Questions Preview */}
      {!randomizationRule && questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Questions</CardTitle>
            <CardDescription>Preview of the first few questions in your exam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.slice(0, 3).map((question, index) => (
                <div key={question.id}>
                  <h4 className="font-medium mb-2">Question {index + 1}</h4>
                  <QuestionPreview question={question} showAnswer={false} />
                  {index < 2 && <Separator className="mt-4" />}
                </div>
              ))}
              {questions.length > 3 && (
                <p className="text-sm text-gray-600 text-center pt-4">... and {questions.length - 3} more questions</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
