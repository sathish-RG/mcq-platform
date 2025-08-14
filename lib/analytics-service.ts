import type { UserRole, AnalyticsData } from "./types"

interface AnalyticsFilters {
  timeRange?: string
  examId?: string
  userId?: string
}

export class AnalyticsService {
  static async getAnalytics(
    userRole: UserRole,
    userId: string,
    filters: AnalyticsFilters = {},
  ): Promise<AnalyticsData> {
    // Mock API call - simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate mock analytics data based on user role
    const mockData: AnalyticsData = {
      overview: {
        totalCount: userRole === UserRole.STUDENT ? 12 : userRole === UserRole.INSTRUCTOR ? 45 : 1250,
        averageScore: Math.floor(Math.random() * 20) + 75, // 75-95%
        completionRate: Math.floor(Math.random() * 15) + 85, // 85-100%
        changePercent: Math.floor(Math.random() * 20) - 10, // -10 to +10%
        streakCount:
          userRole === UserRole.STUDENT ? Math.floor(Math.random() * 15) + 1 : Math.floor(Math.random() * 10) + 5,
      },
      performanceTrends: this.generatePerformanceTrends(),
      activitySummary: this.generateActivitySummary(userRole),
      studentMetrics: userRole === UserRole.STUDENT ? this.generateStudentMetrics() : undefined,
      recentExams: userRole === UserRole.STUDENT ? this.generateRecentExams() : [],
      studentProgress: userRole !== UserRole.STUDENT ? this.generateStudentProgress() : [],
      topicMastery: this.generateTopicMastery(),
      topicBreakdown: this.generateTopicBreakdown(),
      questionMetrics: userRole !== UserRole.STUDENT ? this.generateQuestionMetrics() : undefined,
    }

    return mockData
  }

  private static generatePerformanceTrends() {
    const trends = []
    const baseScore = 75

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      trends.push({
        date: date.toISOString().split("T")[0],
        score: Math.max(0, Math.min(100, baseScore + Math.random() * 20 - 10)),
        attempts: Math.floor(Math.random() * 5) + 1,
      })
    }

    return trends
  }

  private static generateActivitySummary(userRole: UserRole) {
    if (userRole === UserRole.STUDENT) {
      return [
        { title: "Exams Completed", description: "This month", count: "8" },
        { title: "Questions Answered", description: "Total", count: "245" },
        { title: "Study Hours", description: "This week", count: "12.5" },
        { title: "Achievements", description: "Unlocked", count: "3" },
      ]
    } else if (userRole === UserRole.INSTRUCTOR) {
      return [
        { title: "Students Active", description: "This week", count: "42" },
        { title: "Exams Created", description: "This month", count: "6" },
        { title: "Questions Added", description: "This month", count: "89" },
        { title: "Avg Class Score", description: "Latest exam", count: "82%" },
      ]
    } else {
      return [
        { title: "Total Users", description: "Platform wide", count: "1,250" },
        { title: "Active Exams", description: "Currently running", count: "23" },
        { title: "Questions Created", description: "This month", count: "456" },
        { title: "System Uptime", description: "Last 30 days", count: "99.9%" },
      ]
    }
  }

  private static generateStudentMetrics() {
    return {
      overallAverage: Math.floor(Math.random() * 20) + 75,
      bestSubject: ["Mathematics", "Physics", "Chemistry", "Biology"][Math.floor(Math.random() * 4)],
      improvementArea: ["Algebra", "Geometry", "Statistics", "Calculus"][Math.floor(Math.random() * 4)],
      avgTimePerQuestion: Math.floor(Math.random() * 60) + 30, // 30-90 seconds
    }
  }

  private static generateRecentExams() {
    const exams = [
      "Mathematics Final 2024",
      "Physics Quiz - Chapter 5",
      "Chemistry Midterm",
      "Biology Lab Test",
      "Statistics Assignment",
    ]

    return exams.slice(0, 3).map((title, index) => ({
      title,
      date: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      score: Math.floor(Math.random() * 30) + 65, // 65-95%
    }))
  }

  private static generateStudentProgress() {
    const students = [
      "Alice Johnson",
      "Bob Smith",
      "Carol Davis",
      "David Wilson",
      "Eva Brown",
      "Frank Miller",
      "Grace Lee",
      "Henry Taylor",
      "Ivy Chen",
      "Jack Anderson",
    ]

    return students.map((name, index) => ({
      id: (index + 1).toString(),
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@student.edu`,
      averageScore: Math.floor(Math.random() * 30) + 65,
      examsCompleted: Math.floor(Math.random() * 10) + 5,
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      trend: Math.random() > 0.5 ? "up" : "down",
    }))
  }

  private static generateTopicMastery() {
    const topics = ["Algebra", "Geometry", "Statistics", "Calculus", "Trigonometry"]
    const difficulties = ["Easy", "Medium", "Hard"]

    const data = []
    for (const topic of topics) {
      for (const difficulty of difficulties) {
        data.push({
          topic,
          difficulty,
          mastery: Math.random() * 100,
        })
      }
    }

    return data
  }

  private static generateTopicBreakdown() {
    const topics = [
      "Algebra",
      "Geometry",
      "Statistics",
      "Calculus",
      "Trigonometry",
      "Linear Equations",
      "Quadratic Functions",
      "Probability",
    ]

    return topics.map((name) => ({
      name,
      correct: Math.floor(Math.random() * 20) + 10,
      total: Math.floor(Math.random() * 10) + 25,
    }))
  }

  private static generateQuestionMetrics() {
    return {
      totalQuestions: 1250,
      averageDifficulty: 3.2,
      discriminationIndex: 0.65,
      facilityValue: 0.72,
      flaggedQuestions: 23,
      recentlyAdded: 89,
      qualityDistribution: [
        { quality: "Excellent", count: 450, percentage: 36 },
        { quality: "Good", count: 600, percentage: 48 },
        { quality: "Fair", count: 150, percentage: 12 },
        { quality: "Poor", count: 50, percentage: 4 },
      ],
      difficultyDistribution: [
        { difficulty: 1, count: 125 },
        { difficulty: 2, count: 300 },
        { difficulty: 3, count: 500 },
        { difficulty: 4, count: 250 },
        { difficulty: 5, count: 75 },
      ],
    }
  }

  static async exportAnalytics(userRole: UserRole, userId: string, filters: AnalyticsFilters = {}): Promise<void> {
    // Mock export functionality
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, this would generate and download a CSV/Excel file
    const data = await this.getAnalytics(userRole, userId, filters)

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "Metric,Value\n"
    csvContent += `Total Count,${data.overview.totalCount}\n`
    csvContent += `Average Score,${data.overview.averageScore}%\n`
    csvContent += `Completion Rate,${data.overview.completionRate}%\n`

    // Create and trigger download
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `analytics-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
