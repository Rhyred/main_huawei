"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Globe, Users } from "lucide-react"

export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState({
    cpuUsage: 23,
    memoryUsage: 45,
    uptime: "7d 14h 23m",
    pingStatus: "12 ms",
    internetStatus: "Connected",
    gateway: "192.168.1.1",
    dns: "8.8.8.8",
    activeDevices: {
      total: 24,
      hotspot: 18,
      pppoe: 6,
    },
    bandwidth: {
      download: 55.4,
      upload: 23.8,
    },
    systemInfo: {
      model: "AR2220E-S",
      version: "V200R010C00SPC600",
      serial: "2102351BWL10E4000123",
      temperature: "42°C",
      power: "Normal",
    },
  });

  useEffect(() => {
    // Simulate real-time updates
    const timer = setInterval(() => {
      setDashboardData(prevData => ({
        ...prevData,
        cpuUsage: Math.floor(Math.random() * 15 + 20), // 20-35%
        memoryUsage: Math.floor(Math.random() * 10 + 40), // 40-50%
        pingStatus: `${Math.floor(Math.random() * 50 + 10)} ms`,
        bandwidth: {
          download: Math.random() * 100,
          upload: Math.random() * 50,
        },
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Top Row - Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-400">CPU Usage</span>
                  <span className="text-white font-mono">{dashboardData.cpuUsage}%</span>
                </div>
                <Progress value={dashboardData.cpuUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-400">Memory Usage</span>
                  <span className="text-white font-mono">{dashboardData.memoryUsage}%</span>
                </div>
                <Progress value={dashboardData.memoryUsage} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Uptime</span>
                <span className="text-white font-mono">{dashboardData.uptime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internet Status */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-500" />
              Internet Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-500">{dashboardData.internetStatus}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Ping to 8.8.8.8:</span>
                <span className="text-white font-mono">{dashboardData.pingStatus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Gateway:</span>
                <span className="text-white font-mono">{dashboardData.gateway}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">DNS:</span>
                <span className="text-white font-mono">{dashboardData.dns}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Devices */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              Active Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-orange-500 font-mono mb-2">{dashboardData.activeDevices.total}</div>
            <div className="text-sm text-neutral-400">Hotspot & PPPoE Users</div>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full text-xs">
              <div className="text-center">
                <div className="text-white font-mono">{dashboardData.activeDevices.hotspot}</div>
                <div className="text-neutral-500">Hotspot</div>
              </div>
              <div className="text-center">
                <div className="text-white font-mono">{dashboardData.activeDevices.pppoe}</div>
                <div className="text-neutral-500">PPPoE</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Bandwidth Chart */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Real-time Bandwidth
            </CardTitle>
            <Select defaultValue="eth0">
              <SelectTrigger className="w-48 bg-neutral-800 border-neutral-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eth0">Ethernet 0/0/1</SelectItem>
                <SelectItem value="eth1">Ethernet 0/0/2</SelectItem>
                <SelectItem value="wlan0">WLAN 2.4GHz</SelectItem>
                <SelectItem value="wlan1">WLAN 5GHz</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            {/* Chart Grid */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-neutral-700"></div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-12 font-mono">
              <span>100 Mbps</span>
              <span>80 Mbps</span>
              <span>60 Mbps</span>
              <span>40 Mbps</span>
              <span>20 Mbps</span>
              <span>0 Mbps</span>
            </div>

            {/* Animated bandwidth bars */}
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-around px-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-2 bg-blue-500 transition-all duration-1000 ease-in-out"
                    style={{
                      height: `${Math.max(5, dashboardData.bandwidth.download + Math.sin(i * 0.5) * 20)}%`,
                    }}
                  ></div>
                  <div
                    className="w-2 bg-red-500 transition-all duration-1000 ease-in-out"
                    style={{
                      height: `${Math.max(5, dashboardData.bandwidth.upload + Math.cos(i * 0.3) * 15)}%`,
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-blue-500"></div>
                <span className="text-neutral-400">Download (Mbps)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-2 bg-red-500"></div>
                <span className="text-neutral-400">Upload (Mbps)</span>
              </div>
            </div>

            {/* Current values */}
            <div className="absolute top-4 right-4 text-right">
              <div className="text-sm text-blue-400 font-mono">↓ {dashboardData.bandwidth.download.toFixed(1)} Mbps</div>
              <div className="text-sm text-red-400 font-mono">↑ {dashboardData.bandwidth.upload.toFixed(1)} Mbps</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Network Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interface Status */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">Interface Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Ethernet 0/0/1", status: "UP", speed: "1000M", ip: "192.168.1.1" },
                { name: "Ethernet 0/0/2", status: "UP", speed: "1000M", ip: "10.0.0.1" },
                { name: "WLAN 2.4GHz", status: "UP", speed: "300M", ip: "192.168.2.1" },
                { name: "WLAN 5GHz", status: "UP", speed: "867M", ip: "192.168.5.1" },
              ].map((iface, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-neutral-800 rounded">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${iface.status === "UP" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div>
                      <div className="text-sm text-white">{iface.name}</div>
                      <div className="text-xs text-neutral-400">{iface.ip}</div>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">{iface.speed}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Model:</span>
                <span className="text-white font-mono">{dashboardData.systemInfo.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Version:</span>
                <span className="text-white font-mono">{dashboardData.systemInfo.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Serial:</span>
                <span className="text-white font-mono">{dashboardData.systemInfo.serial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Temperature:</span>
                <span className="text-white font-mono">{dashboardData.systemInfo.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Power:</span>
                <span className="text-green-500 font-mono">{dashboardData.systemInfo.power}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
