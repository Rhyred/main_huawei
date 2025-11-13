"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle, Brain, TrendingUp, Wifi, Activity } from "lucide-react"

interface Anomaly {
  id: string
  type: "bandwidth" | "latency" | "packet_loss" | "cpu" | "memory" | "temperature"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  value: number
  threshold: number
  timestamp: Date
  resolved: boolean
}

interface AnomalyDetectionProps {
  theme?: string
  systemData?: {
    cpu: number
    memory: number
    temperature: number
    bandwidth: { download: number; upload: number }
    latency: number
    packetLoss: number
  }
}

export default function AnomalyDetection({ theme = "dark", systemData }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [isEnabled, setIsEnabled] = useState(true)

  // Thresholds for anomaly detection
  const thresholds = {
    cpu: { medium: 70, high: 85, critical: 95 },
    memory: { medium: 75, high: 90, critical: 98 },
    temperature: { medium: 60, high: 75, critical: 85 },
    latency: { medium: 100, high: 200, critical: 500 },
    packetLoss: { medium: 1, high: 5, critical: 10 },
    bandwidth: { medium: 80, high: 90, critical: 95 }, // Percentage of interface capacity
  }

  const getSeverity = (value: number, type: keyof typeof thresholds): "low" | "medium" | "high" | "critical" => {
    const threshold = thresholds[type]
    if (value >= threshold.critical) return "critical"
    if (value >= threshold.high) return "high"
    if (value >= threshold.medium) return "medium"
    return "low"
  }

  const checkForAnomalies = () => {
    if (!isEnabled || !systemData) return

    const newAnomalies: Anomaly[] = []

    // CPU Check
    if (systemData.cpu > thresholds.cpu.medium) {
      const severity = getSeverity(systemData.cpu, "cpu")
      newAnomalies.push({
        id: `cpu-${Date.now()}`,
        type: "cpu",
        severity,
        message: `High CPU usage detected: ${systemData.cpu}%`,
        value: systemData.cpu,
        threshold: thresholds.cpu.medium,
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Memory Check
    if (systemData.memory > thresholds.memory.medium) {
      const severity = getSeverity(systemData.memory, "memory")
      newAnomalies.push({
        id: `memory-${Date.now()}`,
        type: "memory",
        severity,
        message: `High memory usage detected: ${systemData.memory}%`,
        value: systemData.memory,
        threshold: thresholds.memory.medium,
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Temperature Check
    if (systemData.temperature > thresholds.temperature.medium) {
      const severity = getSeverity(systemData.temperature, "temperature")
      newAnomalies.push({
        id: `temp-${Date.now()}`,
        type: "temperature",
        severity,
        message: `High temperature detected: ${systemData.temperature}°C`,
        value: systemData.temperature,
        threshold: thresholds.temperature.medium,
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Latency Check
    if (systemData.latency > thresholds.latency.medium) {
      const severity = getSeverity(systemData.latency, "latency")
      newAnomalies.push({
        id: `latency-${Date.now()}`,
        type: "latency",
        severity,
        message: `High latency detected: ${systemData.latency}ms`,
        value: systemData.latency,
        threshold: thresholds.latency.medium,
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Packet Loss Check
    if (systemData.packetLoss > thresholds.packetLoss.medium) {
      const severity = getSeverity(systemData.packetLoss, "packetLoss")
      newAnomalies.push({
        id: `packet-${Date.now()}`,
        type: "packet_loss",
        severity,
        message: `Packet loss detected: ${systemData.packetLoss}%`,
        value: systemData.packetLoss,
        threshold: thresholds.packetLoss.medium,
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Add new anomalies
    if (newAnomalies.length > 0) {
      setAnomalies((prev) => [...newAnomalies, ...prev.slice(0, 9)]) // Keep only 10 most recent
    }
  }

  useEffect(() => {
    checkForAnomalies()
  }, [systemData, isEnabled])

  const resolveAnomaly = (id: string) => {
    setAnomalies((prev) => prev.map((anomaly) => (anomaly.id === id ? { ...anomaly, resolved: true } : anomaly)))
  }

  const clearAllAnomalies = () => {
    setAnomalies([])
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      default:
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bandwidth":
        return <Wifi className="w-4 h-4" />
      case "cpu":
      case "memory":
        return <Activity className="w-4 h-4" />
      case "latency":
      case "packet_loss":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const activeAnomalies = anomalies.filter((a) => !a.resolved)
  const resolvedAnomalies = anomalies.filter((a) => a.resolved)

  return (
    <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} tracking-wider flex items-center gap-2`}
          >
            <Brain className="w-4 h-4 text-orange-500" />
            AI Anomaly Detection
            {activeAnomalies.length > 0 && (
              <Badge className="bg-red-500/20 text-red-500 ml-2">{activeAnomalies.length}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEnabled(!isEnabled)}
              className={isEnabled ? "text-green-500" : "text-neutral-500"}
            >
              {isEnabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isEnabled ? "Enabled" : "Disabled"}
            </Button>
            {anomalies.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllAnomalies}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isEnabled ? (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-neutral-500 mx-auto mb-2" />
            <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
              Anomaly detection is disabled
            </p>
          </div>
        ) : activeAnomalies.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
              All systems operating normally
            </p>
            <p className="text-xs text-neutral-500 mt-1">AI monitoring active</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active Anomalies */}
            <div>
              <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} mb-3`}>
                Active Alerts ({activeAnomalies.length})
              </h4>
              <div className="space-y-2">
                {activeAnomalies.map((anomaly) => (
                  <div
                    key={anomaly.id}
                    className={`p-3 rounded-lg border ${getSeverityColor(anomaly.severity)} ${
                      theme === "dark" ? "bg-neutral-800/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(anomaly.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(anomaly.severity)} variant="outline">
                              {anomaly.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-neutral-500">{anomaly.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {anomaly.message}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                            <span>Current: {anomaly.value}</span>
                            <span>Threshold: {anomaly.threshold}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resolveAnomaly(anomaly.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolved Anomalies */}
            {resolvedAnomalies.length > 0 && (
              <div>
                <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} mb-3`}>
                  Recently Resolved ({resolvedAnomalies.length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {resolvedAnomalies.slice(0, 3).map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className={`p-2 rounded border ${theme === "dark" ? "bg-neutral-800/30 border-neutral-700" : "bg-gray-50 border-gray-200"} opacity-60`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                          {anomaly.message}
                        </span>
                        <span className="text-xs text-neutral-500 ml-auto">
                          {anomaly.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Status Summary */}
        <div className="mt-6 pt-4 border-t border-neutral-700">
          <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} mb-3`}>
            Current System Status
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">CPU:</span>
              <span className={systemData?.cpu && systemData.cpu > 70 ? "text-yellow-500" : "text-green-500"}>
                {systemData?.cpu || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Memory:</span>
              <span className={systemData?.memory && systemData.memory > 75 ? "text-yellow-500" : "text-green-500"}>
                {systemData?.memory || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Temp:</span>
              <span
                className={
                  systemData?.temperature && systemData.temperature > 60 ? "text-yellow-500" : "text-green-500"
                }
              >
                {systemData?.temperature || 0}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Latency:</span>
              <span className={systemData?.latency && systemData.latency > 100 ? "text-yellow-500" : "text-green-500"}>
                {systemData?.latency || 0}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Loss:</span>
              <span
                className={systemData?.packetLoss && systemData.packetLoss > 1 ? "text-yellow-500" : "text-green-500"}
              >
                {systemData?.packetLoss || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status:</span>
              <span className={activeAnomalies.length > 0 ? "text-yellow-500" : "text-green-500"}>
                {activeAnomalies.length > 0 ? "Warning" : "Normal"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
