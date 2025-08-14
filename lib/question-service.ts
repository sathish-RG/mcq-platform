import { connectToDatabase } from "./database"
import { Question } from "./models/Question"
import type { Question as QuestionType, QuestionType as QType } from "./types"
import { mockQuestions } from "./mock-data"

interface QuestionFilters {
  search?: string
  type?: QType
  difficulty?: number
  topic?: string
  tags?: string[]
  isPublished?: boolean
  createdBy?: string
}

export class QuestionService {
  static async getQuestions(filters: QuestionFilters = {}): Promise<QuestionType[]> {
    try {
      await connectToDatabase()

      const query: any = {}

      if (filters.search) {
        query.$text = { $search: filters.search }
      }

      if (filters.type) {
        query.type = filters.type
      }

      if (filters.difficulty) {
        query.difficulty = filters.difficulty
      }

      if (filters.topic) {
        query.topic = filters.topic
      }

      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags }
      }

      if (filters.isPublished !== undefined) {
        query.isPublished = filters.isPublished
      }

      if (filters.createdBy) {
        query.createdBy = filters.createdBy
      }

      const questions = await Question.find(query).sort({ createdAt: -1 })

      return questions.map((q) => ({
        id: q._id.toString(),
        stem: q.stem,
        type: q.type,
        options: q.options,
        correctCount: q.correctCount,
        tags: q.tags,
        topic: q.topic,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        explanation: q.explanation,
        source: q.source,
        version: q.version,
        history: q.history,
        createdBy: q.createdBy,
        updatedBy: q.updatedBy,
        isPublished: q.isPublished,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      }))
    } catch (error) {
      console.error("Error fetching questions:", error)
      return this.getMockQuestions(filters)
    }
  }

  private static getMockQuestions(filters: QuestionFilters = {}): QuestionType[] {
    let filtered = [...mockQuestions]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (q) =>
          q.stem.toLowerCase().includes(search) ||
          q.tags.some((tag) => tag.toLowerCase().includes(search)) ||
          q.topic.toLowerCase().includes(search),
      )
    }

    if (filters.type) {
      filtered = filtered.filter((q) => q.type === filters.type)
    }

    if (filters.difficulty) {
      filtered = filtered.filter((q) => q.difficulty === filters.difficulty)
    }

    if (filters.topic) {
      filtered = filtered.filter((q) => q.topic === filters.topic)
    }

    if (filters.isPublished !== undefined) {
      filtered = filtered.filter((q) => q.isPublished === filters.isPublished)
    }

    if (filters.createdBy) {
      filtered = filtered.filter((q) => q.createdBy === filters.createdBy)
    }

    return filtered
  }

  static async getQuestion(id: string): Promise<QuestionType | null> {
    try {
      await connectToDatabase()
      const question = await Question.findById(id)

      if (!question) return null

      return {
        id: question._id.toString(),
        stem: question.stem,
        type: question.type,
        options: question.options,
        correctCount: question.correctCount,
        tags: question.tags,
        topic: question.topic,
        subtopic: question.subtopic,
        difficulty: question.difficulty,
        explanation: question.explanation,
        source: question.source,
        version: question.version,
        history: question.history,
        createdBy: question.createdBy,
        updatedBy: question.updatedBy,
        isPublished: question.isPublished,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      }
    } catch (error) {
      console.error("Error fetching question:", error)
      return mockQuestions.find((q) => q.id === id) || null
    }
  }

  static async createQuestion(questionData: Partial<QuestionType>): Promise<QuestionType> {
    try {
      await connectToDatabase()

      const newQuestion = await Question.create(questionData)

      return {
        id: newQuestion._id.toString(),
        stem: newQuestion.stem,
        type: newQuestion.type,
        options: newQuestion.options,
        correctCount: newQuestion.correctCount,
        tags: newQuestion.tags,
        topic: newQuestion.topic,
        subtopic: newQuestion.subtopic,
        difficulty: newQuestion.difficulty,
        explanation: newQuestion.explanation,
        source: newQuestion.source,
        version: newQuestion.version,
        history: newQuestion.history,
        createdBy: newQuestion.createdBy,
        updatedBy: newQuestion.updatedBy,
        isPublished: newQuestion.isPublished,
        createdAt: newQuestion.createdAt,
        updatedAt: newQuestion.updatedAt,
      }
    } catch (error) {
      console.error("Error creating question:", error)
      throw error
    }
  }

  static async updateQuestion(id: string, updates: Partial<QuestionType>): Promise<QuestionType | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = mockQuestions.findIndex((q) => q.id === id)
    if (index === -1) return null

    const currentQuestion = mockQuestions[index]
    const updatedQuestion = {
      ...currentQuestion,
      ...updates,
      version: currentQuestion.version + 1,
      updatedAt: new Date(),
      history: [
        ...currentQuestion.history,
        {
          version: currentQuestion.version,
          changes: "Question updated",
          updatedBy: updates.updatedBy || currentQuestion.updatedBy,
          updatedAt: currentQuestion.updatedAt,
        },
      ],
    }

    mockQuestions[index] = updatedQuestion
    return updatedQuestion
  }

  static async deleteQuestion(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const index = mockQuestions.findIndex((q) => q.id === id)
    if (index === -1) return false

    mockQuestions.splice(index, 1)
    return true
  }

  static async duplicateQuestion(id: string): Promise<QuestionType | null> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const original = mockQuestions.find((q) => q.id === id)
    if (!original) return null

    const duplicate: QuestionType = {
      ...original,
      id: Date.now().toString(),
      stem: `${original.stem} (Copy)`,
      version: 1,
      history: [],
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockQuestions.push(duplicate)
    return duplicate
  }

  static async bulkImport(questions: Partial<QuestionType>[]): Promise<{ success: QuestionType[]; errors: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success: QuestionType[] = []
    const errors: string[] = []

    for (const questionData of questions) {
      try {
        if (!questionData.stem || !questionData.type) {
          errors.push("Missing required fields: stem and type")
          continue
        }

        const newQuestion = await this.createQuestion(questionData)
        success.push(newQuestion)
      } catch (error) {
        errors.push(`Failed to import question: ${error}`)
      }
    }

    return { success, errors }
  }

  static async exportQuestions(filters: QuestionFilters = {}): Promise<QuestionType[]> {
    return this.getQuestions(filters)
  }
}
