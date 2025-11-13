"use client"

import { useState, useEffect, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Shield, Zap, BrainCircuit, Activity, Eye, AlertTriangle } from "lucide-react"
import { dummyDdosThreats } from "@/lib/dummy-data"
import { format } from "date-fns"

type Threat = typeof dummyDdosThreats[0]

// Helper to generate dynamic data
const generateTrafficData = (lastValue: number) => {
  const newValue = lastValue + (Math.random() - 0.5) * 200
  return Math.max(100, Math.min(5000, newValue))
}

export default function DdosProtectionPage() {
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(true)
  const [sensitivity, setSensitivity] = useState([50])
  const [threats, setThreats] = useState<Threat[]>([])
  const [trafficData, setTrafficData] = useState(() => {
    const initialData = []
    let lastTraffic = 1000
    for (let i = 0; i < 30; i++) {
      lastTraffic = generateTrafficData(lastTraffic)
      initialData.push({
        time: new Date(Date.now() - (30 - i) * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        pps: lastTraffic,
      })
    }
    return initialData
  })

  useEffect(() => {
    // Simulate initial data fetch
    setThreats(dummyDdosThreats)

    // Simulate real-time traffic
    const interval = setInterval(() => {
      setTrafficData((currentData) => {
        const lastDataPoint = currentData[currentData.length - 1]
        const newTraffic = generateTrafficData(lastDataPoint.pps)
        const newDataPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          pps: newTraffic,
        }
        return [...currentData.slice(1), newDataPoint]
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <Badge variant="destructive">{severity}</Badge>
      case "High":
        return <Badge className="bg-orange-500 hover:bg-orange-600">{severity}</Badge>
      case "Medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{severity}</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">DDoS Protection</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">Configure and monitor AI-powered DDoS mitigation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Status & Config */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Protection Status
                </CardTitle>
                <Switch
                  checked={isProtectionEnabled}
                  onCheckedChange={setIsProtectionEnabled}
                  aria-label="Toggle DDoS Protection"
                />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isProtectionEnabled ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <p className="text-lg font-semibold">
                    {isProtectionEnabled ? "Active" : "Disabled"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  The system is {isProtectionEnabled ? "actively monitoring and mitigating threats." : "not currently monitoring traffic."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  AI Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Sensitivity Level</label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Higher sensitivity detects smaller anomalies but may cause false positives.
                  </p>
                  <Slider
                    defaultValue={sensitivity}
                    onValueChange={setSensitivity}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Apply Changes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Live Traffic Analysis (Packets/sec)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer>
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs" />
                      <YAxis unit=" pps" className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="pps"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorTraffic)"
                        name="Packets/sec"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detected Threats Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Detected Threats Log
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              A log of recent threats detected and mitigated by the AI engine.
            </p>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Timestamp</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Attack Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threats.map((threat) => (
                    <TableRow key={threat.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(threat.timestamp), "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell className="font-mono">{threat.source}</TableCell>
                      <TableCell>{threat.type}</TableCell>
                      <TableCell>{getSeverityBadge(threat.severity)}</TableCell>
                      <TableCell className="font-mono">{threat.aiScore}</TableCell>
                      <TableCell>
                        <Badge variant={threat.status === "Blocked" ? "destructive" : "secondary"}>
                          {threat.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
