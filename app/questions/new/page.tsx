"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { QuestionType, type QuestionOption } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { QuestionService } from "@/lib/question-service"
import { QuestionPreview } from "@/components/question-preview"

export default function NewQuestionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Form state
  const [stem, setStem] = useState("")
  const [type, setType] = useState<QuestionType>(QuestionType.SINGLE_CORRECT)
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
  ])
  const [explanation, setExplanation] = useState("")
  const [topic, setTopic] = useState("")
  const [subtopic, setSubtopic] = useState("")
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [source, setSource] = useState("")

  const addOption = () => {
    const newId = (options.length + 1).toString()
    setOptions([...options, { id: newId, text: "", isCorrect: false }])
  }

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((opt) => opt.id !== id))
    }
  }

  const updateOption = (id: string, field: keyof QuestionOption, value: any) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (isDraft = false) => {
    setLoading(true)

    const correctCount = options.filter((opt) => opt.isCorrect).length

    const questionData = {
      stem,
      type,
      options,
      correctCount,
      explanation,
      topic,
      subtopic,
      difficulty,
      tags,
      source,
      isPublished: !isDraft,
      createdBy: user?.id || "",
      updatedBy: user?.id || "",
    }

    try {
      const newQuestion = await QuestionService.createQuestion(questionData)
      router.push(`/questions/${newQuestion.id}`)
    } catch (error) {
      console.error("Error creating question:", error)
    } finally {
      setLoading(false)
    }
  }

  const previewQuestion = {
    id: "preview",
    stem,
    type,
    options,
    correctCount: options.filter((opt) => opt.isCorrect).length,
    explanation,
    topic,
    subtopic,
    difficulty,
    tags,
    source,
    version: 1,
    history: [],
    createdBy: user?.id || "",
    updatedBy: user?.id || "",
    isPublished: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Question</h1>
              <p className="text-sm text-gray-600">Add a new question to your question bank</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/questions">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Questions
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the core details of your question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stem">Question Stem *</Label>
                  <Textarea
                    id="stem"
                    placeholder="Enter your question here. You can use Markdown and LaTeX formatting."
                    value={stem}
                    onChange={(e) => setStem(e.target.value)}
                    rows={4}
                    required
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Supports Markdown formatting and LaTeX math expressions (e.g., $$x^2 + y^2 = z^2$$)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Question Type *</Label>
                    <Select value={type} onValueChange={(value) => setType(value as QuestionType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={QuestionType.SINGLE_CORRECT}>Single Correct Answer</SelectItem>
                        <SelectItem value={QuestionType.MULTI_SELECT}>Multiple Select</SelectItem>
                        <SelectItem value={QuestionType.TRUE_FALSE}>True/False</SelectItem>
                        <SelectItem value={QuestionType.NUMERICAL}>Numerical Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select
                      value={difficulty.toString()}
                      onValueChange={(value) => setDifficulty(Number.parseInt(value) as 1 | 2 | 3 | 4 | 5)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Very Easy</SelectItem>
                        <SelectItem value="2">2 - Easy</SelectItem>
                        <SelectItem value="3">3 - Medium</SelectItem>
                        <SelectItem value="4">4 - Hard</SelectItem>
                        <SelectItem value="5">5 - Very Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer Options */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Answer Options</CardTitle>
                    <CardDescription>
                      {type === QuestionType.SINGLE_CORRECT && "Select one correct answer"}
                      {type === QuestionType.MULTI_SELECT && "Select all correct answers"}
                      {type === QuestionType.TRUE_FALSE && "Select True or False"}
                      {type === QuestionType.NUMERICAL && "Enter the correct numerical value"}
                    </CardDescription>
                  </div>
                  {type !== QuestionType.TRUE_FALSE && type !== QuestionType.NUMERICAL && (
                    <Button variant="outline" size="sm" onClick={addOption}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {type === QuestionType.TRUE_FALSE ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="true"
                        checked={options[0]?.isCorrect || false}
                        onCheckedChange={(checked) => {
                          setOptions([
                            { id: "1", text: "True", isCorrect: !!checked },
                            { id: "2", text: "False", isCorrect: !checked },
                          ])
                        }}
                      />
                      <Label htmlFor="true">True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="false"
                        checked={options[1]?.isCorrect || false}
                        onCheckedChange={(checked) => {
                          setOptions([
                            { id: "1", text: "True", isCorrect: !checked },
                            { id: "2", text: "False", isCorrect: !!checked },
                          ])
                        }}
                      />
                      <Label htmlFor="false">False</Label>
                    </div>
                  </div>
                ) : type === QuestionType.NUMERICAL ? (
                  <div>
                    <Label htmlFor="numerical">Correct Answer</Label>
                    <Input
                      id="numerical"
                      type="number"
                      placeholder="Enter the correct numerical answer"
                      value={options[0]?.text || ""}
                      onChange={(e) => setOptions([{ id: "1", text: e.target.value, isCorrect: true }])}
                    />
                  </div>
                ) : (
                  options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={(checked) => {
                          if (type === QuestionType.SINGLE_CORRECT) {
                            // For single correct, uncheck all others
                            setOptions(
                              options.map((opt) => ({
                                ...opt,
                                isCorrect: opt.id === option.id ? !!checked : false,
                              })),
                            )
                          } else {
                            updateOption(option.id, "isCorrect", checked)
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option.text}
                          onChange={(e) => updateOption(option.id, "text", e.target.value)}
                        />
                      </div>
                      {options.length > 2 && (
                        <Button variant="ghost" size="sm" onClick={() => removeOption(option.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata & Classification</CardTitle>
                <CardDescription>Organize your question with topics, tags, and additional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topic">Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., Mathematics, Physics, History"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtopic">Subtopic</Label>
                    <Input
                      id="subtopic"
                      placeholder="e.g., Algebra, Mechanics, World War II"
                      value={subtopic}
                      onChange={(e) => setSubtopic(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag and press Enter"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Textbook Chapter 5, Past Exam 2023"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    placeholder="Provide an explanation for the correct answer..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Publish Question
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Question Preview</CardTitle>
                <CardDescription>See how your question will appear to students</CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionPreview question={previewQuestion} showAnswer={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
