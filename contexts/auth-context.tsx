"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { AuthService } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("auth_token")
    if (token) {
      AuthService.validateToken(token).then((user) => {
        if (user) {
          setUser(user)
        } else {
          localStorage.removeItem("auth_token")
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await AuthService.login(email, password)
      if (result) {
        setUser(result.user)
        localStorage.setItem("auth_token", result.token)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (userData: { name: string; email: string; password: string }): Promise<boolean> => {
    try {
      const result = await AuthService.register(userData)
      setUser(result.user)
      localStorage.setItem("auth_token", result.token)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
