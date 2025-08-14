"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import type { ProctoringSettings } from "@/lib/types"

interface ProctoringMonitorProps {
  settings: ProctoringSettings
  onViolation: (violation: any) => void
}

export function ProctoringMonitor({ settings, onViolation }: ProctoringMonitorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false)

  useEffect(() => {
    // Fullscreen monitoring
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)

      if (settings.fullscreenRequired && !isCurrentlyFullscreen) {
        setShowFullscreenWarning(true)
        onViolation({
          type: "fullscreen_exit",
          timestamp: new Date(),
          details: "User exited fullscreen mode",
        })
      }
    }

    // Tab switch/visibility monitoring
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = tabSwitchCount + 1
        setTabSwitchCount(newCount)

        onViolation({
          type: "tab_switch",
          timestamp: new Date(),
          details: `Tab switch #${newCount}`,
        })

        if (newCount > settings.maxTabSwitches) {
          onViolation({
            type: "suspicious_activity",
            timestamp: new Date(),
            details: `Exceeded maximum tab switches (${settings.maxTabSwitches})`,
          })
        }
      }
    }

    // Copy/paste blocking
    const handleCopyPaste = (e: ClipboardEvent) => {
      if (settings.blockCopyPaste) {
        e.preventDefault()
        onViolation({
          type: "copy_paste",
          timestamp: new Date(),
          details: `Attempted ${e.type} operation`,
        })
      }
    }

    // Context menu blocking
    const handleContextMenu = (e: MouseEvent) => {
      if (settings.blockCopyPaste) {
        e.preventDefault()
      }
    }

    // Add event listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("copy", handleCopyPaste)
    document.addEventListener("paste", handleCopyPaste)
    document.addEventListener("contextmenu", handleContextMenu)

    // Request fullscreen if required
    if (settings.fullscreenRequired && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        setShowFullscreenWarning(true)
      })
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("copy", handleCopyPaste)
      document.removeEventListener("paste", handleCopyPaste)
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [settings, tabSwitchCount, onViolation])

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen().then(() => {
      setShowFullscreenWarning(false)
    })
  }

  return (
    <>
      {/* Fullscreen Warning */}
      {showFullscreenWarning && settings.fullscreenRequired && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Fullscreen Required</h3>
            </div>
            <p className="text-gray-600 mb-4">
              This exam requires fullscreen mode for security purposes. Please click the button below to continue.
            </p>
            <button
              onClick={requestFullscreen}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Enter Fullscreen Mode
            </button>
          </div>
        </div>
      )}

      {/* Proctoring Status */}
      {(settings.fullscreenRequired || settings.maxTabSwitches < 999) && (
        <div className="fixed top-4 right-4 z-40">
          <Alert className="w-64">
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <div className="space-y-1">
                {settings.fullscreenRequired && (
                  <div className="flex justify-between">
                    <span>Fullscreen:</span>
                    <span className={isFullscreen ? "text-green-600" : "text-red-600"}>
                      {isFullscreen ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}
                {settings.maxTabSwitches < 999 && (
                  <div className="flex justify-between">
                    <span>Tab switches:</span>
                    <span className={tabSwitchCount > settings.maxTabSwitches ? "text-red-600" : "text-gray-600"}>
                      {tabSwitchCount}/{settings.maxTabSwitches}
                    </span>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
