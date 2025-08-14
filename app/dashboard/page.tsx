"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, BarChart3, Settings, PlusCircle, FileText } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return <div>Loading...</div>
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/users">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-gray-600 mb-2" />
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/settings">
                  <Button className="w-full">System Settings</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>View platform-wide statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/analytics">
                  <Button className="w-full">View Analytics</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      case UserRole.ADMIN:
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Question Bank</CardTitle>
                <CardDescription>Manage questions and question banks</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/questions">
                  <Button className="w-full">Manage Questions</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Exams</CardTitle>
                <CardDescription>Create and manage exams</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/exams">
                  <Button className="w-full">Manage Exams</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage instructors and students</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/users">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      case UserRole.INSTRUCTOR:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <PlusCircle className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Create Questions</CardTitle>
                <CardDescription>Add new questions to your question bank</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/questions/new">
                  <Button className="w-full">Create Question</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>My Exams</CardTitle>
                <CardDescription>Create and manage your exams</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/exams">
                  <Button className="w-full">Manage Exams</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View student performance and question analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/analytics">
                  <Button className="w-full">View Analytics</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      case UserRole.STUDENT:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Available Exams</CardTitle>
                <CardDescription>Take your assigned exams</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/exams">
                  <Button className="w-full">View Exams</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>My Results</CardTitle>
                <CardDescription>View your exam results and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/results">
                  <Button className="w-full">View Results</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return <div>Invalid user role</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">MCQ Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.name} ({user.role.replace("_", " ")})
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            {user.role === UserRole.STUDENT
              ? "Access your exams and view your progress"
              : "Manage your platform resources and view analytics"}
          </p>
        </div>

        {getDashboardContent()}
      </main>
    </div>
  )
}
