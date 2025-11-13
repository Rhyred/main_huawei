"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import { Wifi, Signal, Users, Shield, Settings, RefreshCw, Eye, Lock, Unlock, Radio, Antenna } from "lucide-react"
import { useState } from "react"

export default function WirelessInterfacesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBand, setSelectedBand] = useState("all")

  const wirelessInterfaces = [
    {
      id: "wlan0",
      name: "WLAN 2.4GHz",
      ssid: "HuaweiNet-2.4G",
      band: "2.4GHz",
      channel: 6,
      channelWidth: 20,
      power: 20,
      maxPower: 23,
      mode: "802.11n",
      security: "WPA2-PSK",
      status: "up",
      clients: 12,
      maxClients: 50,
      utilization: 45.2,
      signalStrength: -42,
      noiseFloor: -95,
      snr: 53,
      dataRate: "150 Mbps",
      beaconInterval: 100,
      dtimPeriod: 2,
      rtsThreshold: 2347,
      fragThreshold: 2346,
      lastActivity: "2024-01-30 15:23:45",
    },
    {
      id: "wlan1",
      name: "WLAN 5GHz",
      ssid: "HuaweiNet-5G",
      band: "5GHz",
      channel: 36,
      channelWidth: 80,
      power: 23,
      maxPower: 30,
      mode: "802.11ac",
      security: "WPA3-SAE",
      status: "up",
      clients: 8,
      maxClients: 100,
      utilization: 23.7,
      signalStrength: -38,
      noiseFloor: -92,
      snr: 54,
      dataRate: "867 Mbps",
      beaconInterval: 100,
      dtimPeriod: 2,
      rtsThreshold: 2347,
      fragThreshold: 2346,
      lastActivity: "2024-01-30 15:24:12",
    },
    {
      id: "wlan2",
      name: "Guest Network",
      ssid: "HuaweiNet-Guest",
      band: "2.4GHz",
      channel: 11,
      channelWidth: 20,
      power: 15,
      maxPower: 23,
      mode: "802.11n",
      security: "Open",
      status: "up",
      clients: 4,
      maxClients: 20,
      utilization: 12.4,
      signalStrength: -45,
      noiseFloor: -94,
      snr: 49,
      dataRate: "72 Mbps",
      beaconInterval: 100,
      dtimPeriod: 1,
      rtsThreshold: 2347,
      fragThreshold: 2346,
      lastActivity: "2024-01-30 15:22:33",
    },
  ]

  const getSignalQuality = (signal: number) => {
    if (signal >= -30) return { quality: "Excellent", color: "text-green-500", percentage: 100 }
    if (signal >= -50) return { quality: "Good", color: "text-green-400", percentage: 80 }
    if (signal >= -60) return { quality: "Fair", color: "text-yellow-500", percentage: 60 }
    if (signal >= -70) return { quality: "Poor", color: "text-orange-500", percentage: 40 }
    return { quality: "Very Poor", color: "text-red-500", percentage: 20 }
  }

  const getSecurityIcon = (security: string) => {
    if (security === "Open") return <Unlock className="w-4 h-4 text-red-500" />
    return <Lock className="w-4 h-4 text-green-500" />
  }

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const filteredInterfaces =
    selectedBand === "all" ? wirelessInterfaces : wirelessInterfaces.filter((iface) => iface.band === selectedBand)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Wireless Interfaces</h1>
            <p className="text-sm text-neutral-400">Manage and monitor wireless network interfaces</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Band Filter Tabs */}
        <Tabs value={selectedBand} onValueChange={setSelectedBand}>
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="all">All Bands</TabsTrigger>
            <TabsTrigger value="2.4GHz">2.4GHz</TabsTrigger>
            <TabsTrigger value="5GHz">5GHz</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedBand} className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-neutral-900 border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider">ACTIVE INTERFACES</p>
                      <p className="text-2xl font-bold text-white font-mono">
                        {filteredInterfaces.filter((i) => i.status === "up").length}
                      </p>
                    </div>
                    <Wifi className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider">CONNECTED CLIENTS</p>
                      <p className="text-2xl font-bold text-white font-mono">
                        {filteredInterfaces.reduce((acc, i) => acc + i.clients, 0)}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider">AVG UTILIZATION</p>
                      <p className="text-2xl font-bold text-white font-mono">
                        {(
                          filteredInterfaces.reduce((acc, i) => acc + i.utilization, 0) / filteredInterfaces.length
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <Signal className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 tracking-wider">SECURED NETWORKS</p>
                      <p className="text-2xl font-bold text-white font-mono">
                        {filteredInterfaces.filter((i) => i.security !== "Open").length}
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Wireless Interface Details */}
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <ComponentLoader key={i} type="card" />)
                : filteredInterfaces.map((iface) => {
                    const signalQuality = getSignalQuality(iface.signalStrength)

                    return (
                      <Card key={iface.id} className="bg-neutral-900 border-neutral-700">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Wifi className="w-6 h-6 text-blue-500" />
                              </div>
                              <div>
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                  {iface.name}
                                  <Badge className="bg-blue-500/20 text-blue-400">{iface.band}</Badge>
                                </CardTitle>
                                <p className="text-sm text-neutral-400">SSID: {iface.ssid}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${
                                  iface.status === "up"
                                    ? "bg-green-500/20 text-green-500"
                                    : "bg-red-500/20 text-red-500"
                                }`}
                              >
                                {iface.status.toUpperCase()}
                              </Badge>
                              {getSecurityIcon(iface.security)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Radio Configuration */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Radio className="w-4 h-4" />
                                Radio Configuration
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Channel:</span>
                                  <span className="text-white font-mono">{iface.channel}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Channel Width:</span>
                                  <span className="text-white font-mono">{iface.channelWidth} MHz</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Mode:</span>
                                  <span className="text-white font-mono">{iface.mode}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Data Rate:</span>
                                  <span className="text-white font-mono">{iface.dataRate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Security:</span>
                                  <span
                                    className={`font-mono ${iface.security === "Open" ? "text-red-400" : "text-green-400"}`}
                                  >
                                    {iface.security}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Signal Quality */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Antenna className="w-4 h-4" />
                                Signal Quality
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Signal Strength:</span>
                                  <span className={`font-mono ${signalQuality.color}`}>{iface.signalStrength} dBm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Noise Floor:</span>
                                  <span className="text-white font-mono">{iface.noiseFloor} dBm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">SNR:</span>
                                  <span className="text-green-400 font-mono">{iface.snr} dB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Quality:</span>
                                  <span className={`font-mono ${signalQuality.color}`}>{signalQuality.quality}</span>
                                </div>
                                <div className="pt-1">
                                  <Progress value={signalQuality.percentage} className="h-2" />
                                </div>
                              </div>
                            </div>

                            {/* Power & Performance */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300">Power & Performance</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">TX Power:</span>
                                  <span className="text-white font-mono">{iface.power} dBm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Max Power:</span>
                                  <span className="text-neutral-400 font-mono">{iface.maxPower} dBm</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Utilization:</span>
                                  <span className="text-white font-mono">{iface.utilization}%</span>
                                </div>
                                <div className="pt-1">
                                  <Progress value={iface.utilization} className="h-2" />
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Clients:</span>
                                  <span className="text-white font-mono">
                                    {iface.clients}/{iface.maxClients}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Advanced Settings */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300">Advanced Settings</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Beacon Interval:</span>
                                  <span className="text-white font-mono">{iface.beaconInterval} ms</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">DTIM Period:</span>
                                  <span className="text-white font-mono">{iface.dtimPeriod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">RTS Threshold:</span>
                                  <span className="text-white font-mono">{iface.rtsThreshold}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Frag Threshold:</span>
                                  <span className="text-white font-mono">{iface.fragThreshold}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Last Activity:</span>
                                  <span className="text-white font-mono text-xs">{iface.lastActivity}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-700">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Clients
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button variant="outline" size="sm">
                              <Signal className="w-4 h-4 mr-2" />
                              Site Survey
                            </Button>
                            <Button variant="outline" size="sm">
                              <Shield className="w-4 h-4 mr-2" />
                              Security
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
