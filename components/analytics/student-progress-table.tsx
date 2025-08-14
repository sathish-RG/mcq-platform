"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface StudentProgress {
  id: string
  name: string
  email: string
  overallScore: number
  completedExams: number
  totalExams: number
  lastActivity: Date
  status: "active" | "inactive" | "at-risk"
}

interface StudentProgressTableProps {
  students: StudentProgress[]
}

export function StudentProgressTable({ students }: StudentProgressTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "at-risk":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Overall Score</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => {
          const completionRate = (student.completedExams / student.totalExams) * 100
          return (
            <TableRow key={student.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">{student.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-lg font-semibold">{student.overallScore}%</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Progress value={completionRate} className="w-[100px]" />
                  <div className="text-xs text-muted-foreground">
                    {student.completedExams}/{student.totalExams} exams
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{student.lastActivity.toLocaleDateString()}</div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(student.status)}>{student.status}</Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
