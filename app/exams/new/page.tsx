"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, ArrowRight, Save, Eye } from "lucide-react"
import Link from "next/link"
import { ExamService } from "@/lib/exam-service"
import { ExamBasicInfo } from "@/components/exam-builder/exam-basic-info"
import { ExamQuestionSelection } from "@/components/exam-builder/exam-question-selection"
import { ExamSettings } from "@/components/exam-builder/exam-settings"
import { ExamPreview } from "@/components/exam-builder/exam-preview"
import type { ExamSettings as ExamSettingsType, ProctoringSettings } from "@/lib/types"

export default function NewExamPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Form state
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
  })

  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const [randomizationRule, setRandomizationRule] = useState(null)

  const [examSettings, setExamSettings] = useState<ExamSettingsType>({
    duration: 60,
    attemptsAllowed: 1,
    negativeMarking: 0,
    partialCredit: false,
    shuffleQuestions: false,
    shuffleOptions: false,
    showSolutions: "never" as const,
  })

  const [proctoringSettings, setProctoringSettings] = useState<ProctoringSettings>({
    fullscreenRequired: false,
    maxTabSwitches: 3,
    blockCopyPaste: false,
    requireWebcam: false,
    requireMicrophone: false,
  })

  const steps = [
    { id: "basic", title: "Basic Info", description: "Exam title and description" },
    { id: "questions", title: "Questions", description: "Select or generate questions" },
    { id: "settings", title: "Settings", description: "Configure exam parameters" },
    { id: "preview", title: "Preview", description: "Review and publish" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async (isDraft = true) => {
    setLoading(true)

    const examData = {
      title: basicInfo.title,
      description: basicInfo.description,
      questions: selectedQuestions,
      randomizationRule,
      settings: examSettings,
      proctoring: proctoringSettings,
      visibility: isDraft ? ("draft" as const) : ("published" as const),
      createdBy: user?.id || "",
      updatedBy: user?.id || "",
    }

    try {
      const newExam = await ExamService.createExam(examData)
      router.push(`/exams/${newExam.id}`)
    } catch (error) {
      console.error("Error creating exam:", error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return basicInfo.title.trim() !== ""
      case 1:
        return selectedQuestions.length > 0 || randomizationRule !== null
      case 2:
        return true
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
              <p className="text-sm text-gray-600">Build your exam step by step</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/exams">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Exams
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      index <= currentStep ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${index <= currentStep ? "text-blue-600" : "text-gray-500"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${index < currentStep ? "bg-blue-600" : "bg-gray-300"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && <ExamBasicInfo basicInfo={basicInfo} onChange={setBasicInfo} />}

            {currentStep === 1 && (
              <ExamQuestionSelection
                selectedQuestions={selectedQuestions}
                randomizationRule={randomizationRule}
                onQuestionsChange={setSelectedQuestions}
                onRandomizationChange={setRandomizationRule}
              />
            )}

            {currentStep === 2 && (
              <ExamSettings
                examSettings={examSettings}
                proctoringSettings={proctoringSettings}
                onExamSettingsChange={setExamSettings}
                onProctoringSettingsChange={setProctoringSettings}
              />
            )}

            {currentStep === 3 && (
              <ExamPreview
                basicInfo={basicInfo}
                selectedQuestions={selectedQuestions}
                randomizationRule={randomizationRule}
                examSettings={examSettings}
                proctoringSettings={proctoringSettings}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            {currentStep === steps.length - 1 ? (
              <>
                <Button variant="outline" onClick={() => handleSave(true)} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button onClick={() => handleSave(false)} disabled={loading || !canProceed()}>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish Exam
                </Button>
              </>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
