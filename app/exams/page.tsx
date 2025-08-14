"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { UserRole, type Exam } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Search, Edit, Trash2, Eye, Copy, MoreHorizontal, Clock, Users, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ExamService } from "@/lib/exam-service"

export default function ExamsPage() {
  const { user } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    loadExams()
  }, [])

  const loadExams = async () => {
    setLoading(true)
    const data = await ExamService.getExams({
      search: searchTerm,
      visibility: selectedStatus !== "all" ? (selectedStatus as any) : undefined,
      createdBy: user?.role === UserRole.INSTRUCTOR ? user.id : undefined,
    })
    setExams(data)
    setLoading(false)
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadExams()
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, selectedStatus])

  const handleDelete = async (examId: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      await ExamService.deleteExam(examId)
      loadExams()
    }
  }

  const handleDuplicate = async (examId: string) => {
    await ExamService.duplicateExam(examId)
    loadExams()
  }

  const handlePublish = async (examId: string) => {
    await ExamService.updateExam(examId, { visibility: "published" })
    loadExams()
  }

  const canCreate = user?.role !== UserRole.STUDENT
  const canEdit = user?.role !== UserRole.STUDENT
  const canDelete = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.role === UserRole.STUDENT ? "Available Exams" : "Exam Management"}
              </h1>
              <p className="text-sm text-gray-600">
                {user?.role === UserRole.STUDENT
                  ? "Take your assigned exams and view results"
                  : "Create and manage exams for your students"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            {canCreate && (
              <Link href="/exams/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Exam
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search exams by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {canEdit && (
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading exams...</div>
          ) : filteredExams.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : user?.role === UserRole.STUDENT
                      ? "No exams are currently available"
                      : "Get started by creating your first exam"}
                </p>
                {canCreate && (
                  <Link href="/exams/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Exam
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredExams.map((exam) => (
              <Card key={exam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getStatusColor(exam.visibility)}>{exam.visibility}</Badge>
                        <Badge variant="outline">{exam.questions.length} Questions</Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {exam.settings.duration} min
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{exam.title}</CardTitle>
                      <CardDescription className="text-base">{exam.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/${exam.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {user?.role === UserRole.STUDENT && exam.visibility === "published" && (
                          <DropdownMenuItem asChild>
                            <Link href={`/exams/${exam.id}/take`}>
                              <FileText className="h-4 w-4 mr-2" />
                              Take Exam
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {canEdit && (
                          <DropdownMenuItem asChild>
                            <Link href={`/exams/${exam.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {canEdit && exam.visibility === "draft" && (
                          <DropdownMenuItem onClick={() => handlePublish(exam.id)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        {canEdit && (
                          <DropdownMenuItem onClick={() => handleDuplicate(exam.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem onClick={() => handleDelete(exam.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Attempts: {exam.settings.attemptsAllowed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span>Negative Marking: {exam.settings.negativeMarking}</span>
                    </div>
                    <div className="text-gray-600">Created: {new Date(exam.createdAt).toLocaleDateString()}</div>
                  </div>

                  {exam.settings.startWindow && exam.settings.endWindow && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Exam Window:</strong> {new Date(exam.settings.startWindow).toLocaleString()} -{" "}
                        {new Date(exam.settings.endWindow).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
