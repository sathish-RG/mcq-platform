"use client"
import { Badge } from "@/components/ui/badge"

interface PerformanceChartProps {
  data: Array<{
    date: string
    score: number
    attempts: number
  }>
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const maxScore = Math.max(...data.map((d) => d.score))
  const minScore = Math.min(...data.map((d) => d.score))
  const avgScore = data.reduce((sum, d) => sum + d.score, 0) / data.length

  // Simple line chart using CSS
  const chartHeight = 200
  const chartWidth = 400

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * chartWidth
      const y = chartHeight - ((item.score - minScore) / (maxScore - minScore)) * chartHeight
      return `${x},${y}`
    })
    .join(" ")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline">Avg: {Math.round(avgScore)}%</Badge>
          <Badge variant="outline">High: {Math.round(maxScore)}%</Badge>
          <Badge variant="outline">Low: {Math.round(minScore)}%</Badge>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="border rounded">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((score) => {
            const y = chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight
            return (
              <g key={score}>
                <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x="-5" y={y + 4} fontSize="10" fill="#6b7280" textAnchor="end">
                  {score}%
                </text>
              </g>
            )
          })}

          {/* Performance line */}
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * chartWidth
            const y = chartHeight - ((item.score - minScore) / (maxScore - minScore)) * chartHeight
            return (
              <circle key={index} cx={x} cy={y} r="3" fill="#3b82f6" className="hover:r-4 cursor-pointer">
                <title>{`${item.date}: ${Math.round(item.score)}%`}</title>
              </circle>
            )
          })}
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  )
}
