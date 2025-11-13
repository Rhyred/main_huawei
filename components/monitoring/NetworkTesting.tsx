"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/common/ComponentLoader"
import { Activity, Globe, Route, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface PingResult {
  host: string
  packets_sent: number
  packets_received: number
  packet_loss: number
  min_time: number
  max_time: number
  avg_time: number
  results: Array<{ seq: number; time: number; ttl: number }>
}

interface TracerouteResult {
  host: string
  hops: Array<{
    hop: number
    ip: string
    hostname?: string
    times: number[]
    avg_time: number
  }>
}

export default function NetworkTesting({ theme = "dark" }: { theme?: string }) {
  const [pingTarget, setPingTarget] = useState("8.8.8.8")
  const [tracerouteTarget, setTracerouteTarget] = useState("google.com")
  const [pingResult, setPingResult] = useState<PingResult | null>(null)
  const [tracerouteResult, setTracerouteResult] = useState<TracerouteResult | null>(null)
  const [pingLoading, setPingLoading] = useState(false)
  const [tracerouteLoading, setTracerouteLoading] = useState(false)

  const runPing = async () => {
    setPingLoading(true)
    try {
      const response = await fetch("/api/network/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: pingTarget, count: 4 }),
      })
      const result = await response.json()
      setPingResult(result.data)
    } catch (error) {
      console.error("Ping failed:", error)
    } finally {
      setPingLoading(false)
    }
  }

  const runTraceroute = async () => {
    setTracerouteLoading(true)
    try {
      const response = await fetch("/api/network/traceroute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: tracerouteTarget }),
      })
      const result = await response.json()
      setTracerouteResult(result.data)
    } catch (error) {
      console.error("Traceroute failed:", error)
    } finally {
      setTracerouteLoading(false)
    }
  }

  const getPingStatus = (avgTime: number, packetLoss: number) => {
    if (packetLoss > 10) return { color: "bg-red-500", text: "Poor", icon: AlertTriangle }
    if (avgTime > 100) return { color: "bg-yellow-500", text: "Fair", icon: Activity }
    return { color: "bg-green-500", text: "Good", icon: CheckCircle }
  }

  return (
    <Card className={`${theme === "dark" ? "bg-neutral-900 border-neutral-700" : "bg-white border-gray-300"}`}>
      <CardHeader className="pb-3">
        <CardTitle
          className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"} tracking-wider flex items-center gap-2`}
        >
          <Globe className="w-4 h-4 text-orange-500" />
          Network Testing Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ping" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ping" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Ping Test
            </TabsTrigger>
            <TabsTrigger value="traceroute" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Traceroute
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ping" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter IP or hostname (e.g., 8.8.8.8)"
                value={pingTarget}
                onChange={(e) => setPingTarget(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runPing} disabled={pingLoading || !pingTarget}>
                {pingLoading ? <LoadingSpinner size="sm" theme={theme} /> : "Ping"}
              </Button>
            </div>

            {pingResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"}`}>
                    <div className="text-xs text-neutral-400 mb-1">Packets Sent</div>
                    <div className={`text-lg font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {pingResult.packets_sent}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"}`}>
                    <div className="text-xs text-neutral-400 mb-1">Packets Received</div>
                    <div className={`text-lg font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {pingResult.packets_received}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"}`}>
                    <div className="text-xs text-neutral-400 mb-1">Packet Loss</div>
                    <div
                      className={`text-lg font-mono ${pingResult.packet_loss > 0 ? "text-red-500" : "text-green-500"}`}
                    >
                      {pingResult.packet_loss}%
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"}`}>
                    <div className="text-xs text-neutral-400 mb-1">Avg Time</div>
                    <div className={`text-lg font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {pingResult.avg_time.toFixed(1)}ms
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Connection Quality:</span>
                  {(() => {
                    const status = getPingStatus(pingResult.avg_time, pingResult.packet_loss)
                    const Icon = status.icon
                    return (
                      <Badge className={`${status.color}/20 text-white flex items-center gap-1`}>
                        <Icon className="w-3 h-3" />
                        {status.text}
                      </Badge>
                    )
                  })()}
                </div>

                <div className="space-y-2">
                  <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"}`}>
                    Ping Results:
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {pingResult.results.map((result, index) => (
                      <div
                        key={index}
                        className={`text-xs font-mono p-2 rounded ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"}`}
                      >
                        seq={result.seq} time={result.time.toFixed(1)}ms TTL={result.ttl}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="traceroute" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter hostname (e.g., google.com)"
                value={tracerouteTarget}
                onChange={(e) => setTracerouteTarget(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runTraceroute} disabled={tracerouteLoading || !tracerouteTarget}>
                {tracerouteLoading ? <LoadingSpinner size="sm" theme={theme} /> : "Trace"}
              </Button>
            </div>

            {tracerouteResult && (
              <div className="space-y-4">
                <h4 className={`text-sm font-medium ${theme === "dark" ? "text-neutral-300" : "text-gray-700"}`}>
                  Route to {tracerouteResult.host}:
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tracerouteResult.hops.map((hop, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-gray-100"} flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-6 flex items-center justify-center text-xs">
                          {hop.hop}
                        </Badge>
                        <div>
                          <div className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {hop.ip}
                          </div>
                          {hop.hostname && (
                            <div className={`text-xs ${theme === "dark" ? "text-neutral-400" : "text-gray-600"}`}>
                              {hop.hostname}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-mono ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                          {hop.avg_time.toFixed(1)}ms
                        </div>
                        <div className="flex gap-1 text-xs text-neutral-400">
                          {hop.times.map((time, i) => (
                            <span key={i}>{time.toFixed(1)}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
