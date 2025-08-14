import type { Attempt, AttemptAnswer, AttemptViolation } from "./types"

// Mock attempt data for development
const mockAttempts: Attempt[] = []

export class AttemptService {
  static async startAttempt(examId: string, userId: string): Promise<Attempt> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Check for existing attempt
    const existingAttempt = mockAttempts.find(
      (a) => a.examId === examId && a.userId === userId && a.status === "in_progress",
    )

    if (existingAttempt) {
      return existingAttempt
    }

    // Create new attempt
    const newAttempt: Attempt = {
      id: Date.now().toString(),
      userId,
      examId,
      answers: [],
      violations: [],
      startedAt: new Date(),
      maxScore: 100, // This would be calculated based on questions
      breakdown: {
        byTopic: {},
        byDifficulty: {},
      },
      status: "in_progress",
    }

    mockAttempts.push(newAttempt)
    return newAttempt
  }

  static async saveAnswers(attemptId: string, answers: AttemptAnswer[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const attempt = mockAttempts.find((a) => a.id === attemptId)
    if (attempt) {
      attempt.answers = answers
    }
  }

  static async submitAttempt(attemptId: string): Promise<Attempt> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const attempt = mockAttempts.find((a) => a.id === attemptId)
    if (!attempt) {
      throw new Error("Attempt not found")
    }

    // Calculate score (mock implementation)
    const score = Math.floor(Math.random() * 40) + 60 // Random score between 60-100

    attempt.submittedAt = new Date()
    attempt.score = score
    attempt.status = "submitted"

    return attempt
  }

  static async getAttempt(attemptId: string): Promise<Attempt | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockAttempts.find((a) => a.id === attemptId) || null
  }

  static async addViolation(attemptId: string, violation: AttemptViolation): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const attempt = mockAttempts.find((a) => a.id === attemptId)
    if (attempt) {
      attempt.violations.push(violation)
    }
  }
}
