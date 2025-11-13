"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"

interface AutoRefreshTimerProps {
  onRefresh: () => Promise<void>
  theme?: string
  defaultInterval?: number
  isLoading?: boolean
}

export default function AutoRefreshTimer({
  onRefresh,
  theme = "dark",
  defaultInterval = 15,
  isLoading = false,
}: AutoRefreshTimerProps) {
  const [isActive, setIsActive] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(defaultInterval)
  const [timeLeft, setTimeLeft] = useState(defaultInterval)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const handleRefresh = useCallback(async () => {
    try {
      await onRefresh()
      setLastUpdate(new Date())
      setTimeLeft(refreshInterval)
    } catch (error) {
      console.error("Refresh failed:", error)
    }
  }, [onRefresh, refreshInterval])

  useEffect(() => {
    if (!isActive) return

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleRefresh()
          return refreshInterval
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, refreshInterval, handleRefresh])

  const toggleTimer = () => {
    setIsActive(!isActive)
    if (!isActive) {
      setTimeLeft(refreshInterval)
    }
  }

  const resetTimer = () => {
    setTimeLeft(refreshInterval)
    handleRefresh()
  }

  const changeInterval = (newInterval: string) => {
    const intervalValue = Number.parseInt(newInterval)
    setRefreshInterval(intervalValue)
    setTimeLeft(intervalValue)
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-orange-500" />
        <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Auto Refresh</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTimer} disabled={isLoading}>
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={resetTimer} disabled={isLoading}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <Select value={refreshInterval.toString()} onValueChange={changeInterval}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5s</SelectItem>
          <SelectItem value="10">10s</SelectItem>
          <SelectItem value="15">15s</SelectItem>
          <SelectItem value="30">30s</SelectItem>
          <SelectItem value="60">1m</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Badge variant={isActive ? "default" : "secondary"} className="bg-orange-500/20 text-orange-500">
          {isActive ? `${timeLeft}s` : "Paused"}
        </Badge>
        {lastUpdate && (
          <span className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
            Last: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
          <span className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>Updating...</span>
        </div>
      )}
    </div>
  )
}
