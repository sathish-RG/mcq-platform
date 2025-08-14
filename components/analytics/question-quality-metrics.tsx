"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, TrendingUp, BarChart3 } from "lucide-react"

interface QuestionQualityMetricsProps {
  data: {
    totalQuestions: number
    averageDifficulty: number
    discriminationIndex: number
    facilityValue: number
    flaggedQuestions: number
    recentlyAdded: number
    qualityDistribution: Array<{
      quality: string
      count: number
      percentage: number
    }>
    difficultyDistribution: Array<{
      difficulty: number
      count: number
    }>
  }
}

export function QuestionQualityMetrics({ data }: QuestionQualityMetricsProps) {
  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["", "Very Easy", "Easy", "Medium", "Hard", "Very Hard"]
    return labels[difficulty] || "Unknown"
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">+{data.recentlyAdded} added recently</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Difficulty</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageDifficulty}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0 scale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discrimination</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.discriminationIndex}</div>
            <Badge variant={data.discriminationIndex >= 0.6 ? "default" : "secondary"}>
              {data.discriminationIndex >= 0.6 ? "Good" : "Fair"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Questions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.flaggedQuestions}</div>
            <p className="text-xs text-muted-foreground">Need review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Question Quality Distribution</CardTitle>
          <CardDescription>Breakdown of questions by quality assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.qualityDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.quality}</span>
                  <span className="text-sm text-gray-600">
                    {item.count} questions ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Distribution</CardTitle>
          <CardDescription>Questions distributed across difficulty levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {data.difficultyDistribution.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{item.count}</div>
                <div className="text-sm text-gray-600">{getDifficultyLabel(item.difficulty)}</div>
                <div className="text-xs text-gray-500">Level {item.difficulty}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Discrimination Index</h4>
              <p className="text-gray-600 mb-2">
                Measures how well a question differentiates between high and low performers.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 0.6+ : Excellent discrimination</li>
                <li>• 0.4-0.6 : Good discrimination</li>
                <li>• 0.2-0.4 : Fair discrimination</li>
                <li>• Below 0.2 : Poor discrimination</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Facility Value</h4>
              <p className="text-gray-600 mb-2">Indicates the percentage of students who answered correctly.</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 0.8+ : Very easy question</li>
                <li>• 0.6-0.8 : Easy question</li>
                <li>• 0.4-0.6 : Medium difficulty</li>
                <li>• Below 0.4 : Difficult question</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
