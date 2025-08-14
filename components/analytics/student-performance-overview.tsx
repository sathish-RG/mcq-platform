"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Clock } from "lucide-react"

interface StudentPerformanceProps {
  data: {
    overallScore: number
    totalExams: number
    completedExams: number
    averageTime: number
    strongTopics: string[]
    weakTopics: string[]
    recentTrend: "up" | "down" | "stable"
    trendPercentage: number
  }
}

export function StudentPerformanceOverview({ data }: StudentPerformanceProps) {
  const completionRate = (data.completedExams / data.totalExams) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.overallScore}%</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {data.recentTrend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            {data.recentTrend === "up" ? "+" : "-"}
            {data.trendPercentage}% from last month
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {data.completedExams} of {data.totalExams} exams completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.averageTime}min</div>
          <p className="text-xs text-muted-foreground">Per exam attempt</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Topic Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-green-600 mb-1">Strong Areas</p>
              <div className="flex flex-wrap gap-1">
                {data.strongTopics.slice(0, 2).map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs bg-green-100 text-green-700">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-orange-600 mb-1">Needs Work</p>
              <div className="flex flex-wrap gap-1">
                {data.weakTopics.slice(0, 2).map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
