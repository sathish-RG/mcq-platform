"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ExamTimerProps {
  timeRemaining: number
  onTimeUp: () => void
}

export function ExamTimer({ timeRemaining, onTimeUp }: ExamTimerProps) {
  const [time, setTime] = useState(timeRemaining)

  useEffect(() => {
    setTime(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (time <= 0) {
      onTimeUp()
      return
    }

    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev - 1000
        if (newTime <= 0) {
          onTimeUp()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [time, onTimeUp])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getTimerColor = () => {
    const totalMinutes = Math.floor(time / 60000)
    if (totalMinutes <= 5) return "destructive"
    if (totalMinutes <= 15) return "secondary"
    return "default"
  }

  const isLowTime = Math.floor(time / 60000) <= 15

  return (
    <div className="flex items-center gap-2">
      {isLowTime && <AlertTriangle className="h-4 w-4 text-orange-500" />}
      <Clock className="h-4 w-4" />
      <Badge variant={getTimerColor()} className="font-mono text-sm">
        {formatTime(time)}
      </Badge>
    </div>
  )
}
