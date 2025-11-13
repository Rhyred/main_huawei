"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import RealTimeBandwidth from "@/components/monitoring/RealTimeBandwidth"
import AutoRefreshTimer from "@/components/monitoring/AutoRefreshTimer"
import NetworkTesting from "@/components/monitoring/NetworkTesting"
import AnomalyDetection from "@/components/monitoring/AnomalyDetection"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import { Activity, Users, Globe, Server, Router, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [systemData, setSystemData] = useState({
    cpu: 23,
    memory: 45,
    temperature: 42,
    latency: 15,
    packetLoss: 0,
    uptime: "15d 7h 23m",
    loadAverage: "1.2, 1.5, 1.8",
    cores: 4,
    memoryUsed: "0.9GB",
    memoryTotal: "2GB",
    bandwidth: { download: 0, upload: 0 }, // Re-add bandwidth
  });

  const [networkStats, setNetworkStats] = useState({
    status: "Connected",
    gateway: "192.168.1.1",
    dnsPrimary: "8.8.8.8",
    dnsSecondary: "8.8.4.4",
    totalTrafficTB: 1.2,
    peakBandwidthMbps: 95.4,
    activeConnections: 1247,
    interfacesUp: "4/4",
    dhcpLeases: "18/100",
    firewallRules: 127,
    vpnTunnels: "2/5",
    activeDevices: {
      total: 24,
      wireless: 18,
      wired: 6,
    },
  });

  const [deviceInfo, setDeviceInfo] = useState({
    model: "Huawei AR2220E-S",
    softwareVersion: "V200R010C00SPC600",
    serialNumber: "2102351BWL10E4000123",
    macAddress: "00:11:22:33:44:55",
    bootTime: "2024-01-15 08:30:45",
    lastConfigSave: "2024-01-28 14:22:10",
    powerStatus: "Normal",
  });

  const [interfaces, setInterfaces] = useState([
    {
      name: "Ethernet 0/0/1",
      status: "UP",
      speed: "1000M",
      ip: "192.168.1.1",
      traffic: "↑ 45.2M ↓ 123.8M",
    },
    {
      name: "Ethernet 0/0/2",
      status: "UP",
      speed: "1000M",
      ip: "10.0.0.1",
      traffic: "↑ 12.1M ↓ 67.4M",
    },
    { name: "WLAN 2.4GHz", status: "UP", speed: "300M", ip: "192.168.2.1", traffic: "↑ 8.7M ↓ 34.2M" },
    { name: "WLAN 5GHz", status: "UP", speed: "867M", ip: "192.168.5.1", traffic: "↑ 23.4M ↓ 89.1M" },
  ]);

  const refreshData = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSystemData((prev) => ({
        ...prev,
        cpu: Math.max(10, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        temperature: Math.max(35, Math.min(80, prev.temperature + (Math.random() - 0.5) * 5)),
        latency: Math.max(5, Math.min(200, prev.latency + (Math.random() - 0.5) * 20)),
        packetLoss: Math.max(0, Math.min(10, prev.packetLoss + (Math.random() - 0.5) * 2)),
        bandwidth: {
          download: Math.random() * 100,
          upload: Math.random() * 50,
        },
      }));

      setNetworkStats((prev) => ({
        ...prev,
        totalTrafficTB: prev.totalTrafficTB + Math.random() * 0.01,
        peakBandwidthMbps: Math.max(50, Math.min(100, prev.peakBandwidthMbps + (Math.random() - 0.5) * 5)),
        activeConnections: Math.max(
          800,
          Math.min(2000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 50)),
        ),
      }));
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const chatContext = { ...systemData, ...networkStats, deviceInfo, interfaces };

  return (
    <DashboardLayout chatContext={chatContext}>
      <div className="p-4 md:p-6 space-y-6">
        {/* Auto Refresh Timer */}
        <AutoRefreshTimer onRefresh={refreshData} isLoading={isLoading} />

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* System Health */}
          {isLoading ? (
            <ComponentLoader type="stats" />
          ) : (
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-600 tracking-wider font-medium">SYSTEM HEALTH</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono mt-1">
                      {systemData.cpu < 70 ? "GOOD" : systemData.cpu < 85 ? "FAIR" : "POOR"}
                    </p>
                    <p className="text-xs text-slate-600">CPU: {systemData.cpu.toFixed(0)}%</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Server className="w-8 h-8 text-blue-500" />
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${systemData.cpu < 70 ? "bg-green-500" : systemData.cpu < 85 ? "bg-yellow-500" : "bg-red-500"
                        } animate-pulse`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Status */}
          {isLoading ? (
            <ComponentLoader type="stats" />
          ) : (
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 tracking-wider font-medium">NETWORK STATUS</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono mt-1">ONLINE</p>
                    <p className="text-xs text-slate-600">Latency: {systemData.latency.toFixed(0)}ms</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Globe className="w-8 h-8 text-green-500" />
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Devices */}
          {isLoading ? (
            <ComponentLoader type="stats" />
          ) : (
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-600 tracking-wider font-medium">ACTIVE DEVICES</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono mt-1">{networkStats.activeDevices.total}</p>
                    <p className="text-xs text-slate-600">{networkStats.activeDevices.wireless} Wireless, {networkStats.activeDevices.wired} Wired</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Users className="w-8 h-8 text-orange-500" />
                    <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Transfer */}
          {isLoading ? (
            <ComponentLoader type="stats" />
          ) : (
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 tracking-wider font-medium">DATA TRANSFER</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono mt-1">
                      {networkStats.totalTrafficTB.toFixed(1)}TB
                    </p>
                    <p className="text-xs text-slate-600">This month</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <TrendingUp className="w-4 h-4 text-green-500 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Resources */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-orange-500" />
                  System Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">CPU Usage</span>
                    <span className="text-white font-mono">{systemData.cpu.toFixed(0)}%</span>
                  </div>
                  <Progress value={systemData.cpu} className="h-2" />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Load Average: {systemData.loadAverage}</span>
                    <span>{systemData.cores} Cores</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-400">Memory Usage</span>
                    <span className="text-white font-mono">{systemData.memory.toFixed(0)}%</span>
                  </div>
                  <Progress value={systemData.memory} className="h-2" />
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Used: {systemData.memoryUsed}</span>
                    <span>Total: {systemData.memoryTotal}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-xs text-neutral-400">Temperature</div>
                    <div className="text-lg font-mono text-white">{systemData.temperature.toFixed(0)}°C</div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-400">Uptime</div>
                    <div className="text-lg font-mono text-white">{systemData.uptime}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Overview */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  Network Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Internet Connection</span>
                  <Badge className="bg-green-500/20 text-green-500">Connected</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Gateway:</span>
                    <span className="text-white font-mono">{networkStats.gateway}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">DNS Primary:</span>
                    <span className="text-white font-mono">{networkStats.dnsPrimary}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">DNS Secondary:</span>
                    <span className="text-white font-mono">{networkStats.dnsSecondary}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Ping to 8.8.8.8:</span>
                    <span className="text-white font-mono">{systemData.latency.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Packet Loss:</span>
                    <span className={`font-mono ${systemData.packetLoss > 1 ? "text-red-400" : "text-green-400"}`}>
                      {systemData.packetLoss.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          {isLoading ? (
            <ComponentLoader type="card" />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Quick Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 font-mono">
                      {networkStats.peakBandwidthMbps.toFixed(0)}
                    </div>
                    <div className="text-xs text-neutral-400">Peak Bandwidth (Mbps)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 font-mono">
                      {networkStats.activeConnections.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-400">Active Connections</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Interfaces Up:</span>
                    <span className="text-green-400 font-mono">{networkStats.interfacesUp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">DHCP Leases:</span>
                    <span className="text-white font-mono">{networkStats.dhcpLeases}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Firewall Rules:</span>
                    <span className="text-white font-mono">{networkStats.firewallRules}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">VPN Tunnels:</span>
                    <span className="text-white font-mono">{networkStats.vpnTunnels}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Anomaly Detection */}
        <AnomalyDetection systemData={systemData} />

        {/* Real-time Bandwidth Monitor */}
        {isLoading ? <ComponentLoader type="chart" /> : <RealTimeBandwidth />}

        {/* Network Testing Tools */}
        <NetworkTesting />

        {/* Interface Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interface Status */}
          {isLoading ? (
            <ComponentLoader type="table" rows={4} />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Router className="w-4 h-4 text-orange-500" />
                  Interface Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {interfaces.map((iface, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${iface.status === "UP" ? "bg-green-500" : "bg-red-500"} animate-pulse`}
                        />
                        <div>
                          <div className="text-sm text-white font-medium">{iface.name}</div>
                          <div className="text-xs text-neutral-400">
                            {iface.ip} • {iface.speed}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${iface.status === "UP" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"} mb-1`}
                        >
                          {iface.status}
                        </Badge>
                        <div className="text-xs text-neutral-400 font-mono">{iface.traffic}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          {isLoading ? (
            <ComponentLoader type="table" rows={5} />
          ) : (
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-orange-500" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Model:</span>
                    <span className="text-white font-mono">{deviceInfo.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Software Version:</span>
                    <span className="text-white font-mono">{deviceInfo.softwareVersion}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Serial Number:</span>
                    <span className="text-white font-mono">{deviceInfo.serialNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">MAC Address:</span>
                    <span className="text-white font-mono">{deviceInfo.macAddress}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Boot Time:</span>
                    <span className="text-white font-mono">{deviceInfo.bootTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Last Config Save:</span>
                    <span className="text-white font-mono">{deviceInfo.lastConfigSave}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-400">Power Status:</span>
                      <Badge className="bg-green-500/20 text-green-500">{deviceInfo.powerStatus}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
