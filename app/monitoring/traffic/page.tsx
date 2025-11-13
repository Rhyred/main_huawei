"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import {
  Activity,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  BarChart3,
  PieChart,
  Users,
  Wifi,
  Router,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface TrafficData {
  timestamp: number
  interface: string
  download: number
  upload: number
  total: number
  packets: {
    inbound: number
    outbound: number
  }
}

interface TopTalker {
  id: number
  ipAddress: string
  hostname: string
  download: number
  upload: number
  total: number
  percentage: number
  protocol: string
  port: number
  sessions: number
}

interface ProtocolStats {
  protocol: string
  bandwidth: number
  percentage: number
  packets: number
  sessions: number
  color: string
}

export default function TrafficMonitoringPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInterface, setSelectedInterface] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h")
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [topTalkers, setTopTalkers] = useState<TopTalker[]>([])
  const [protocolStats, setProtocolStats] = useState<ProtocolStats[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize data
  useEffect(() => {
    const generateTrafficData = () => {
      const data: TrafficData[] = []
      const now = Date.now()

      for (let i = 59; i >= 0; i--) {
        const timestamp = now - i * 60000 // 1 minute intervals
        const baseDownload = 45 + Math.sin(i * 0.1) * 20 + Math.random() * 10
        const baseUpload = 25 + Math.cos(i * 0.1) * 15 + Math.random() * 8

        data.push({
          timestamp,
          interface: "eth0",
          download: Math.max(0, baseDownload),
          upload: Math.max(0, baseUpload),
          total: baseDownload + baseUpload,
          packets: {
            inbound: Math.floor(Math.random() * 10000) + 5000,
            outbound: Math.floor(Math.random() * 8000) + 4000,
          },
        })
      }
      return data
    }

    const talkers: TopTalker[] = [
      {
        id: 1,
        ipAddress: "192.168.1.100",
        hostname: "Desktop-Office",
        download: 25.5,
        upload: 12.3,
        total: 37.8,
        percentage: 35.2,
        protocol: "HTTPS",
        port: 443,
        sessions: 15,
      },
      {
        id: 2,
        ipAddress: "192.168.1.101",
        hostname: "Laptop-Sarah",
        download: 18.2,
        upload: 8.7,
        total: 26.9,
        percentage: 25.1,
        protocol: "HTTP",
        port: 80,
        sessions: 8,
      },
      {
        id: 3,
        ipAddress: "192.168.1.102",
        hostname: "iPhone-John",
        download: 12.1,
        upload: 5.4,
        total: 17.5,
        percentage: 16.3,
        protocol: "HTTPS",
        port: 443,
        sessions: 12,
      },
      {
        id: 4,
        ipAddress: "192.168.1.103",
        hostname: "iPad-Guest",
        download: 8.3,
        upload: 3.2,
        total: 11.5,
        percentage: 10.7,
        protocol: "HTTP",
        port: 80,
        sessions: 6,
      },
      {
        id: 5,
        ipAddress: "192.168.1.104",
        hostname: "Smart-TV",
        download: 15.8,
        upload: 2.1,
        total: 17.9,
        percentage: 16.7,
        protocol: "RTMP",
        port: 1935,
        sessions: 3,
      },
    ]

    const protocols: ProtocolStats[] = [
      {
        protocol: "HTTPS",
        bandwidth: 45.2,
        percentage: 42.1,
        packets: 125000,
        sessions: 27,
        color: "#10b981",
      },
      {
        protocol: "HTTP",
        bandwidth: 28.7,
        percentage: 26.8,
        packets: 89000,
        sessions: 14,
        color: "#3b82f6",
      },
      {
        protocol: "RTMP",
        bandwidth: 18.9,
        percentage: 17.6,
        packets: 45000,
        sessions: 3,
        color: "#f59e0b",
      },
      {
        protocol: "SSH",
        bandwidth: 8.1,
        percentage: 7.5,
        packets: 12000,
        sessions: 5,
        color: "#ef4444",
      },
      {
        protocol: "DNS",
        bandwidth: 4.2,
        percentage: 3.9,
        packets: 8500,
        sessions: 45,
        color: "#8b5cf6",
      },
      {
        protocol: "Other",
        bandwidth: 2.1,
        percentage: 2.0,
        packets: 3200,
        sessions: 8,
        color: "#6b7280",
      },
    ]

    setTrafficData(generateTrafficData())
    setTopTalkers(talkers)
    setProtocolStats(protocols)
  }, [])

  // Draw traffic chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || trafficData.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Calculate max value for scaling
    const maxValue = Math.max(...trafficData.map((d) => Math.max(d.download, d.upload)))
    const scale = (canvas.height - 40) / maxValue

    // Draw download line
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.beginPath()
    trafficData.forEach((data, index) => {
      const x = (index / (trafficData.length - 1)) * (canvas.width - 40) + 20
      const y = canvas.height - 20 - data.download * scale
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Draw upload line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    trafficData.forEach((data, index) => {
      const x = (index / (trafficData.length - 1)) * (canvas.width - 40) + 20
      const y = canvas.height - 20 - data.upload * scale
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "#10b981"
    ctx.font = "12px monospace"
    ctx.fillText("Download", 10, 20)

    ctx.fillStyle = "#3b82f6"
    ctx.fillText("Upload", 10, 40)

    // Draw current values
    const latest = trafficData[trafficData.length - 1]
    if (latest) {
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px monospace"
      ctx.fillText(`${latest.download.toFixed(1)} Mbps`, canvas.width - 120, 20)
      ctx.fillText(`${latest.upload.toFixed(1)} Mbps`, canvas.width - 120, 40)
    }
  }, [trafficData])

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const currentTraffic = trafficData[trafficData.length - 1]
  const totalBandwidth = currentTraffic ? currentTraffic.download + currentTraffic.upload : 0

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Traffic Monitoring</h1>
            <p className="text-sm text-neutral-400">Real-time network traffic analysis and monitoring</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">5 Minutes</SelectItem>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshData} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Traffic Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 tracking-wider font-medium">DOWNLOAD</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {currentTraffic ? currentTraffic.download.toFixed(1) : "0.0"} Mbps
                  </p>
                </div>
                <Download className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 tracking-wider font-medium">UPLOAD</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {currentTraffic ? currentTraffic.upload.toFixed(1) : "0.0"} Mbps
                  </p>
                </div>
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-400 tracking-wider font-medium">TOTAL BANDWIDTH</p>
                  <p className="text-2xl font-bold text-white font-mono">{totalBandwidth.toFixed(1)} Mbps</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-400 tracking-wider font-medium">ACTIVE SESSIONS</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {topTalkers.reduce((acc, t) => acc + t.sessions, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="realtime">Real-time Traffic</TabsTrigger>
            <TabsTrigger value="talkers">Top Talkers</TabsTrigger>
            <TabsTrigger value="protocols">Protocol Analysis</TabsTrigger>
            <TabsTrigger value="interfaces">Interface Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            {/* Real-time Traffic Chart */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    Real-time Traffic Analysis
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedInterface} onValueChange={setSelectedInterface}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Interfaces</SelectItem>
                        <SelectItem value="eth0">GigabitEthernet0/0/1</SelectItem>
                        <SelectItem value="eth1">GigabitEthernet0/0/2</SelectItem>
                        <SelectItem value="wlan0">WLAN 2.4GHz</SelectItem>
                        <SelectItem value="wlan1">WLAN 5GHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <canvas ref={canvasRef} className="w-full h-64 bg-black rounded border border-neutral-700" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div className="text-center">
                    <p className="text-neutral-400">Peak Download</p>
                    <p className="text-green-400 font-mono text-lg">
                      {Math.max(...trafficData.map((d) => d.download)).toFixed(1)} Mbps
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-neutral-400">Peak Upload</p>
                    <p className="text-blue-400 font-mono text-lg">
                      {Math.max(...trafficData.map((d) => d.upload)).toFixed(1)} Mbps
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-neutral-400">Avg Download</p>
                    <p className="text-green-400 font-mono text-lg">
                      {(trafficData.reduce((acc, d) => acc + d.download, 0) / trafficData.length).toFixed(1)} Mbps
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-neutral-400">Avg Upload</p>
                    <p className="text-blue-400 font-mono text-lg">
                      {(trafficData.reduce((acc, d) => acc + d.upload, 0) / trafficData.length).toFixed(1)} Mbps
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="talkers" className="space-y-6">
            {/* Top Talkers */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Top Bandwidth Consumers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ComponentLoader type="table" />
                ) : (
                  <div className="space-y-4">
                    {topTalkers.map((talker, index) => (
                      <div
                        key={talker.id}
                        className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                            <span className="text-blue-400 font-mono text-sm">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{talker.hostname}</p>
                            <p className="text-neutral-400 text-sm font-mono">{talker.ipAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-green-400 font-mono">{talker.download.toFixed(1)} Mbps</p>
                            <p className="text-neutral-400 text-xs">Download</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-mono">{talker.upload.toFixed(1)} Mbps</p>
                            <p className="text-neutral-400 text-xs">Upload</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-mono">{talker.total.toFixed(1)} Mbps</p>
                            <p className="text-neutral-400 text-xs">Total</p>
                          </div>
                          <div className="text-right">
                            <p className="text-orange-400 font-mono">{talker.percentage.toFixed(1)}%</p>
                            <p className="text-neutral-400 text-xs">Usage</p>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-400">{talker.protocol}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            {/* Protocol Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-purple-500" />
                    Protocol Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {protocolStats.map((protocol) => (
                      <div key={protocol.protocol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: protocol.color }} />
                          <span className="text-neutral-300">{protocol.protocol}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-mono">{protocol.bandwidth.toFixed(1)} Mbps</span>
                          <span className="text-neutral-400 font-mono">{protocol.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Protocol Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-700">
                          <th className="text-left p-2 text-neutral-400">Protocol</th>
                          <th className="text-left p-2 text-neutral-400">Packets</th>
                          <th className="text-left p-2 text-neutral-400">Sessions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {protocolStats.map((protocol) => (
                          <tr key={protocol.protocol} className="border-b border-neutral-800">
                            <td className="p-2 text-white">{protocol.protocol}</td>
                            <td className="p-2 text-white font-mono">{protocol.packets.toLocaleString()}</td>
                            <td className="p-2 text-white font-mono">{protocol.sessions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interfaces" className="space-y-6">
            {/* Interface Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "GigabitEthernet0/0/1", type: "WAN", status: "up", utilization: 65.2, speed: "1000 Mbps" },
                { name: "GigabitEthernet0/0/2", type: "LAN", status: "up", utilization: 42.8, speed: "1000 Mbps" },
                { name: "WLAN 2.4GHz", type: "Wireless", status: "up", utilization: 28.5, speed: "300 Mbps" },
                { name: "WLAN 5GHz", type: "Wireless", status: "up", utilization: 51.3, speed: "867 Mbps" },
              ].map((iface, index) => (
                <Card key={index} className="bg-neutral-900 border-neutral-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        {iface.type === "Wireless" ? <Wifi className="w-5 h-5" /> : <Router className="w-5 h-5" />}
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
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Type:</span>
                        <span className="text-white">{iface.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Speed:</span>
                        <span className="text-white font-mono">{iface.speed}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Utilization:</span>
                          <span className="text-white font-mono">{iface.utilization}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              iface.utilization > 80
                                ? "bg-red-500"
                                : iface.utilization > 60
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${iface.utilization}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
