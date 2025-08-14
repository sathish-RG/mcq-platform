import mongoose, { Schema, type Document } from "mongoose"
import { UserRole } from "../types"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  status: "active" | "inactive" | "suspended"
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)



export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
