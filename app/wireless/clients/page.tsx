"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import {
  Users,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Wifi,
  Signal,
  Activity,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Ban,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useState, useEffect } from "react"

interface WirelessClient {
  id: number
  macAddress: string
  ipAddress: string
  hostname: string
  deviceType: "smartphone" | "laptop" | "tablet" | "desktop" | "iot" | "unknown"
  manufacturer: string
  ssid: string
  band: "2.4GHz" | "5GHz"
  signalStrength: number
  snr: number
  connectionTime: string
  uptime: string
  rxBytes: number
  txBytes: number
  rxRate: string
  txRate: string
  rxPackets: number
  txPackets: number
  authType: string
  encryption: string
  channel: number
  powerSave: boolean
  roamingCount: number
  lastActivity: string
  status: "connected" | "disconnected" | "blocked" | "idle"
  qosClass: "voice" | "video" | "data" | "background"
  bandwidth: {
    download: number
    upload: number
  }
}

interface ClientStatistics {
  totalClients: number
  activeClients: number
  idleClients: number
  blockedClients: number
  bandwidthUsage: {
    total: number
    download: number
    upload: number
  }
  deviceTypes: {
    [key: string]: number
  }
  bandDistribution: {
    "2.4GHz": number
    "5GHz": number
  }
}

export default function WirelessClientsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSSID, setSelectedSSID] = useState("all")
  const [selectedBand, setSelectedBand] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [clients, setClients] = useState<WirelessClient[]>([])
  const [statistics, setStatistics] = useState<ClientStatistics | null>(null)

  // Initialize data
  useEffect(() => {
    const clientsData: WirelessClient[] = [
      {
        id: 1,
        macAddress: "aa:bb:cc:dd:ee:01",
        ipAddress: "192.168.1.100",
        hostname: "iPhone-John",
        deviceType: "smartphone",
        manufacturer: "Apple",
        ssid: "HuaweiNet-5G",
        band: "5GHz",
        signalStrength: -42,
        snr: 58,
        connectionTime: "2024-01-30 13:15:30",
        uptime: "2h 15m 30s",
        rxBytes: 1024000000,
        txBytes: 512000000,
        rxRate: "867 Mbps",
        txRate: "867 Mbps",
        rxPackets: 750000,
        txPackets: 425000,
        authType: "WPA3-SAE",
        encryption: "AES",
        channel: 36,
        powerSave: true,
        roamingCount: 2,
        lastActivity: "2024-01-30 15:30:45",
        status: "connected",
        qosClass: "video",
        bandwidth: {
          download: 25.5,
          upload: 12.3,
        },
      },
      {
        id: 2,
        macAddress: "bb:cc:dd:ee:ff:02",
        ipAddress: "192.168.1.101",
        hostname: "Laptop-Sarah",
        deviceType: "laptop",
        manufacturer: "Dell",
        ssid: "HuaweiNet-5G",
        band: "5GHz",
        signalStrength: -38,
        snr: 62,
        connectionTime: "2024-01-30 12:45:15",
        uptime: "3h 45m 15s",
        rxBytes: 2048000000,
        txBytes: 1024000000,
        rxRate: "867 Mbps",
        txRate: "867 Mbps",
        rxPackets: 1200000,
        txPackets: 800000,
        authType: "WPA3-SAE",
        encryption: "AES",
        channel: 36,
        powerSave: false,
        roamingCount: 0,
        lastActivity: "2024-01-30 15:30:42",
        status: "connected",
        qosClass: "data",
        bandwidth: {
          download: 45.2,
          upload: 28.7,
        },
      },
      {
        id: 3,
        macAddress: "cc:dd:ee:ff:aa:03",
        ipAddress: "192.168.1.102",
        hostname: "iPad-Guest",
        deviceType: "tablet",
        manufacturer: "Apple",
        ssid: "HuaweiNet-2.4G",
        band: "2.4GHz",
        signalStrength: -52,
        snr: 43,
        connectionTime: "2024-01-30 14:20:45",
        uptime: "1h 10m 00s",
        rxBytes: 256000000,
        txBytes: 128000000,
        rxRate: "150 Mbps",
        txRate: "150 Mbps",
        rxPackets: 180000,
        txPackets: 95000,
        authType: "WPA2-PSK",
        encryption: "AES",
        channel: 6,
        powerSave: true,
        roamingCount: 1,
        lastActivity: "2024-01-30 15:30:38",
        status: "connected",
        qosClass: "video",
        bandwidth: {
          download: 8.5,
          upload: 3.2,
        },
      },
      {
        id: 4,
        macAddress: "dd:ee:ff:aa:bb:04",
        ipAddress: "192.168.1.103",
        hostname: "Desktop-Office",
        deviceType: "desktop",
        manufacturer: "HP",
        ssid: "HuaweiNet-5G",
        band: "5GHz",
        signalStrength: -35,
        snr: 65,
        connectionTime: "2024-01-30 09:30:00",
        uptime: "6h 00m 45s",
        rxBytes: 5120000000,
        txBytes: 2560000000,
        rxRate: "867 Mbps",
        txRate: "867 Mbps",
        rxPackets: 3200000,
        txPackets: 1800000,
        authType: "WPA3-SAE",
        encryption: "AES",
        channel: 36,
        powerSave: false,
        roamingCount: 0,
        lastActivity: "2024-01-30 15:30:40",
        status: "connected",
        qosClass: "data",
        bandwidth: {
          download: 78.9,
          upload: 45.6,
        },
      },
      {
        id: 5,
        macAddress: "ee:ff:aa:bb:cc:05",
        ipAddress: "192.168.2.150",
        hostname: "Unknown-Device",
        deviceType: "unknown",
        manufacturer: "Unknown",
        ssid: "HuaweiNet-Guest",
        band: "2.4GHz",
        signalStrength: -65,
        snr: 30,
        connectionTime: "2024-01-30 15:00:00",
        uptime: "30m 45s",
        rxBytes: 50000000,
        txBytes: 25000000,
        rxRate: "72 Mbps",
        txRate: "72 Mbps",
        rxPackets: 35000,
        txPackets: 18000,
        authType: "WPA2-PSK",
        encryption: "AES",
        channel: 11,
        powerSave: true,
        roamingCount: 0,
        lastActivity: "2024-01-30 15:25:12",
        status: "idle",
        qosClass: "background",
        bandwidth: {
          download: 2.1,
          upload: 0.8,
        },
      },
    ]

    const stats: ClientStatistics = {
      totalClients: clientsData.length,
      activeClients: clientsData.filter((c) => c.status === "connected").length,
      idleClients: clientsData.filter((c) => c.status === "idle").length,
      blockedClients: clientsData.filter((c) => c.status === "blocked").length,
      bandwidthUsage: {
        total: clientsData.reduce((acc, c) => acc + c.bandwidth.download + c.bandwidth.upload, 0),
        download: clientsData.reduce((acc, c) => acc + c.bandwidth.download, 0),
        upload: clientsData.reduce((acc, c) => acc + c.bandwidth.upload, 0),
      },
      deviceTypes: {
        smartphone: clientsData.filter((c) => c.deviceType === "smartphone").length,
        laptop: clientsData.filter((c) => c.deviceType === "laptop").length,
        tablet: clientsData.filter((c) => c.deviceType === "tablet").length,
        desktop: clientsData.filter((c) => c.deviceType === "desktop").length,
        iot: clientsData.filter((c) => c.deviceType === "iot").length,
        unknown: clientsData.filter((c) => c.deviceType === "unknown").length,
      },
      bandDistribution: {
        "2.4GHz": clientsData.filter((c) => c.band === "2.4GHz").length,
        "5GHz": clientsData.filter((c) => c.band === "5GHz").length,
      },
    }

    setClients(clientsData)
    setStatistics(stats)
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "smartphone":
        return <Smartphone className="w-4 h-4" />
      case "laptop":
        return <Laptop className="w-4 h-4" />
      case "tablet":
        return <Tablet className="w-4 h-4" />
      case "desktop":
        return <Monitor className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getSignalQuality = (signal: number) => {
    if (signal >= -30) return { quality: "Excellent", color: "text-green-500", percentage: 100 }
    if (signal >= -50) return { quality: "Good", color: "text-green-400", percentage: 80 }
    if (signal >= -60) return { quality: "Fair", color: "text-yellow-500", percentage: 60 }
    if (signal >= -70) return { quality: "Poor", color: "text-orange-500", percentage: 40 }
    return { quality: "Very Poor", color: "text-red-500", percentage: 20 }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500/20 text-green-500"
      case "idle":
        return "bg-yellow-500/20 text-yellow-500"
      case "blocked":
        return "bg-red-500/20 text-red-500"
      case "disconnected":
        return "bg-gray-500/20 text-gray-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Filter clients based on search and filters
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      searchTerm === "" ||
      client.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ipAddress.includes(searchTerm)

    const matchesSSID = selectedSSID === "all" || client.ssid === selectedSSID
    const matchesBand = selectedBand === "all" || client.band === selectedBand
    const matchesStatus = selectedStatus === "all" || client.status === selectedStatus

    return matchesSearch && matchesSSID && matchesBand && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Wireless Clients</h1>
            <p className="text-sm text-neutral-400">Monitor and manage connected wireless devices</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-blue-400 tracking-wider font-medium">TOTAL CLIENTS</p>
                    <p className="text-2xl font-bold text-white font-mono">{statistics.totalClients}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-400 tracking-wider font-medium">ACTIVE CLIENTS</p>
                    <p className="text-2xl font-bold text-white font-mono">{statistics.activeClients}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-400 tracking-wider font-medium">TOTAL BANDWIDTH</p>
                    <p className="text-2xl font-bold text-white font-mono">
                      {statistics.bandwidthUsage.total.toFixed(1)} Mbps
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-orange-400 tracking-wider font-medium">5GHz CLIENTS</p>
                    <p className="text-2xl font-bold text-white font-mono">{statistics.bandDistribution["5GHz"]}</p>
                  </div>
                  <Wifi className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients">Connected Clients</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="blocked">Blocked Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="clients" className="space-y-6">
            {/* Filters */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="search" className="text-sm text-neutral-300">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <Input
                        id="search"
                        placeholder="Hostname, MAC, IP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ssid-filter" className="text-sm text-neutral-300">
                      SSID
                    </Label>
                    <Select value={selectedSSID} onValueChange={setSelectedSSID}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All SSIDs</SelectItem>
                        <SelectItem value="HuaweiNet-2.4G">HuaweiNet-2.4G</SelectItem>
                        <SelectItem value="HuaweiNet-5G">HuaweiNet-5G</SelectItem>
                        <SelectItem value="HuaweiNet-Guest">HuaweiNet-Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="band-filter" className="text-sm text-neutral-300">
                      Band
                    </Label>
                    <Select value={selectedBand} onValueChange={setSelectedBand}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Bands</SelectItem>
                        <SelectItem value="2.4GHz">2.4GHz</SelectItem>
                        <SelectItem value="5GHz">5GHz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter" className="text-sm text-neutral-300">
                      Status
                    </Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="connected">Connected</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clients List */}
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <ComponentLoader key={i} type="card" />)
                : filteredClients.map((client) => {
                    const signalQuality = getSignalQuality(client.signalStrength)

                    return (
                      <Card key={client.id} className="bg-neutral-900 border-neutral-700">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/20 rounded-lg">{getDeviceIcon(client.deviceType)}</div>
                              <div>
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                  {client.hostname}
                                  <Badge className="bg-blue-500/20 text-blue-400">{client.deviceType}</Badge>
                                </CardTitle>
                                <p className="text-sm text-neutral-400">
                                  {client.macAddress} • {client.ipAddress}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-sm text-neutral-400">Signal</p>
                                <p className={`text-lg font-bold font-mono ${signalQuality.color}`}>
                                  {client.signalStrength} dBm
                                </p>
                              </div>
                              <Badge className={getStatusColor(client.status)}>{client.status.toUpperCase()}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Connection Info */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Wifi className="w-4 h-4" />
                                Connection Info
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">SSID:</span>
                                  <span className="text-white font-mono">{client.ssid}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Band:</span>
                                  <span className="text-white font-mono">{client.band}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Channel:</span>
                                  <span className="text-white font-mono">{client.channel}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Auth:</span>
                                  <span className="text-white font-mono text-xs">{client.authType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Uptime:</span>
                                  <span className="text-white font-mono">{client.uptime}</span>
                                </div>
                              </div>
                            </div>

                            {/* Signal Quality */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Signal className="w-4 h-4" />
                                Signal Quality
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Signal:</span>
                                  <span className={`font-mono ${signalQuality.color}`}>
                                    {client.signalStrength} dBm
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">SNR:</span>
                                  <span className="text-green-400 font-mono">{client.snr} dB</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Quality:</span>
                                  <span className={`font-mono ${signalQuality.color}`}>{signalQuality.quality}</span>
                                </div>
                                <div className="pt-1">
                                  <Progress value={signalQuality.percentage} className="h-2" />
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Roaming:</span>
                                  <span className="text-white font-mono">{client.roamingCount}x</span>
                                </div>
                              </div>
                            </div>

                            {/* Bandwidth Usage */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Bandwidth Usage
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Download:</span>
                                  <span className="text-green-400 font-mono">{client.bandwidth.download} Mbps</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Upload:</span>
                                  <span className="text-blue-400 font-mono">{client.bandwidth.upload} Mbps</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">RX Rate:</span>
                                  <span className="text-white font-mono">{client.rxRate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">TX Rate:</span>
                                  <span className="text-white font-mono">{client.txRate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">QoS Class:</span>
                                  <span className="text-white font-mono">{client.qosClass}</span>
                                </div>
                              </div>
                            </div>

                            {/* Data Transfer */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Data Transfer
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">RX Bytes:</span>
                                  <span className="text-white font-mono">{formatBytes(client.rxBytes)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">TX Bytes:</span>
                                  <span className="text-white font-mono">{formatBytes(client.txBytes)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">RX Packets:</span>
                                  <span className="text-white font-mono">{client.rxPackets.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">TX Packets:</span>
                                  <span className="text-white font-mono">{client.txPackets.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Last Activity:</span>
                                  <span className="text-white font-mono text-xs">{client.lastActivity}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-700">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            <Button variant="outline" size="sm">
                              <Ban className="w-4 h-4 mr-2" />
                              Block
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="w-4 h-4 mr-2" />
                              Disconnect
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            {/* Device Type Distribution */}
            {statistics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-neutral-900 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Device Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(statistics.deviceTypes).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(type)}
                            <span className="text-neutral-300 capitalize">{type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono">{count}</span>
                            <div className="w-20 bg-neutral-800 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(count / statistics.totalClients) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Band Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-orange-500" />
                          <span className="text-neutral-300">2.4GHz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{statistics.bandDistribution["2.4GHz"]}</span>
                          <div className="w-20 bg-neutral-800 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${(statistics.bandDistribution["2.4GHz"] / statistics.totalClients) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-blue-500" />
                          <span className="text-neutral-300">5GHz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{statistics.bandDistribution["5GHz"]}</span>
                          <div className="w-20 bg-neutral-800 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${(statistics.bandDistribution["5GHz"] / statistics.totalClients) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bandwidth Statistics */}
            {statistics && (
              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Bandwidth Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20">
                      <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400">
                        {statistics.bandwidthUsage.download.toFixed(1)} Mbps
                      </div>
                      <div className="text-xs text-neutral-400">Total Download</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20">
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400">
                        {statistics.bandwidthUsage.upload.toFixed(1)} Mbps
                      </div>
                      <div className="text-xs text-neutral-400">Total Upload</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/20">
                      <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">
                        {statistics.bandwidthUsage.total.toFixed(1)} Mbps
                      </div>
                      <div className="text-xs text-neutral-400">Total Bandwidth</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-500" />
                  Blocked Devices
                </CardTitle>
                <p className="text-sm text-neutral-400">Manage devices that have been blocked from the network</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Ban className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-400 mb-2">No Blocked Devices</h3>
                  <p className="text-sm text-neutral-500">All devices are currently allowed on the network</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
