"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import AutoRefreshTimer from "@/components/monitoring/AutoRefreshTimer"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  FileDown,
  Network,
  Wifi,
  Router,
  Globe,
  Eye,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface InterfaceStats {
  id: string
  name: string
  type: "ethernet" | "wireless" | "ppp"
  status: "up" | "down"
  utilization: number
  bandwidth: {
    current: { download: number; upload: number }
    peak: { download: number; upload: number }
    average: { download: number; upload: number }
  }
  traffic: {
    inBytes: number
    outBytes: number
    inPackets: number
    outPackets: number
    inErrors: number
    outErrors: number
    inDrops: number
    outDrops: number
  }
  history: Array<{
    timestamp: number
    download: number
    upload: number
    utilization: number
  }>
}

export default function InterfaceStatsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInterface, setSelectedInterface] = useState("all")
  const [timeRange, setTimeRange] = useState("1h")
  const [chartType, setChartType] = useState("bandwidth")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [interfaceStats, setInterfaceStats] = useState<InterfaceStats[]>([
    {
      id: "eth0",
      name: "GigabitEthernet0/0/1",
      type: "ethernet",
      status: "up",
      utilization: 45.2,
      bandwidth: {
        current: { download: 45.2, upload: 23.8 },
        peak: { download: 89.5, upload: 67.3 },
        average: { download: 32.1, upload: 18.9 },
      },
      traffic: {
        inBytes: 1024000000,
        outBytes: 512000000,
        inPackets: 1500000,
        outPackets: 1200000,
        inErrors: 15,
        outErrors: 8,
        inDrops: 5,
        outDrops: 3,
      },
      history: [],
    },
    {
      id: "eth1",
      name: "GigabitEthernet0/0/2",
      type: "ethernet",
      status: "up",
      utilization: 78.9,
      bandwidth: {
        current: { download: 78.9, upload: 34.5 },
        peak: { download: 156.7, upload: 89.2 },
        average: { download: 65.4, upload: 28.7 },
      },
      traffic: {
        inBytes: 2048000000,
        outBytes: 1024000000,
        inPackets: 2500000,
        outPackets: 1800000,
        inErrors: 5,
        outErrors: 3,
        inDrops: 2,
        outDrops: 1,
      },
      history: [],
    },
    {
      id: "wlan0",
      name: "WLAN 2.4GHz",
      type: "wireless",
      status: "up",
      utilization: 23.4,
      bandwidth: {
        current: { download: 23.4, upload: 12.1 },
        peak: { download: 45.8, upload: 28.9 },
        average: { download: 18.7, upload: 9.8 },
      },
      traffic: {
        inBytes: 512000000,
        outBytes: 256000000,
        inPackets: 800000,
        outPackets: 600000,
        inErrors: 25,
        outErrors: 18,
        inDrops: 12,
        outDrops: 8,
      },
      history: [],
    },
    {
      id: "wlan1",
      name: "WLAN 5GHz",
      type: "wireless",
      status: "up",
      utilization: 67.3,
      bandwidth: {
        current: { download: 67.3, upload: 29.7 },
        peak: { download: 134.6, upload: 78.4 },
        average: { download: 52.1, upload: 24.3 },
      },
      traffic: {
        inBytes: 1536000000,
        outBytes: 768000000,
        inPackets: 1800000,
        outPackets: 1400000,
        inErrors: 12,
        outErrors: 7,
        inDrops: 6,
        outDrops: 4,
      },
      history: [],
    },
  ])

  // Generate historical data
  useEffect(() => {
    const generateHistory = () => {
      const now = Date.now()
      const points = 60 // 60 data points
      const interval = 60000 // 1 minute intervals

      setInterfaceStats((prev) =>
        prev.map((iface) => ({
          ...iface,
          history: Array.from({ length: points }, (_, i) => {
            const timestamp = now - (points - i - 1) * interval
            const baseDownload = iface.bandwidth.average.download
            const baseUpload = iface.bandwidth.average.upload
            const variation = 0.3

            return {
              timestamp,
              download: Math.max(0, baseDownload * (1 + (Math.random() - 0.5) * variation)),
              upload: Math.max(0, baseUpload * (1 + (Math.random() - 0.5) * variation)),
              utilization: Math.max(0, Math.min(100, iface.utilization * (1 + (Math.random() - 0.5) * 0.2))),
            }
          }),
        })),
      )
    }

    generateHistory()
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate data updates
      setInterfaceStats((prev) =>
        prev.map((iface) => ({
          ...iface,
          utilization: Math.max(5, Math.min(95, iface.utilization + (Math.random() - 0.5) * 10)),
          bandwidth: {
            ...iface.bandwidth,
            current: {
              download: Math.max(5, Math.min(200, iface.bandwidth.current.download + (Math.random() - 0.5) * 20)),
              upload: Math.max(2, Math.min(100, iface.bandwidth.current.upload + (Math.random() - 0.5) * 10)),
            },
          },
          traffic: {
            ...iface.traffic,
            inPackets: iface.traffic.inPackets + Math.floor(Math.random() * 10000),
            outPackets: iface.traffic.outPackets + Math.floor(Math.random() * 8000),
          },
        })),
      )
    } catch (error) {
      console.error("Failed to refresh interface stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getInterfaceIcon = (type: string) => {
    switch (type) {
      case "wireless":
        return <Wifi className="w-4 h-4" />
      case "ethernet":
        return <Router className="w-4 h-4" />
      case "ppp":
        return <Globe className="w-4 h-4" />
      default:
        return <Network className="w-4 h-4" />
    }
  }

  const getFilteredStats = () => {
    return selectedInterface === "all"
      ? interfaceStats
      : interfaceStats.filter((iface) => iface.id === selectedInterface)
  }

  const getTotalStats = () => {
    const filtered = getFilteredStats()
    return filtered.reduce(
      (acc, iface) => ({
        totalDownload: acc.totalDownload + iface.bandwidth.current.download,
        totalUpload: acc.totalUpload + iface.bandwidth.current.upload,
        totalInBytes: acc.totalInBytes + iface.traffic.inBytes,
        totalOutBytes: acc.totalOutBytes + iface.traffic.outBytes,
        totalErrors: acc.totalErrors + iface.traffic.inErrors + iface.traffic.outErrors,
        totalDrops: acc.totalDrops + iface.traffic.inDrops + iface.traffic.outDrops,
      }),
      {
        totalDownload: 0,
        totalUpload: 0,
        totalInBytes: 0,
        totalOutBytes: 0,
        totalErrors: 0,
        totalDrops: 0,
      },
    )
  }

  const totalStats = getTotalStats()

  // Chart rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      const chartWidth = canvas.offsetWidth - 80
      const chartHeight = canvas.offsetHeight - 60
      const chartX = 60
      const chartY = 20

      // Draw grid
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1

      for (let i = 0; i <= 10; i++) {
        const y = chartY + (chartHeight / 10) * i
        ctx.beginPath()
        ctx.moveTo(chartX, y)
        ctx.lineTo(chartX + chartWidth, y)
        ctx.stroke()
      }

      for (let i = 0; i <= 12; i++) {
        const x = chartX + (chartWidth / 12) * i
        ctx.beginPath()
        ctx.moveTo(x, chartY)
        ctx.lineTo(x, chartY + chartHeight)
        ctx.stroke()
      }

      // Draw data for selected interfaces
      const filteredStats = getFilteredStats()
      const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"]

      filteredStats.forEach((iface, index) => {
        if (iface.history.length === 0) return

        const color = colors[index % colors.length]
        const data =
          chartType === "bandwidth" ? iface.history.map((h) => h.download) : iface.history.map((h) => h.utilization)

        const maxValue = Math.max(...data, 100)

        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.beginPath()

        data.forEach((value, i) => {
          const x = chartX + (chartWidth / (data.length - 1)) * i
          const y = chartY + chartHeight - (value / maxValue) * chartHeight

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        })

        ctx.stroke()

        // Fill area
        ctx.fillStyle = color
        ctx.globalAlpha = 0.1
        ctx.beginPath()
        ctx.moveTo(chartX, chartY + chartHeight)

        data.forEach((value, i) => {
          const x = chartX + (chartWidth / (data.length - 1)) * i
          const y = chartY + chartHeight - (value / maxValue) * chartHeight
          ctx.lineTo(x, y)
        })

        ctx.lineTo(chartX + chartWidth, chartY + chartHeight)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw Y-axis labels
      ctx.fillStyle = "#9CA3AF"
      ctx.font = "12px monospace"
      ctx.textAlign = "right"

      const maxValue = chartType === "bandwidth" ? 200 : 100
      for (let i = 0; i <= 10; i++) {
        const value = (maxValue / 10) * (10 - i)
        const y = chartY + (chartHeight / 10) * i
        ctx.fillText(`${value.toFixed(0)}${chartType === "bandwidth" ? " Mbps" : "%"}`, chartX - 10, y + 4)
      }
    }

    draw()
  }, [interfaceStats, selectedInterface, chartType])

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Interface Statistics</h1>
            <p className="text-sm text-neutral-400">Detailed network interface performance and traffic analysis</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Auto Refresh Timer */}
        <AutoRefreshTimer onRefresh={refreshData} isLoading={isLoading} />

        {/* Control Panel */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-500" />
              Statistics Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-400 mb-2 block">Interface</label>
                <Select value={selectedInterface} onValueChange={setSelectedInterface}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Interfaces</SelectItem>
                    {interfaceStats.map((iface) => (
                      <SelectItem key={iface.id} value={iface.id}>
                        <div className="flex items-center gap-2">
                          {getInterfaceIcon(iface.type)}
                          <span>{iface.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 mb-2 block">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">Last 15 minutes</SelectItem>
                    <SelectItem value="1h">Last 1 hour</SelectItem>
                    <SelectItem value="6h">Last 6 hours</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-400 mb-2 block">Chart Type</label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bandwidth">Bandwidth Usage</SelectItem>
                    <SelectItem value="utilization">Interface Utilization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 tracking-wider font-medium">TOTAL DOWNLOAD</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{totalStats.totalDownload.toFixed(1)}</p>
                  <p className="text-xs text-neutral-400">Mbps</p>
                </div>
                <div className="flex flex-col items-end">
                  <Download className="w-8 h-8 text-blue-500" />
                  <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-400 tracking-wider font-medium">TOTAL UPLOAD</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{totalStats.totalUpload.toFixed(1)}</p>
                  <p className="text-xs text-neutral-400">Mbps</p>
                </div>
                <div className="flex flex-col items-end">
                  <Upload className="w-8 h-8 text-red-500" />
                  <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 tracking-wider font-medium">DATA TRANSFERRED</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">
                    {formatBytes(totalStats.totalInBytes + totalStats.totalOutBytes)}
                  </p>
                  <p className="text-xs text-neutral-400">Total</p>
                </div>
                <div className="flex flex-col items-end">
                  <BarChart3 className="w-8 h-8 text-green-500" />
                  <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-400 tracking-wider font-medium">ERRORS & DROPS</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">
                    {totalStats.totalErrors + totalStats.totalDrops}
                  </p>
                  <p className="text-xs text-neutral-400">Total</p>
                </div>
                <div className="flex flex-col items-end">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  {totalStats.totalErrors + totalStats.totalDrops > 50 ? (
                    <TrendingUp className="w-4 h-4 text-red-500 mt-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500 mt-1" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-neutral-800 border-neutral-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="data-[state=active]:bg-orange-500">
              Detailed Stats
            </TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-orange-500">
              Historical Charts
            </TabsTrigger>
            <TabsTrigger value="errors" className="data-[state=active]:bg-orange-500">
              Error Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getFilteredStats().map((iface) => (
                <Card key={iface.id} className="bg-neutral-900 border-neutral-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                        {getInterfaceIcon(iface.type)}
                        {iface.name}
                      </CardTitle>
                      <Badge
                        className={
                          iface.status === "up" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }
                      >
                        {iface.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">Utilization</span>
                        <span className="text-white font-mono">{iface.utilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={iface.utilization} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Download className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-neutral-400">Download</span>
                        </div>
                        <div className="text-lg font-bold text-white font-mono">
                          {iface.bandwidth.current.download.toFixed(1)} Mbps
                        </div>
                        <div className="text-xs text-neutral-500">
                          Peak: {iface.bandwidth.peak.download.toFixed(1)} Mbps
                        </div>
                        <div className="text-xs text-neutral-500">
                          Avg: {iface.bandwidth.average.download.toFixed(1)} Mbps
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Upload className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-neutral-400">Upload</span>
                        </div>
                        <div className="text-lg font-bold text-white font-mono">
                          {iface.bandwidth.current.upload.toFixed(1)} Mbps
                        </div>
                        <div className="text-xs text-neutral-500">
                          Peak: {iface.bandwidth.peak.upload.toFixed(1)} Mbps
                        </div>
                        <div className="text-xs text-neutral-500">
                          Avg: {iface.bandwidth.average.upload.toFixed(1)} Mbps
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-700">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">In Bytes:</span>
                            <span className="text-white font-mono">{formatBytes(iface.traffic.inBytes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">In Packets:</span>
                            <span className="text-white font-mono">{iface.traffic.inPackets.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Out Bytes:</span>
                            <span className="text-white font-mono">{formatBytes(iface.traffic.outBytes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Out Packets:</span>
                            <span className="text-white font-mono">{iface.traffic.outPackets.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Detailed Stats Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-500" />
                  Detailed Interface Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        <th className="text-left py-3 px-2 text-neutral-400 font-medium">Interface</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Status</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Utilization</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Download</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Upload</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">In Packets</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Out Packets</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Errors</th>
                        <th className="text-right py-3 px-2 text-neutral-400 font-medium">Drops</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredStats().map((iface) => (
                        <tr key={iface.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              {getInterfaceIcon(iface.type)}
                              <span className="text-white font-medium">{iface.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <Badge
                              className={
                                iface.status === "up" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                              }
                            >
                              {iface.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-white font-mono">{iface.utilization.toFixed(1)}%</span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-blue-400 font-mono">
                              {iface.bandwidth.current.download.toFixed(1)} Mbps
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-red-400 font-mono">
                              {iface.bandwidth.current.upload.toFixed(1)} Mbps
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-white font-mono">{iface.traffic.inPackets.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-white font-mono">{iface.traffic.outPackets.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`font-mono ${iface.traffic.inErrors + iface.traffic.outErrors > 10 ? "text-red-400" : "text-green-400"}`}
                            >
                              {iface.traffic.inErrors + iface.traffic.outErrors}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`font-mono ${iface.traffic.inDrops + iface.traffic.outDrops > 5 ? "text-yellow-400" : "text-green-400"}`}
                            >
                              {iface.traffic.inDrops + iface.traffic.outDrops}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historical Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Historical {chartType === "bandwidth" ? "Bandwidth" : "Utilization"} Chart
                  </CardTitle>
                  <div className="flex items-center gap-4 text-xs">
                    {getFilteredStats().map((iface, index) => {
                      const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"]
                      return (
                        <div key={iface.id} className="flex items-center gap-2">
                          <div className="w-3 h-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
                          <span className="text-neutral-400">{iface.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-80 border rounded"
                    style={{
                      borderColor: "#374151",
                      backgroundColor: "#1F2937",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Analysis Tab */}
          <TabsContent value="errors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Error Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getFilteredStats().map((iface) => (
                      <div key={iface.id} className="p-3 bg-neutral-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getInterfaceIcon(iface.type)}
                            <span className="text-white font-medium">{iface.name}</span>
                          </div>
                          <Badge
                            className={
                              iface.status === "up" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                            }
                          >
                            {iface.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">In Errors:</span>
                              <span
                                className={`font-mono ${iface.traffic.inErrors > 10 ? "text-red-400" : "text-green-400"}`}
                              >
                                {iface.traffic.inErrors}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Out Errors:</span>
                              <span
                                className={`font-mono ${iface.traffic.outErrors > 10 ? "text-red-400" : "text-green-400"}`}
                              >
                                {iface.traffic.outErrors}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">In Drops:</span>
                              <span
                                className={`font-mono ${iface.traffic.inDrops > 5 ? "text-yellow-400" : "text-green-400"}`}
                              >
                                {iface.traffic.inDrops}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Out Drops:</span>
                              <span
                                className={`font-mono ${iface.traffic.outDrops > 5 ? "text-yellow-400" : "text-green-400"}`}
                              >
                                {iface.traffic.outDrops}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getFilteredStats().map((iface) => {
                      const totalErrors = iface.traffic.inErrors + iface.traffic.outErrors
                      const totalDrops = iface.traffic.inDrops + iface.traffic.outDrops
                      const healthScore = Math.max(0, 100 - totalErrors * 2 - totalDrops * 3)

                      return (
                        <div key={iface.id} className="p-3 bg-neutral-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getInterfaceIcon(iface.type)}
                              <span className="text-white font-medium">{iface.name}</span>
                            </div>
                            <Badge
                              className={
                                healthScore >= 90
                                  ? "bg-green-500/20 text-green-500"
                                  : healthScore >= 70
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : "bg-red-500/20 text-red-500"
                              }
                            >
                              {healthScore >= 90 ? "Excellent" : healthScore >= 70 ? "Good" : "Poor"}
                            </Badge>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-neutral-400">Health Score</span>
                              <span className="text-white font-mono">{healthScore.toFixed(0)}%</span>
                            </div>
                            <Progress value={healthScore} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
