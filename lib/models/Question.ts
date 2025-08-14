import mongoose, { Schema, type Document } from "mongoose"
import type { QuestionType } from "../types"

export interface IQuestion extends Document {
  stem: string
  type: QuestionType
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  correctCount: number
  tags: string[]
  topic: string
  subtopic?: string
  difficulty: number
  explanation?: string
  source?: string
  version: number
  history: Array<{
    version: number
    changes: string
    updatedBy: string
    updatedAt: Date
  }>
  createdBy: string
  updatedBy: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>(
  {
    stem: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["SINGLE_CORRECT", "MULTI_SELECT", "TRUE_FALSE", "NUMERICAL"],
      required: true,
    },
    options: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    correctCount: {
      type: Number,
      required: true,
      min: 1,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    subtopic: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    explanation: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    history: [
      {
        version: Number,
        changes: String,
        updatedBy: String,
        updatedAt: Date,
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
QuestionSchema.index({ topic: 1, difficulty: 1 })
QuestionSchema.index({ tags: 1 })
QuestionSchema.index({ createdBy: 1 })
QuestionSchema.index({ isPublished: 1 })
QuestionSchema.index({ stem: "text", topic: "text", tags: "text" })

export const Question = mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema)
