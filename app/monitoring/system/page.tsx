"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import AutoRefreshTimer from "@/components/monitoring/AutoRefreshTimer"
import { Server, Cpu, HardDrive, Thermometer, Zap, Fan, RefreshCw, CheckCircle, Activity } from "lucide-react"
import { useState } from "react"

export default function SystemMonitoringPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [systemData, setSystemData] = useState({
    cpu: {
      usage: 23.5,
      cores: 4,
      frequency: 1200,
      temperature: 45,
      processes: 127,
      loadAverage: [1.2, 1.5, 1.8],
    },
    memory: {
      total: 2048,
      used: 920,
      free: 1128,
      cached: 256,
      buffers: 128,
      usage: 45.0,
    },
    storage: {
      total: 8192,
      used: 3456,
      free: 4736,
      usage: 42.2,
    },
    temperature: {
      cpu: 45,
      system: 38,
      ambient: 25,
    },
    power: {
      input: 12.5,
      consumption: 8.2,
      efficiency: 85.6,
      status: "Normal",
    },
    fans: [
      { id: 1, name: "CPU Fan", rpm: 2450, status: "Normal" },
      { id: 2, name: "System Fan", rpm: 1850, status: "Normal" },
    ],
    uptime: {
      days: 15,
      hours: 7,
      minutes: 23,
      seconds: 45,
    },
    processes: {
      total: 127,
      running: 3,
      sleeping: 120,
      zombie: 0,
      stopped: 4,
    },
  })

  const refreshData = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate data updates
      setSystemData((prev) => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          usage: Math.max(5, Math.min(95, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          temperature: Math.max(30, Math.min(80, prev.cpu.temperature + (Math.random() - 0.5) * 5)),
          frequency: Math.max(800, Math.min(1600, prev.cpu.frequency + (Math.random() - 0.5) * 100)),
        },
        memory: {
          ...prev.memory,
          usage: Math.max(20, Math.min(90, prev.memory.usage + (Math.random() - 0.5) * 5)),
          used: Math.floor(prev.memory.total * (prev.memory.usage / 100)),
        },
        temperature: {
          ...prev.temperature,
          cpu: Math.max(30, Math.min(80, prev.temperature.cpu + (Math.random() - 0.5) * 3)),
          system: Math.max(25, Math.min(60, prev.temperature.system + (Math.random() - 0.5) * 2)),
        },
        power: {
          ...prev.power,
          consumption: Math.max(5, Math.min(15, prev.power.consumption + (Math.random() - 0.5) * 1)),
        },
      }))
    } catch (error) {
      console.error("Failed to refresh system data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-500"
    if (value >= thresholds.warning) return "text-yellow-500"
    return "text-green-500"
  }

  const formatUptime = (uptime: typeof systemData.uptime) => {
    return `${uptime.days}d ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">System Monitoring</h1>
            <p className="text-sm text-neutral-400">Real-time system resource monitoring and health status</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Auto Refresh Timer */}
        <AutoRefreshTimer onRefresh={refreshData} isLoading={isLoading} />

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Status */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 tracking-wider font-medium">CPU USAGE</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{systemData.cpu.usage.toFixed(1)}%</p>
                  <p className="text-xs text-neutral-400">{systemData.cpu.temperature}°C</p>
                </div>
                <div className="flex flex-col items-end">
                  <Cpu className="w-8 h-8 text-blue-500" />
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      systemData.cpu.usage < 70
                        ? "bg-green-500"
                        : systemData.cpu.usage < 85
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    } animate-pulse`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memory Status */}
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 tracking-wider font-medium">MEMORY USAGE</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{systemData.memory.usage.toFixed(1)}%</p>
                  <p className="text-xs text-neutral-400">{formatBytes(systemData.memory.used * 1024 * 1024)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <HardDrive className="w-8 h-8 text-green-500" />
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      systemData.memory.usage < 75
                        ? "bg-green-500"
                        : systemData.memory.usage < 90
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    } animate-pulse`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Status */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-400 tracking-wider font-medium">TEMPERATURE</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{systemData.temperature.cpu}°C</p>
                  <p className="text-xs text-neutral-400">CPU Core</p>
                </div>
                <div className="flex flex-col items-end">
                  <Thermometer className="w-8 h-8 text-orange-500" />
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      systemData.temperature.cpu < 60
                        ? "bg-green-500"
                        : systemData.temperature.cpu < 75
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    } animate-pulse`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Power Status */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-400 tracking-wider font-medium">POWER DRAW</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">
                    {systemData.power.consumption.toFixed(1)}W
                  </p>
                  <p className="text-xs text-neutral-400">{systemData.power.efficiency}% Eff</p>
                </div>
                <div className="flex flex-col items-end">
                  <Zap className="w-8 h-8 text-purple-500" />
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CPU Details */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-orange-500" />
                  CPU Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">CPU Usage</span>
                    <span
                      className={`font-mono ${getStatusColor(systemData.cpu.usage, { warning: 70, critical: 85 })}`}
                    >
                      {systemData.cpu.usage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={systemData.cpu.usage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Cores:</span>
                    <span className="text-white font-mono">{systemData.cpu.cores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Frequency:</span>
                    <span className="text-white font-mono">{systemData.cpu.frequency} MHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Temperature:</span>
                    <span
                      className={`font-mono ${getStatusColor(systemData.cpu.temperature, { warning: 60, critical: 75 })}`}
                    >
                      {systemData.cpu.temperature}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Processes:</span>
                    <span className="text-white font-mono">{systemData.cpu.processes}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-2">Load Average</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-neutral-800 rounded">
                      <div className="text-white font-mono">{systemData.cpu.loadAverage[0]}</div>
                      <div className="text-xs text-neutral-400">1 min</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-800 rounded">
                      <div className="text-white font-mono">{systemData.cpu.loadAverage[1]}</div>
                      <div className="text-xs text-neutral-400">5 min</div>
                    </div>
                    <div className="text-center p-2 bg-neutral-800 rounded">
                      <div className="text-white font-mono">{systemData.cpu.loadAverage[2]}</div>
                      <div className="text-xs text-neutral-400">15 min</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Memory Details */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-orange-500" />
                  Memory Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Memory Usage</span>
                    <span
                      className={`font-mono ${getStatusColor(systemData.memory.usage, { warning: 75, critical: 90 })}`}
                    >
                      {systemData.memory.usage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={systemData.memory.usage} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Memory:</span>
                    <span className="text-white font-mono">{formatBytes(systemData.memory.total * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Used Memory:</span>
                    <span className="text-blue-400 font-mono">{formatBytes(systemData.memory.used * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Free Memory:</span>
                    <span className="text-green-400 font-mono">
                      {formatBytes(systemData.memory.free * 1024 * 1024)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Cached:</span>
                    <span className="text-yellow-400 font-mono">
                      {formatBytes(systemData.memory.cached * 1024 * 1024)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Buffers:</span>
                    <span className="text-purple-400 font-mono">
                      {formatBytes(systemData.memory.buffers * 1024 * 1024)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-2">Memory Distribution</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-neutral-400">Used ({systemData.memory.usage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-neutral-400">Free ({(100 - systemData.memory.usage).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Storage and Temperature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Storage Information */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-orange-500" />
                  Storage Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Storage Usage</span>
                    <span
                      className={`font-mono ${getStatusColor(systemData.storage.usage, { warning: 80, critical: 95 })}`}
                    >
                      {systemData.storage.usage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={systemData.storage.usage} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Space:</span>
                    <span className="text-white font-mono">{formatBytes(systemData.storage.total * 1024 * 1024)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Used Space:</span>
                    <span className="text-blue-400 font-mono">
                      {formatBytes(systemData.storage.used * 1024 * 1024)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Free Space:</span>
                    <span className="text-green-400 font-mono">
                      {formatBytes(systemData.storage.free * 1024 * 1024)}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-2">Process Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total:</span>
                      <span className="text-white font-mono">{systemData.processes.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Running:</span>
                      <span className="text-green-400 font-mono">{systemData.processes.running}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Sleeping:</span>
                      <span className="text-blue-400 font-mono">{systemData.processes.sleeping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Stopped:</span>
                      <span className="text-yellow-400 font-mono">{systemData.processes.stopped}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Temperature and Power */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  Temperature & Power
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">Temperature Sensors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">CPU Temperature:</span>
                      <span
                        className={`font-mono ${getStatusColor(systemData.temperature.cpu, { warning: 60, critical: 75 })}`}
                      >
                        {systemData.temperature.cpu}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">System Temperature:</span>
                      <span
                        className={`font-mono ${getStatusColor(systemData.temperature.system, { warning: 50, critical: 65 })}`}
                      >
                        {systemData.temperature.system}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Ambient Temperature:</span>
                      <span className="text-white font-mono">{systemData.temperature.ambient}°C</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">Power Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Input Voltage:</span>
                      <span className="text-white font-mono">{systemData.power.input}V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Power Consumption:</span>
                      <span className="text-white font-mono">{systemData.power.consumption}W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Efficiency:</span>
                      <span className="text-green-400 font-mono">{systemData.power.efficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Status:</span>
                      <Badge className="bg-green-500/20 text-green-500">{systemData.power.status}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-neutral-300 mb-3">Fan Status</h4>
                  <div className="space-y-2">
                    {systemData.fans.map((fan) => (
                      <div key={fan.id} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                        <div className="flex items-center gap-2">
                          <Fan className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-white">{fan.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-mono">{fan.rpm} RPM</span>
                          <Badge className="bg-green-500/20 text-green-500 text-xs">{fan.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* System Uptime and Health */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              System Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 font-mono mb-2">
                  {formatUptime(systemData.uptime)}
                </div>
                <div className="text-sm text-neutral-400">System Uptime</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-xl font-bold text-green-400">Healthy</span>
                </div>
                <div className="text-sm text-neutral-400">Overall Status</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 font-mono mb-2">99.8%</div>
                <div className="text-sm text-neutral-400">Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
