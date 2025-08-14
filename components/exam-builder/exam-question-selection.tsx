"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Shuffle } from "lucide-react"
import { QuestionService } from "@/lib/question-service"
import type { Question, QuestionType, RandomizationRule } from "@/lib/types"

interface ExamQuestionSelectionProps {
  selectedQuestions: string[]
  randomizationRule: RandomizationRule | null
  onQuestionsChange: (questions: string[]) => void
  onRandomizationChange: (rule: RandomizationRule | null) => void
}

export function ExamQuestionSelection({
  selectedQuestions,
  randomizationRule,
  onQuestionsChange,
  onRandomizationChange,
}: ExamQuestionSelectionProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")

  // Randomization state
  const [totalQuestions, setTotalQuestions] = useState(20)
  const [easyPercent, setEasyPercent] = useState(40)
  const [mediumPercent, setMediumPercent] = useState(40)
  const [hardPercent, setHardPercent] = useState(20)
  const [includeTags, setIncludeTags] = useState<string[]>([])
  const [excludeTags, setExcludeTags] = useState<string[]>([])

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
      isPublished: true,
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

  const handleQuestionToggle = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      onQuestionsChange(selectedQuestions.filter((id) => id !== questionId))
    } else {
      onQuestionsChange([...selectedQuestions, questionId])
    }
  }

  const handleRandomizationUpdate = () => {
    const rule: RandomizationRule = {
      totalQuestions,
      difficultyDistribution: {
        easy: easyPercent,
        medium: mediumPercent,
        hard: hardPercent,
      },
      includeTags,
      excludeTags,
    }
    onRandomizationChange(rule)
  }

  const clearRandomization = () => {
    onRandomizationChange(null)
  }

  const topics = [...new Set(questions.map((q) => q.topic).filter(Boolean))]
  const allTags = [...new Set(questions.flatMap((q) => q.tags))]

  const filteredQuestions = questions.filter(
    (q) =>
      q.stem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Selection</TabsTrigger>
          <TabsTrigger value="random">Smart Randomization</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Questions Manually</CardTitle>
              <CardDescription>Browse and select specific questions for your exam</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="SINGLE_CORRECT">Single Correct</SelectItem>
                      <SelectItem value="MULTI_SELECT">Multi Select</SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="NUMERICAL">Numerical</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
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

                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Topic" />
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

              {/* Selected Questions Summary */}
              {selectedQuestions.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{selectedQuestions.length} questions selected</strong>
                  </p>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-4">Loading questions...</div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No questions found matching your criteria</div>
                ) : (
                  filteredQuestions.map((question) => (
                    <div key={question.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedQuestions.includes(question.id)}
                        onCheckedChange={() => handleQuestionToggle(question.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {question.type.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Difficulty: {question.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.topic}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {question.stem.substring(0, 100)}
                          {question.stem.length > 100 && "..."}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {question.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {question.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{question.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="random" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Randomization</CardTitle>
              <CardDescription>Generate questions automatically based on your criteria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="totalQuestions">Total Questions</Label>
                  <Input
                    id="totalQuestions"
                    type="number"
                    min="1"
                    max="100"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Number.parseInt(e.target.value) || 20)}
                  />
                </div>
              </div>

              <div>
                <Label>Difficulty Distribution</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <Label htmlFor="easy" className="text-sm">
                      Easy (%)
                    </Label>
                    <Input
                      id="easy"
                      type="number"
                      min="0"
                      max="100"
                      value={easyPercent}
                      onChange={(e) => setEasyPercent(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medium" className="text-sm">
                      Medium (%)
                    </Label>
                    <Input
                      id="medium"
                      type="number"
                      min="0"
                      max="100"
                      value={mediumPercent}
                      onChange={(e) => setMediumPercent(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hard" className="text-sm">
                      Hard (%)
                    </Label>
                    <Input
                      id="hard"
                      type="number"
                      min="0"
                      max="100"
                      value={hardPercent}
                      onChange={(e) => setHardPercent(Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {easyPercent + mediumPercent + hardPercent}% (should equal 100%)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={handleRandomizationUpdate}>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Apply Randomization
                </Button>
                {randomizationRule && (
                  <Button variant="outline" onClick={clearRandomization}>
                    Clear Randomization
                  </Button>
                )}
              </div>

              {randomizationRule && (
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900 mb-2">Randomization Active</h4>
                  <p className="text-sm text-green-800">
                    Will generate {randomizationRule.totalQuestions} questions with{" "}
                    {randomizationRule.difficultyDistribution.easy}% easy,{" "}
                    {randomizationRule.difficultyDistribution.medium}% medium,{" "}
                    {randomizationRule.difficultyDistribution.hard}% hard
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
