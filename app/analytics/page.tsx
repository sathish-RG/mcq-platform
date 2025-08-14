"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, FileText, Download, Calendar, Target, Award } from "lucide-react"
import Link from "next/link"
import { AnalyticsService } from "@/lib/analytics-service"
import { PerformanceChart } from "@/components/analytics/performance-chart"
import { TopicMasteryHeatmap } from "@/components/analytics/topic-mastery-heatmap"
import { QuestionQualityMetrics } from "@/components/analytics/question-quality-metrics"
import { StudentProgressTable } from "@/components/analytics/student-progress-table"
import type { AnalyticsData } from "@/lib/types"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedExam, setSelectedExam] = useState<string>("all")

  useEffect(() => {
    loadAnalytics()
  }, [timeRange, selectedExam])

  const loadAnalytics = async () => {
    if (!user) return

    setLoading(true)
    try {
      const data = await AnalyticsService.getAnalytics(user.role, user.id, {
        timeRange,
        examId: selectedExam !== "all" ? selectedExam : undefined,
      })
      setAnalyticsData(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    if (!user || !analyticsData) return

    try {
      await AnalyticsService.exportAnalytics(user.role, user.id, {
        timeRange,
        examId: selectedExam !== "all" ? selectedExam : undefined,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  if (!user) {
    return <div>Please log in to view analytics.</div>
  }

  const isStudent = user.role === UserRole.STUDENT
  const isInstructor = user.role === UserRole.INSTRUCTOR
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
              <p className="text-sm text-gray-600">
                {isStudent
                  ? "Track your learning progress and performance"
                  : isInstructor
                    ? "Monitor student performance and question quality"
                    : "Platform-wide analytics and reporting"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Button onClick={handleExportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Customize your analytics view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isStudent && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exams</SelectItem>
                      <SelectItem value="1">Mathematics Final 2024</SelectItem>
                      <SelectItem value="2">Physics Quiz - Chapter 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading analytics...</p>
          </div>
        ) : !analyticsData ? (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">No analytics data found for the selected criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isStudent ? "Exams Taken" : isInstructor ? "Active Students" : "Total Users"}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.totalCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData.overview.changePercent > 0 ? "+" : ""}
                    {analyticsData.overview.changePercent}% from last period
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isStudent ? "Average Score" : "Average Performance"}
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.averageScore}%</div>
                  <Badge variant={analyticsData.overview.averageScore >= 80 ? "default" : "secondary"}>
                    {analyticsData.overview.averageScore >= 80 ? "Excellent" : "Good"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData.overview.completionRate >= 90 ? "Excellent" : "Good"} completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{isStudent ? "Study Streak" : "Active Exams"}</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData.overview.streakCount}</div>
                  <p className="text-xs text-muted-foreground">{isStudent ? "days in a row" : "currently active"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics Tabs */}
            <Tabs defaultValue={isStudent ? "performance" : "overview"} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="topics">Topics</TabsTrigger>
                {!isStudent && <TabsTrigger value="questions">Questions</TabsTrigger>}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                      <CardDescription>Score trends over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PerformanceChart data={analyticsData.performanceTrends} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Summary</CardTitle>
                      <CardDescription>Recent activity breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.activitySummary.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                            </div>
                            <Badge variant="outline">{activity.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {isStudent ? (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                        <CardDescription>Individual performance metrics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Overall Average</span>
                            <span className="font-bold">{analyticsData.studentMetrics.overallAverage}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Best Subject</span>
                            <Badge variant="default">{analyticsData.studentMetrics.bestSubject}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Improvement Area</span>
                            <Badge variant="secondary">{analyticsData.studentMetrics.improvementArea}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Time per Question</span>
                            <span className="font-medium">{analyticsData.studentMetrics.avgTimePerQuestion}s</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Exams</CardTitle>
                        <CardDescription>Your latest exam performances</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analyticsData.recentExams.map((exam, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{exam.title}</p>
                                <p className="text-sm text-gray-600">{exam.date}</p>
                              </div>
                              <Badge
                                variant={exam.score >= 80 ? "default" : exam.score >= 60 ? "secondary" : "destructive"}
                              >
                                {exam.score}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <StudentProgressTable data={analyticsData.studentProgress} />
                )}
              </TabsContent>

              <TabsContent value="topics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Mastery</CardTitle>
                    <CardDescription>
                      {isStudent ? "Your performance across different topics" : "Class performance by topic"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopicMasteryHeatmap data={analyticsData.topicMastery} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Topic Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topicBreakdown.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{topic.name}</span>
                            <span className="text-sm text-gray-600">
                              {topic.correct}/{topic.total} ({Math.round((topic.correct / topic.total) * 100)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(topic.correct / topic.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {!isStudent && (
                <TabsContent value="questions" className="space-y-6">
                  <QuestionQualityMetrics data={analyticsData.questionMetrics} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}
