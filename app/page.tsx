import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, BarChart3, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">MCQ Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Advanced MCQ Platform for
          <span className="text-blue-600"> Modern Education</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create, manage, and analyze multiple choice questions with powerful features like anti-cheat protection,
          detailed analytics, and role-based access control.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="px-8">
              Start Free Trial
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="px-8 bg-transparent">
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need for professional assessments
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Question Bank</CardTitle>
              <CardDescription>
                Create and manage questions with LaTeX support, bulk import/export, and versioning
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                SuperAdmin, Admin, Instructor, and Student roles with granular permissions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Detailed insights on performance, question quality, and learning outcomes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Anti-Cheat</CardTitle>
              <CardDescription>Proctoring features, fullscreen lock, and violation detection</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">MCQ Platform</span>
          </div>
          <p className="text-gray-400">© 2024 MCQ Platform. Built for modern education.</p>
        </div>
      </footer>
    </div>
  )
}
