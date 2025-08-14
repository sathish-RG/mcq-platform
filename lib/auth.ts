import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./database"
import { User } from "./models/User"
import { UserRole, type User as UserType } from "./types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock user data for development
const mockUsers: UserType[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@mcq.com",
    role: UserRole.SUPER_ADMIN,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "John Admin",
    email: "admin@mcq.com",
    role: UserRole.ADMIN,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Jane Instructor",
    email: "instructor@mcq.com",
    role: UserRole.INSTRUCTOR,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Bob Student",
    email: "student@mcq.com",
    role: UserRole.STUDENT,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export class AuthService {
  static async login(email: string, password: string): Promise<{ user: UserType; token: string } | null> {
    try {
      await connectToDatabase()

      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) return null

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) return null

      const token = this.generateToken(user)

      // Convert MongoDB document to plain object
      const userObj: UserType = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      return { user: userObj, token }
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  static async register(userData: {
    name: string
    email: string
    password: string
    role?: UserRole
  }): Promise<{ user: UserType; token: string }> {
    try {
      await connectToDatabase()

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() })
      if (existingUser) {
        throw new Error("User already exists")
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create new user
      const newUser = await User.create({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || UserRole.STUDENT,
      })

      const token = this.generateToken(newUser)

      const userObj: UserType = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }

      return { user: userObj, token }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  static async validateToken(token: string): Promise<UserType | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      await connectToDatabase()
      const user = await User.findById(decoded.userId)

      if (!user) return null

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      console.error("Token validation error:", error)
      return null
    }
  }

  private static generateToken(user: any): string {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )
  }

  static hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      [UserRole.SUPER_ADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.INSTRUCTOR]: 2,
      [UserRole.STUDENT]: 1,
    }

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
  }
}
