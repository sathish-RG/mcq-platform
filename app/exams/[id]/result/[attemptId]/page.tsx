"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, Award, AlertTriangle, ArrowLeft } from "lucide-react"
import { AttemptService } from "@/lib/attempt-service"
import { ExamService } from "@/lib/exam-service"
import { QuestionService } from "@/lib/question-service"
import { QuestionPreview } from "@/components/question-preview"
import type { Attempt, Exam, Question } from "@/lib/types"

export default function ExamResultPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const examId = params.id as string
  const attemptId = params.attemptId as string

  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [attemptId, examId])

  const loadResults = async () => {
    try {
      setLoading(true)

      // Load attempt data
      const attemptData = await AttemptService.getAttempt(attemptId)
      if (!attemptData) {
        router.push("/exams")
        return
      }
      setAttempt(attemptData)

      // Load exam data
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
      setQuestions(validQuestions)
    } catch (error) {
      console.error("Error loading results:", error)
      router.push("/exams")
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const calculateTimeTaken = () => {
    if (!attempt?.startedAt || !attempt?.submittedAt) return "N/A"

    const start = new Date(attempt.startedAt).getTime()
    const end = new Date(attempt.submittedAt).getTime()
    const minutes = Math.floor((end - start) / 60000)
    const seconds = Math.floor(((end - start) % 60000) / 1000)

    return `${minutes}m ${seconds}s`
  }

  const getAnswerStatus = (questionId: string) => {
    const answer = attempt?.answers.find((a) => a.questionId === questionId)
    const question = questions.find((q) => q.id === questionId)

    if (!answer || !question) return "not-answered"

    const correctOptions = question.options.filter((opt) => opt.isCorrect).map((opt) => opt.id)
    const selectedOptions = answer.selectedOptions

    if (selectedOptions.length === 0) return "not-answered"

    // Check if answer is correct
    if (question.type === "SINGLE_CORRECT" || question.type === "TRUE_FALSE") {
      return correctOptions.includes(selectedOptions[0]) ? "correct" : "incorrect"
    } else if (question.type === "MULTI_SELECT") {
      const isCorrect =
        correctOptions.length === selectedOptions.length && correctOptions.every((opt) => selectedOptions.includes(opt))
      return isCorrect ? "correct" : "incorrect"
    } else if (question.type === "NUMERICAL") {
      return correctOptions[0] === selectedOptions[0] ? "correct" : "incorrect"
    }

    return "incorrect"
  }

  const getCorrectCount = () => {
    return questions.filter((q) => getAnswerStatus(q.id) === "correct").length
  }

  const getIncorrectCount = () => {
    return questions.filter((q) => getAnswerStatus(q.id) === "incorrect").length
  }

  const getNotAnsweredCount = () => {
    return questions.filter((q) => getAnswerStatus(q.id) === "not-answered").length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    )
  }

  if (!attempt || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Results Not Found</h3>
            <p className="text-gray-600 mb-4">Unable to load exam results.</p>
            <Button onClick={() => router.push("/exams")}>Back to Exams</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const score = attempt.score || 0
  const correctCount = getCorrectCount()
  const incorrectCount = getIncorrectCount()
  const notAnsweredCount = getNotAnsweredCount()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
            <p className="text-sm text-gray-600">{exam.title}</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/exams")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-yellow-500" />
                Your Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
                  <Badge variant={getScoreBadgeVariant(score)} className="mb-2">
                    {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                  <Progress value={score} className="w-full" />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">{correctCount}</div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mt-2" />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">{incorrectCount}</div>
                  <p className="text-sm text-gray-600">Incorrect Answers</p>
                  <XCircle className="h-6 w-6 text-red-600 mx-auto mt-2" />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-2">{notAnsweredCount}</div>
                  <p className="text-sm text-gray-600">Not Answered</p>
                  <Clock className="h-6 w-6 text-gray-600 mx-auto mt-2" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Time Taken:</span>
                  <span className="font-medium">{calculateTimeTaken()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Submitted:</span>
                  <span className="font-medium">
                    {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violations Warning */}
          {attempt.violations.length > 0 && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Violations Detected
                </CardTitle>
                <CardDescription>The following violations were recorded during your exam:</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attempt.violations.map((violation, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{violation.details}</span>
                      <span className="text-gray-500">{new Date(violation.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Results */}
          {exam.settings.showSolutions !== "never" && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="questions">Question Review</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>Breakdown of your performance by topic and difficulty</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Topic Performance */}
                      <div>
                        <h4 className="font-medium mb-3">Performance by Topic</h4>
                        <div className="space-y-2">
                          {Object.entries(
                            questions.reduce(
                              (acc, q) => {
                                const status = getAnswerStatus(q.id)
                                if (!acc[q.topic]) acc[q.topic] = { correct: 0, total: 0 }
                                acc[q.topic].total++
                                if (status === "correct") acc[q.topic].correct++
                                return acc
                              },
                              {} as Record<string, { correct: number; total: number }>,
                            ),
                          ).map(([topic, stats]) => (
                            <div key={topic} className="flex items-center justify-between">
                              <span className="text-sm">{topic}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {stats.correct}/{stats.total}
                                </span>
                                <Progress value={(stats.correct / stats.total) * 100} className="w-20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty Performance */}
                      <div>
                        <h4 className="font-medium mb-3">Performance by Difficulty</h4>
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((difficulty) => {
                            const difficultyQuestions = questions.filter((q) => q.difficulty === difficulty)
                            if (difficultyQuestions.length === 0) return null

                            const correct = difficultyQuestions.filter(
                              (q) => getAnswerStatus(q.id) === "correct",
                            ).length
                            const total = difficultyQuestions.length

                            return (
                              <div key={difficulty} className="flex items-center justify-between">
                                <span className="text-sm">Level {difficulty}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {correct}/{total}
                                  </span>
                                  <Progress value={(correct / total) * 100} className="w-20" />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions">
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const answer = attempt.answers.find((a) => a.questionId === question.id)
                    const status = getAnswerStatus(question.id)

                    return (
                      <Card key={question.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                            <Badge
                              variant={
                                status === "correct" ? "default" : status === "incorrect" ? "destructive" : "secondary"
                              }
                            >
                              {status === "correct" ? "Correct" : status === "incorrect" ? "Incorrect" : "Not Answered"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <QuestionPreview
                            question={question}
                            selectedAnswers={answer?.selectedOptions || []}
                            showAnswer={true}
                            disabled={true}
                          />
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
