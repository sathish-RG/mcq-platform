"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Flag, ArrowLeft, ArrowRight, Send } from "lucide-react"
import { ExamService } from "@/lib/exam-service"
import { AttemptService } from "@/lib/attempt-service"
import { QuestionService } from "@/lib/question-service"
import { ExamTimer } from "@/components/exam-taking/exam-timer"
import { QuestionNavigation } from "@/components/exam-taking/question-navigation"
import { ExamQuestion } from "@/components/exam-taking/exam-question"
import { ProctoringMonitor } from "@/components/exam-taking/proctoring-monitor"
import type { Exam, Question, Attempt, AttemptAnswer } from "@/lib/types"

export default function TakeExamPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string

  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AttemptAnswer>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [violations, setViolations] = useState<any[]>([])

  // Load exam and start attempt
  useEffect(() => {
    initializeExam()
  }, [examId])

  const initializeExam = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load exam details
      const examData = await ExamService.getExam(examId)
      if (!examData) {
        router.push("/exams")
        return
      }
      setExam(examData)

      // Load questions
      const questionPromises = examData.questions.map((id) => QuestionService.getQuestion(id))
      const questionResults = await Promise.all(questionPromises)
      const validQuestions = questionResults.filter((q): q is Question => q !== null)

      // Shuffle questions if required
      if (examData.settings.shuffleQuestions) {
        validQuestions.sort(() => Math.random() - 0.5)
      }

      // Shuffle options if required
      if (examData.settings.shuffleOptions) {
        validQuestions.forEach((q) => {
          if (q.type !== "TRUE_FALSE") {
            q.options.sort(() => Math.random() - 0.5)
          }
        })
      }

      setQuestions(validQuestions)

      // Start or resume attempt
      const attemptData = await AttemptService.startAttempt(examId, user.id)
      setAttempt(attemptData)

      // Initialize answers from existing attempt
      const initialAnswers: Record<string, AttemptAnswer> = {}
      attemptData.answers.forEach((answer) => {
        initialAnswers[answer.questionId] = answer
      })
      setAnswers(initialAnswers)

      // Calculate time remaining
      const elapsed = Date.now() - new Date(attemptData.startedAt).getTime()
      const totalTime = examData.settings.duration * 60 * 1000 // Convert to milliseconds
      const remaining = Math.max(0, totalTime - elapsed)
      setTimeRemaining(remaining)
    } catch (error) {
      console.error("Error initializing exam:", error)
      router.push("/exams")
    } finally {
      setLoading(false)
    }
  }

  // Auto-save answers every 10 seconds
  useEffect(() => {
    if (!attempt) return

    const interval = setInterval(() => {
      saveAnswers()
    }, 10000)

    return () => clearInterval(interval)
  }, [answers, attempt])

  const saveAnswers = useCallback(async () => {
    if (!attempt) return

    try {
      await AttemptService.saveAnswers(attempt.id, Object.values(answers))
    } catch (error) {
      console.error("Error saving answers:", error)
    }
  }, [answers, attempt])

  const handleAnswerChange = (questionId: string, selectedOptions: string[]) => {
    const newAnswer: AttemptAnswer = {
      questionId,
      selectedOptions,
      timeSpent: answers[questionId]?.timeSpent || 0,
      markedForReview: answers[questionId]?.markedForReview || false,
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswer,
    }))
  }

  const handleMarkForReview = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        markedForReview: !prev[questionId]?.markedForReview,
      },
    }))
  }

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleTimeUp = () => {
    submitExam()
  }

  const handleViolation = (violation: any) => {
    setViolations((prev) => [...prev, violation])
  }

  const submitExam = async () => {
    if (!attempt) return

    setSubmitting(true)
    try {
      await saveAnswers() // Save final answers
      const result = await AttemptService.submitAttempt(attempt.id)
      router.push(`/exams/${examId}/result/${attempt.id}`)
    } catch (error) {
      console.error("Error submitting exam:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const getQuestionStatus = (questionId: string) => {
    const answer = answers[questionId]
    if (answer?.markedForReview) return "review"
    if (answer?.selectedOptions.length > 0) return "answered"
    return "not-visited"
  }

  const getAnsweredCount = () => {
    return Object.values(answers).filter((a) => a.selectedOptions.length > 0).length
  }

  const getReviewCount = () => {
    return Object.values(answers).filter((a) => a.markedForReview).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    )
  }

  if (!exam || !attempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Exam Not Available</h3>
            <p className="text-gray-600 mb-4">This exam is not available or you don't have permission to take it.</p>
            <Button onClick={() => router.push("/exams")}>Back to Exams</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Proctoring Monitor */}
      {exam.proctoring && <ProctoringMonitor settings={exam.proctoring} onViolation={handleViolation} />}

      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ExamTimer timeRemaining={timeRemaining} onTimeUp={handleTimeUp} />

              <div className="text-sm text-gray-600">
                <span className="font-medium">{getAnsweredCount()}</span> answered,
                <span className="font-medium ml-1">{getReviewCount()}</span> for review
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              questions={questions}
              currentIndex={currentQuestionIndex}
              answers={answers}
              onQuestionSelect={handleQuestionNavigation}
              getQuestionStatus={getQuestionStatus}
            />
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Violations Alert */}
              {violations.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: {violations.length} violation(s) detected. Continued violations may result in exam
                    termination.
                  </AlertDescription>
                </Alert>
              )}

              {/* Current Question */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMarkForReview(currentQuestion.id)}>
                        <Flag
                          className={`h-4 w-4 mr-2 ${answers[currentQuestion.id]?.markedForReview ? "text-orange-500" : ""}`}
                        />
                        {answers[currentQuestion.id]?.markedForReview ? "Unmark" : "Mark for Review"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ExamQuestion
                    question={currentQuestion}
                    selectedAnswers={answers[currentQuestion.id]?.selectedOptions || []}
                    onAnswerChange={(selectedOptions) => handleAnswerChange(currentQuestion.id, selectedOptions)}
                  />
                </CardContent>
              </Card>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-4">
                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={() => setShowConfirmSubmit(true)} className="bg-green-600 hover:bg-green-700">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Exam
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Submit Exam</CardTitle>
              <CardDescription>
                Are you sure you want to submit your exam? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <p>
                    <strong>Answered:</strong> {getAnsweredCount()} of {questions.length} questions
                  </p>
                  <p>
                    <strong>Marked for Review:</strong> {getReviewCount()} questions
                  </p>
                  <p>
                    <strong>Time Remaining:</strong> {Math.floor(timeRemaining / 60000)} minutes
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={() => setShowConfirmSubmit(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button onClick={submitExam} disabled={submitting} className="bg-green-600 hover:bg-green-700">
                    {submitting ? "Submitting..." : "Submit Exam"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
