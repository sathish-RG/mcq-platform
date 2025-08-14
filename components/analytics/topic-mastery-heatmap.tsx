"use client"

interface TopicMasteryHeatmapProps {
  data: Array<{
    topic: string
    difficulty: string
    mastery: number
  }>
}

export function TopicMasteryHeatmap({ data }: TopicMasteryHeatmapProps) {
  const topics = [...new Set(data.map((d) => d.topic))]
  const difficulties = [...new Set(data.map((d) => d.difficulty))]

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500"
    if (mastery >= 60) return "bg-yellow-500"
    if (mastery >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getMasteryData = (topic: string, difficulty: string) => {
    return data.find((d) => d.topic === topic && d.difficulty === difficulty)?.mastery || 0
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-2 min-w-max">
          {/* Header */}
          <div></div>
          {difficulties.map((difficulty) => (
            <div key={difficulty} className="text-center text-sm font-medium p-2">
              {difficulty}
            </div>
          ))}

          {/* Rows */}
          {topics.map((topic) => (
            <div key={topic} className="contents">
              <div className="text-sm font-medium p-2 text-right">{topic}</div>
              {difficulties.map((difficulty) => {
                const mastery = getMasteryData(topic, difficulty)
                return (
                  <div
                    key={`${topic}-${difficulty}`}
                    className={`h-12 w-full rounded ${getMasteryColor(mastery)} flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:opacity-80`}
                    title={`${topic} - ${difficulty}: ${Math.round(mastery)}% mastery`}
                  >
                    {Math.round(mastery)}%
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>0-40%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span>40-60%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span>60-80%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>80-100%</span>
        </div>
      </div>
    </div>
  )
}
