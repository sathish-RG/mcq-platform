import mongoose, { Schema, type Document } from "mongoose"

export interface IExam extends Document {
  title: string
  description: string
  questions: string[]
  randomizationRule?: {
    totalQuestions: number
    difficultyDistribution: Record<number, number>
    topicDistribution: Record<string, number>
  }
  settings: {
    duration: number
    attemptsAllowed: number
    negativeMarking: number
    partialCredit: boolean
    shuffleQuestions: boolean
    shuffleOptions: boolean
    showSolutions: "never" | "after_submit" | "after_window"
    startWindow?: Date
    endWindow?: Date
  }
  proctoring: {
    fullscreenRequired: boolean
    maxTabSwitches: number
    blockCopyPaste: boolean
    requireWebcam: boolean
    requireMicrophone: boolean
  }
  visibility: "draft" | "published" | "archived"
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

const ExamSchema = new Schema<IExam>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [
      {
        type: String,
        ref: "Question",
      },
    ],
    randomizationRule: {
      totalQuestions: Number,
      difficultyDistribution: Schema.Types.Mixed,
      topicDistribution: Schema.Types.Mixed,
    },
    settings: {
      duration: { type: Number, required: true, min: 1 },
      attemptsAllowed: { type: Number, required: true, min: 1 },
      negativeMarking: { type: Number, default: 0 },
      partialCredit: { type: Boolean, default: false },
      shuffleQuestions: { type: Boolean, default: false },
      shuffleOptions: { type: Boolean, default: false },
      showSolutions: {
        type: String,
        enum: ["never", "after_submit", "after_window"],
        default: "never",
      },
      startWindow: Date,
      endWindow: Date,
    },
    proctoring: {
      fullscreenRequired: { type: Boolean, default: false },
      maxTabSwitches: { type: Number, default: 3 },
      blockCopyPaste: { type: Boolean, default: false },
      requireWebcam: { type: Boolean, default: false },
      requireMicrophone: { type: Boolean, default: false },
    },
    visibility: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
ExamSchema.index({ createdBy: 1 })
ExamSchema.index({ visibility: 1 })
ExamSchema.index({ title: "text", description: "text" })

export const Exam = mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema)
