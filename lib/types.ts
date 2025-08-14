// User roles and permissions
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
  STUDENT = "student",
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  status: "active" | "inactive" | "suspended"
  createdAt: Date
  updatedAt: Date
}

// Question types and structures
export enum QuestionType {
  SINGLE_CORRECT = "single_correct",
  MULTI_SELECT = "multi_select",
  TRUE_FALSE = "true_false",
  NUMERICAL = "numerical",
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  stem: string // Supports Markdown + LaTeX
  options: QuestionOption[]
  type: QuestionType
  correctCount: number // For multi-select
  tags: string[]
  topic: string
  subtopic?: string
  difficulty: 1 | 2 | 3 | 4 | 5
  explanation?: string
  imageUrl?: string
  source?: string
  version: number
  history: QuestionVersion[]
  createdBy: string
  updatedBy: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface QuestionVersion {
  version: number
  changes: string
  updatedBy: string
  updatedAt: Date
}

// Exam structures
export interface ExamSettings {
  duration: number // minutes
  startWindow?: Date
  endWindow?: Date
  negativeMarking: number // e.g., -0.25
  partialCredit: boolean
  shuffleQuestions: boolean
  shuffleOptions: boolean
  attemptsAllowed: number
  showSolutions: "never" | "after_submit" | "after_window"
}

export interface ProctoringSettings {
  fullscreenRequired: boolean
  maxTabSwitches: number
  blockCopyPaste: boolean
  requireWebcam: boolean
  requireMicrophone: boolean
}

export interface RandomizationRule {
  totalQuestions: number
  difficultyDistribution: {
    easy: number // percentage
    medium: number
    hard: number
  }
  includeTags: string[]
  excludeTags: string[]
  topicDistribution?: Record<string, number>
}

export interface Exam {
  id: string
  title: string
  description: string
  questions: string[] // Question IDs
  randomizationRule?: RandomizationRule
  settings: ExamSettings
  proctoring: ProctoringSettings
  visibility: "draft" | "published" | "archived"
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

// Attempt and results
export interface AttemptAnswer {
  questionId: string
  selectedOptions: string[]
  timeSpent: number // seconds
  markedForReview: boolean
}

export interface AttemptViolation {
  type: "tab_switch" | "copy_paste" | "fullscreen_exit" | "suspicious_activity"
  timestamp: Date
  details?: string
}

export interface Attempt {
  id: string
  userId: string
  examId: string
  answers: AttemptAnswer[]
  violations: AttemptViolation[]
  startedAt: Date
  submittedAt?: Date
  score?: number
  maxScore: number
  breakdown: {
    byTopic: Record<string, { correct: number; total: number }>
    byDifficulty: Record<string, { correct: number; total: number }>
  }
  status: "in_progress" | "submitted" | "invalidated"
}

// Analytics
export interface UserAnalytics {
  userId: string
  totalAttempts: number
  averageScore: number
  averageTimePerQuestion: number
  topicMastery: Record<string, number>
  difficultyPerformance: Record<string, number>
  trends: {
    date: Date
    score: number
    timeSpent: number
  }[]
}

export interface AnalyticsData {
  overview: {
    totalCount: number
    averageScore: number
    completionRate: number
    changePercent: number
    streakCount: number
  }
  performanceTrends: Array<{
    date: string
    score: number
    attempts: number
  }>
  activitySummary: Array<{
    title: string
    description: string
    count: string
  }>
  studentMetrics?: {
    overallAverage: number
    bestSubject: string
    improvementArea: string
    avgTimePerQuestion: number
  }
  recentExams: Array<{
    title: string
    date: string
    score: number
  }>
  studentProgress: Array<{
    id: string
    name: string
    email: string
    averageScore: number
    examsCompleted: number
    lastActivity: string
    trend: "up" | "down"
  }>
  topicMastery: Array<{
    topic: string
    difficulty: string
    mastery: number
  }>
  topicBreakdown: Array<{
    name: string
    correct: number
    total: number
  }>
  questionMetrics?: {
    totalQuestions: number
    averageDifficulty: number
    discriminationIndex: number
    facilityValue: number
    flaggedQuestions: number
    recentlyAdded: number
    qualityDistribution: Array<{
      quality: string
      count: number
      percentage: number
    }>
    difficultyDistribution: Array<{
      difficulty: number
      count: number
    }>
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
