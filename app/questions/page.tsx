"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { UserRole, type Question, QuestionType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye, Copy, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { QuestionService } from "@/lib/question-service"

export default function QuestionsPage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    const data = await QuestionService.getQuestions({
      search: searchTerm,
      type: selectedType !== "all" ? (selectedType as QuestionType) : undefined,
      difficulty: selectedDifficulty !== "all" ? Number.parseInt(selectedDifficulty) : undefined,
      topic: selectedTopic !== "all" ? selectedTopic : undefined,
    })
    setQuestions(data)
    setLoading(false)
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadQuestions()
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, selectedType, selectedDifficulty, selectedTopic])

  const handleDelete = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await QuestionService.deleteQuestion(questionId)
      loadQuestions()
    }
  }

  const handleDuplicate = async (questionId: string) => {
    await QuestionService.duplicateQuestion(questionId)
    loadQuestions()
  }

  const canEdit = user?.role !== UserRole.STUDENT
  const canDelete = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN

  const filteredQuestions = questions.filter(
    (q) =>
      q.stem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const topics = [...new Set(questions.map((q) => q.topic).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
              <p className="text-sm text-gray-600">Manage your questions and question sets</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            {canEdit && (
              <Link href="/questions/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Question
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
            <div className="flex items-center justify-between">
              <CardTitle>Search & Filter</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {canEdit && (
                  <>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search questions by content or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label>Question Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value={QuestionType.SINGLE_CORRECT}>Single Correct</SelectItem>
                      <SelectItem value={QuestionType.MULTI_SELECT}>Multi Select</SelectItem>
                      <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                      <SelectItem value={QuestionType.NUMERICAL}>Numerical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="1">1 - Very Easy</SelectItem>
                      <SelectItem value="2">2 - Easy</SelectItem>
                      <SelectItem value="3">3 - Medium</SelectItem>
                      <SelectItem value="4">4 - Hard</SelectItem>
                      <SelectItem value="5">5 - Very Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Topic</Label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first question"}
                </p>
                {canEdit && (
                  <Link href="/questions/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Question
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={question.isPublished ? "default" : "secondary"}>
                          {question.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{question.type.replace("_", " ")}</Badge>
                        <Badge variant="outline">Difficulty: {question.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-lg mb-2">
                        {question.stem.substring(0, 100)}
                        {question.stem.length > 100 && "..."}
                      </CardTitle>
                      <CardDescription>
                        Topic: {question.topic} | Tags: {question.tags.join(", ")} | Version: {question.version}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/questions/${question.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem asChild>
                            <Link href={`/questions/${question.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {canEdit && (
                          <DropdownMenuItem onClick={() => handleDuplicate(question.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem onClick={() => handleDelete(question.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Created by: {question.createdBy}</span>
                    <span>Updated: {new Date(question.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
