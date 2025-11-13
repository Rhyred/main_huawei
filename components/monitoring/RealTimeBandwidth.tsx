"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Download,
  Upload,
  Pause,
  Play,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Wifi,
  Router,
} from "lucide-react"

interface BandwidthData {
  timestamp: number
  download: number
  upload: number
  interface: string
}

interface InterfaceInfo {
  id: string
  name: string
  description: string
  type: "ethernet" | "wireless" | "ppp"
  status: "up" | "down"
  speed: number
  ip?: string
}

export default function RealTimeBandwidth({ theme = "dark" }: { theme?: string }) {
  const [selectedInterface, setSelectedInterface] = useState("eth0")
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [bandwidthData, setBandwidthData] = useState<BandwidthData[]>([])
  const [currentStats, setCurrentStats] = useState({
    download: 0,
    upload: 0,
    totalDownload: 0,
    totalUpload: 0,
    peakDownload: 0,
    peakUpload: 0,
  })
  const [timeRange, setTimeRange] = useState(60) // seconds
  const [updateInterval, setUpdateInterval] = useState(1000) // ms
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Mock interface data
  const interfaces: InterfaceInfo[] = [
    {
      id: "eth0",
      name: "Ethernet 0/0/1",
      description: "WAN Interface",
      type: "ethernet",
      status: "up",
      speed: 1000,
      ip: "192.168.1.1",
    },
    {
      id: "eth1",
      name: "Ethernet 0/0/2",
      description: "LAN Interface",
      type: "ethernet",
      status: "up",
      speed: 1000,
      ip: "10.0.0.1",
    },
    {
      id: "wlan0",
      name: "WLAN 2.4GHz",
      description: "Wireless 2.4GHz",
      type: "wireless",
      status: "up",
      speed: 300,
      ip: "192.168.2.1",
    },
    {
      id: "wlan1",
      name: "WLAN 5GHz",
      description: "Wireless 5GHz",
      type: "wireless",
      status: "up",
      speed: 867,
      ip: "192.168.5.1",
    },
  ]

  // Simulate real-time data fetching
  useEffect(() => {
    if (!isMonitoring) return

    const fetchBandwidthData = async () => {
      try {
        // In real implementation, this would be SNMP query
        const response = await fetch(`/api/bandwidth/${selectedInterface}`)
        const data = await response.json()

        const newDataPoint: BandwidthData = {
          timestamp: Date.now(),
          download: data.download || Math.random() * 100 + Math.sin(Date.now() / 10000) * 30,
          upload: data.upload || Math.random() * 50 + Math.cos(Date.now() / 8000) * 20,
          interface: selectedInterface,
        }

        setBandwidthData((prev) => {
          const updated = [...prev, newDataPoint]
          // Keep only data within time range
          const cutoff = Date.now() - timeRange * 1000
          return updated.filter((item) => item.timestamp > cutoff)
        })

        // Update current stats
        setCurrentStats((prev) => ({
          download: newDataPoint.download,
          upload: newDataPoint.upload,
          totalDownload: prev.totalDownload + (newDataPoint.download * updateInterval) / 1000 / 8, // Convert to bytes
          totalUpload: prev.totalUpload + (newDataPoint.upload * updateInterval) / 1000 / 8,
          peakDownload: Math.max(prev.peakDownload, newDataPoint.download),
          peakUpload: Math.max(prev.peakUpload, newDataPoint.upload),
        }))
      } catch (error) {
        console.error("Failed to fetch bandwidth data:", error)
      }
    }

    const interval = setInterval(fetchBandwidthData, updateInterval)
    return () => clearInterval(interval)
  }, [selectedInterface, isMonitoring, updateInterval, timeRange])

  // Canvas chart rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || bandwidthData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // Set canvas size
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      const chartWidth = canvas.offsetWidth - 80
      const chartHeight = canvas.offsetHeight - 60
      const chartX = 60
      const chartY = 20

      // Draw grid
      ctx.strokeStyle = theme === "dark" ? "#374151" : "#E5E7EB"
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let i = 0; i <= 10; i++) {
        const y = chartY + (chartHeight / 10) * i
        ctx.beginPath()
        ctx.moveTo(chartX, y)
        ctx.lineTo(chartX + chartWidth, y)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let i = 0; i <= 12; i++) {
        const x = chartX + (chartWidth / 12) * i
        ctx.beginPath()
        ctx.moveTo(x, chartY)
        ctx.lineTo(x, chartY + chartHeight)
        ctx.stroke()
      }

      // Draw Y-axis labels
      ctx.fillStyle = theme === "dark" ? "#9CA3AF" : "#6B7280"
      ctx.font = "12px monospace"
      ctx.textAlign = "right"

      const maxValue = Math.max(
        Math.max(...bandwidthData.map((d) => d.download)),
        Math.max(...bandwidthData.map((d) => d.upload)),
        100,
      )

      for (let i = 0; i <= 10; i++) {
        const value = (maxValue / 10) * (10 - i)
        const y = chartY + (chartHeight / 10) * i
        ctx.fillText(`${value.toFixed(1)}`, chartX - 10, y + 4)
      }

      // Draw bandwidth lines
      if (bandwidthData.length > 1) {
        const drawLine = (data: number[], color: string, lineWidth = 2) => {
          ctx.strokeStyle = color
          ctx.lineWidth = lineWidth
          ctx.beginPath()

          data.forEach((value, index) => {
            const x = chartX + (chartWidth / (data.length - 1)) * index
            const y = chartY + chartHeight - (value / maxValue) * chartHeight

            if (index === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          })

          ctx.stroke()
        }

        // Draw download line (blue)
        drawLine(
          bandwidthData.map((d) => d.download),
          "#3B82F6",
          3,
        )

        // Draw upload line (red)
        drawLine(
          bandwidthData.map((d) => d.upload),
          "#EF4444",
          3,
        )

        // Draw fill areas
        const drawFillArea = (data: number[], color: string, alpha = 0.1) => {
          ctx.fillStyle = color
          ctx.globalAlpha = alpha
          ctx.beginPath()

          // Start from bottom
          ctx.moveTo(chartX, chartY + chartHeight)

          data.forEach((value, index) => {
            const x = chartX + (chartWidth / (data.length - 1)) * index
            const y = chartY + chartHeight - (value / maxValue) * chartHeight
            ctx.lineTo(x, y)
          })

          // Close path to bottom
          ctx.lineTo(chartX + chartWidth, chartY + chartHeight)
          ctx.closePath()
          ctx.fill()
          ctx.globalAlpha = 1
        }

        drawFillArea(
          bandwidthData.map((d) => d.download),
          "#3B82F6",
        )
        drawFillArea(
          bandwidthData.map((d) => d.upload),
          "#EF4444",
        )
      }

      // Draw current values
      ctx.fillStyle = theme === "dark" ? "#FFFFFF" : "#000000"
      ctx.font = "bold 14px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`↓ ${currentStats.download.toFixed(1)} Mbps`, chartX + 10, chartY + 25)
      ctx.fillText(`↑ ${currentStats.upload.toFixed(1)} Mbps`, chartX + 10, chartY + 45)
    }

    draw()
    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [bandwidthData, theme, currentStats])

  const resetStats = () => {
    setBandwidthData([])
    setCurrentStats({
      download: 0,
      upload: 0,
      totalDownload: 0,
      totalUpload: 0,
      peakDownload: 0,
      peakUpload: 0,
    })
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const selectedInterfaceInfo = interfaces.find((iface) => iface.id === selectedInterface)
  const getInterfaceIcon = (type: string) => {
    switch (type) {
      case "wireless":
        return <Wifi className="w-4 h-4" />
      case "ethernet":
        return <Router className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle
              className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} tracking-wider flex items-center gap-2`}
            >
              <Activity className="w-4 h-4 text-orange-500" />
              Real-time Bandwidth Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`${theme === "dark" ? "text-neutral-400 hover:text-orange-500" : "text-gray-600 hover:text-orange-500"}`}
              >
                {isMonitoring ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetStats}
                className={`${theme === "dark" ? "text-neutral-400 hover:text-orange-500" : "text-gray-600 hover:text-orange-500"}`}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Interface Selection */}
            <div>
              <label
                className={`text-xs font-medium ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} mb-2 block`}
              >
                Interface
              </label>
              <Select value={selectedInterface} onValueChange={setSelectedInterface}>
                <SelectTrigger
                  className={`${theme === "dark" ? "bg-neutral-800 border-neutral-600" : "bg-gray-100 border-gray-300"}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {interfaces.map((iface) => (
                    <SelectItem key={iface.id} value={iface.id}>
                      <div className="flex items-center gap-2">
                        {getInterfaceIcon(iface.type)}
                        <span>{iface.name}</span>
                        <Badge
                          className={`ml-2 ${iface.status === "up" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                        >
                          {iface.status.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div>
              <label
                className={`text-xs font-medium ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} mb-2 block`}
              >
                Time Range
              </label>
              <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(Number(value))}>
                <SelectTrigger
                  className={`${theme === "dark" ? "bg-neutral-800 border-neutral-600" : "bg-gray-100 border-gray-300"}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                  <SelectItem value="600">10 minutes</SelectItem>
                  <SelectItem value="1800">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Update Interval */}
            <div>
              <label
                className={`text-xs font-medium ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} mb-2 block`}
              >
                Update Rate
              </label>
              <Select value={updateInterval.toString()} onValueChange={(value) => setUpdateInterval(Number(value))}>
                <SelectTrigger
                  className={`${theme === "dark" ? "bg-neutral-800 border-neutral-600" : "bg-gray-100 border-gray-300"}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">0.5 seconds</SelectItem>
                  <SelectItem value="1000">1 second</SelectItem>
                  <SelectItem value="2000">2 seconds</SelectItem>
                  <SelectItem value="5000">5 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label
                className={`text-xs font-medium ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} mb-2 block`}
              >
                Status
              </label>
              <div className="flex items-center gap-2 h-10">
                <div
                  className={`w-2 h-2 rounded-full ${isMonitoring ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                ></div>
                <span className={`text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {isMonitoring ? "Monitoring" : "Paused"}
                </span>
              </div>
            </div>
          </div>

          {/* Interface Info */}
          {selectedInterfaceInfo && (
            <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"} mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getInterfaceIcon(selectedInterfaceInfo.type)}
                  <div>
                    <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {selectedInterfaceInfo.name}
                    </h3>
                    <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                      {selectedInterfaceInfo.description} • {selectedInterfaceInfo.ip}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {selectedInterfaceInfo.speed} Mbps
                  </div>
                  <Badge
                    className={
                      selectedInterfaceInfo.status === "up"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }
                  >
                    {selectedInterfaceInfo.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} tracking-wider`}>
                  CURRENT DOWNLOAD
                </p>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} font-mono`}>
                  {currentStats.download.toFixed(1)}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-500" : "text-gray-500"}`}>Mbps</p>
              </div>
              <div className="flex flex-col items-end">
                <Download className="w-8 h-8 text-blue-500" />
                <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} tracking-wider`}>
                  CURRENT UPLOAD
                </p>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} font-mono`}>
                  {currentStats.upload.toFixed(1)}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-500" : "text-gray-500"}`}>Mbps</p>
              </div>
              <div className="flex flex-col items-end">
                <Upload className="w-8 h-8 text-red-500" />
                <TrendingDown className="w-4 h-4 text-red-500 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} tracking-wider`}>
                  PEAK DOWNLOAD
                </p>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} font-mono`}>
                  {currentStats.peakDownload.toFixed(1)}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-500" : "text-gray-500"}`}>Mbps</p>
              </div>
              <div className="flex flex-col items-end">
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"} tracking-wider`}>
                  PEAK UPLOAD
                </p>
                <p className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} font-mono`}>
                  {currentStats.peakUpload.toFixed(1)}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-neutral-500" : "text-gray-500"}`}>Mbps</p>
              </div>
              <div className="flex flex-col items-end">
                <TrendingUp className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle
              className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} tracking-wider`}
            >
              Bandwidth Chart - {selectedInterfaceInfo?.name}
            </CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-blue-500"></div>
                <span className={`${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>Download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-red-500"></div>
                <span className={`${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>Upload</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-80 border rounded"
              style={{
                borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
                backgroundColor: theme === "dark" ? "#1F2937" : "#F9FAFB",
              }}
            />
            {bandwidthData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className={`text-sm ${theme === "dark" ? "text-neutral-500" : "text-gray-500"}`}>
                  {isMonitoring ? "Collecting data..." : "Monitoring paused"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Transfer Summary */}
      <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
        <CardHeader className="pb-3">
          <CardTitle
            className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} tracking-wider`}
          >
            Session Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} mb-3`}>
                Total Data Transfer
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                    Downloaded:
                  </span>
                  <span className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {formatBytes(currentStats.totalDownload)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                    Uploaded:
                  </span>
                  <span className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {formatBytes(currentStats.totalUpload)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"}`}>
                    Total:
                  </span>
                  <span
                    className={`text-sm font-mono font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {formatBytes(currentStats.totalDownload + currentStats.totalUpload)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} mb-3`}>
                Peak Performance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                    Peak Download:
                  </span>
                  <span className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {currentStats.peakDownload.toFixed(2)} Mbps
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                    Peak Upload:
                  </span>
                  <span className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {currentStats.peakUpload.toFixed(2)} Mbps
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"}`}>
                    Utilization:
                  </span>
                  <span
                    className={`text-sm font-mono font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {selectedInterfaceInfo
                      ? (
                          (Math.max(currentStats.peakDownload, currentStats.peakUpload) / selectedInterfaceInfo.speed) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
