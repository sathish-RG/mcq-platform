import type { Exam, RandomizationRule } from "./types"

// Mock exam data for development
const mockExams: Exam[] = [
  {
    id: "1",
    title: "Mathematics Final Exam 2024",
    description: "Comprehensive final exam covering algebra, geometry, and calculus topics.",
    questions: ["1", "2", "3"],
    settings: {
      duration: 120,
      attemptsAllowed: 1,
      negativeMarking: -0.25,
      partialCredit: true,
      shuffleQuestions: true,
      shuffleOptions: true,
      showSolutions: "after_submit" as const,
    },
    proctoring: {
      fullscreenRequired: true,
      maxTabSwitches: 2,
      blockCopyPaste: true,
      requireWebcam: false,
      requireMicrophone: false,
    },
    visibility: "published" as const,
    createdBy: "instructor@mcq.com",
    updatedBy: "instructor@mcq.com",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "Physics Quiz - Chapter 5",
    description: "Quick quiz on thermodynamics and heat transfer.",
    questions: ["1", "3"],
    settings: {
      duration: 30,
      attemptsAllowed: 2,
      negativeMarking: 0,
      partialCredit: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      showSolutions: "after_window" as const,
      startWindow: new Date("2024-02-01T09:00:00"),
      endWindow: new Date("2024-02-01T17:00:00"),
    },
    proctoring: {
      fullscreenRequired: false,
      maxTabSwitches: 5,
      blockCopyPaste: false,
      requireWebcam: false,
      requireMicrophone: false,
    },
    visibility: "draft" as const,
    createdBy: "instructor@mcq.com",
    updatedBy: "instructor@mcq.com",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
]

interface ExamFilters {
  search?: string
  visibility?: "draft" | "published" | "archived"
  createdBy?: string
}

export class ExamService {
  static async getExams(filters: ExamFilters = {}): Promise<Exam[]> {
    // Mock API call - simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    let filtered = [...mockExams]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (exam) => exam.title.toLowerCase().includes(search) || exam.description.toLowerCase().includes(search),
      )
    }

    if (filters.visibility) {
      filtered = filtered.filter((exam) => exam.visibility === filters.visibility)
    }

    if (filters.createdBy) {
      filtered = filtered.filter((exam) => exam.createdBy === filters.createdBy)
    }

    return filtered
  }

  static async getExam(id: string): Promise<Exam | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockExams.find((exam) => exam.id === id) || null
  }

  static async createExam(examData: Partial<Exam>): Promise<Exam> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newExam: Exam = {
      id: Date.now().toString(),
      title: examData.title || "",
      description: examData.description || "",
      questions: examData.questions || [],
      randomizationRule: examData.randomizationRule,
      settings: examData.settings || {
        duration: 60,
        attemptsAllowed: 1,
        negativeMarking: 0,
        partialCredit: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        showSolutions: "never" as const,
      },
      proctoring: examData.proctoring || {
        fullscreenRequired: false,
        maxTabSwitches: 3,
        blockCopyPaste: false,
        requireWebcam: false,
        requireMicrophone: false,
      },
      visibility: examData.visibility || ("draft" as const),
      createdBy: examData.createdBy || "",
      updatedBy: examData.updatedBy || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockExams.push(newExam)
    return newExam
  }

  static async updateExam(id: string, updates: Partial<Exam>): Promise<Exam | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = mockExams.findIndex((exam) => exam.id === id)
    if (index === -1) return null

    const updatedExam = {
      ...mockExams[index],
      ...updates,
      updatedAt: new Date(),
    }

    mockExams[index] = updatedExam
    return updatedExam
  }

  static async deleteExam(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockExams.findIndex((exam) => exam.id === id)
    if (index === -1) return false

    mockExams.splice(index, 1)
    return true
  }

  static async duplicateExam(id: string): Promise<Exam | null> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const original = mockExams.find((exam) => exam.id === id)
    if (!original) return null

    const duplicate: Exam = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Copy)`,
      visibility: "draft" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockExams.push(duplicate)
    return duplicate
  }

  static async resolveRandomizedQuestions(rule: RandomizationRule): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock implementation - in real app, this would query the database
    // and select questions based on the randomization rule
    const mockQuestionIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

    // Shuffle and take the required number
    const shuffled = mockQuestionIds.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, rule.totalQuestions)
  }
}
