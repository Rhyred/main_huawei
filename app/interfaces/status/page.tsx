"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import {
  Router,
  Wifi,
  Cable,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { useState, useEffect } from "react"
import { dummyInterfaces } from "@/lib/dummy-data"

type Interface = typeof dummyInterfaces[0]

export default function InterfaceStatusPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [interfaces, setInterfaces] = useState<Interface[]>([])
  const [selectedInterface, setSelectedInterface] = useState("all")

  useEffect(() => {
    // Simulate initial data fetch
    setIsLoading(true)
    setTimeout(() => {
      setInterfaces(dummyInterfaces)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getInterfaceIcon = (type: string) => {
    switch (type) {
      case "wireless":
        return <Wifi className="w-5 h-5" />
      case "ethernet":
        return <Cable className="w-5 h-5" />
      default:
        return <Router className="w-5 h-5" />
    }
  }

  const formatBytes = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const refreshData = async () => {
    setIsLoading(true)
    // In a real app, you'd fetch data from an API here
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // To simulate data change on refresh, we can shuffle the array
    setInterfaces([...dummyInterfaces].sort(() => Math.random() - 0.5))
    setIsLoading(false)
  }

  const filteredInterfaces =
    selectedInterface === "all" ? interfaces : interfaces.filter((iface) => iface.type === selectedInterface)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">Interface Status</h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Monitor network interface status and statistics</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Interface Filter Tabs */}
        <Tabs value={selectedInterface} onValueChange={setSelectedInterface}>
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="all">All Interfaces</TabsTrigger>
            <TabsTrigger value="ethernet">Ethernet</TabsTrigger>
            <TabsTrigger value="wireless">Wireless</TabsTrigger>
            <TabsTrigger value="ppp">PPP</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedInterface} className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground tracking-wider">TOTAL INTERFACES</p>
                      <p className="text-2xl font-bold">{filteredInterfaces.length}</p>
                    </div>
                    <Router className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground tracking-wider">INTERFACES UP</p>
                      <p className="text-2xl font-bold">
                        {filteredInterfaces.filter((i) => i.status === "up").length}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground tracking-wider">AVG UTILIZATION</p>
                      <p className="text-2xl font-bold">
                        {(
                          filteredInterfaces.reduce((acc, i) => acc + i.utilization, 0) / filteredInterfaces.length
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground tracking-wider">TOTAL ERRORS</p>
                      <p className="text-2xl font-bold">
                        {filteredInterfaces.reduce((acc, i) => acc + i.inErrors + i.outErrors, 0)}
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interface Details */}
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <ComponentLoader key={i} type="card" />)
                : filteredInterfaces.map((iface) => (
                  <Card key={iface.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getInterfaceIcon(iface.type)}
                          <div>
                            <CardTitle className="text-lg">{iface.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{iface.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${iface.status === "up" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                              }`}
                          >
                            {iface.status.toUpperCase()}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">IP Address:</span>
                              <span className="font-mono">{iface.ip}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subnet Mask:</span>
                              <span className="font-mono">{iface.mask}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">MAC Address:</span>
                              <span className="font-mono">{iface.mac}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Speed/Duplex:</span>
                              <span className="font-mono">
                                {iface.speed}M/{iface.duplex}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">MTU:</span>
                              <span className="font-mono">{iface.mtu}</span>
                            </div>
                          </div>
                        </div>

                        {/* Traffic Statistics */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Traffic Statistics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bytes In:</span>
                              <span className="text-blue-500 dark:text-blue-400 font-mono">{formatBytes(iface.inOctets)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bytes Out:</span>
                              <span className="text-red-500 dark:text-red-400 font-mono">{formatBytes(iface.outOctets)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Packets In:</span>
                              <span className="font-mono">{iface.inPackets.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Packets Out:</span>
                              <span className="font-mono">{iface.outPackets.toLocaleString()}</span>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Utilization:</span>
                                <span className="font-mono">{iface.utilization}%</span>
                              </div>
                              <Progress value={iface.utilization} className="h-2" />
                            </div>
                          </div>
                        </div>

                        {/* Error Statistics */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-muted-foreground">Error Statistics</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Input Errors:</span>
                              <span className={`font-mono ${iface.inErrors > 0 ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}>
                                {iface.inErrors}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Output Errors:</span>
                              <span
                                className={`font-mono ${iface.outErrors > 0 ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400"}`}
                              >
                                {iface.outErrors}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Input Drops:</span>
                              <span
                                className={`font-mono ${iface.inDrops > 10 ? "text-yellow-500 dark:text-yellow-400" : "text-green-500 dark:text-green-400"}`}
                              >
                                {iface.inDrops}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Output Drops:</span>
                              <span
                                className={`font-mono ${iface.outDrops > 10 ? "text-yellow-500 dark:text-yellow-400" : "text-green-500 dark:text-green-400"}`}
                              >
                                {iface.outDrops}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Last Change:</span>
                              <span className="font-mono text-xs">{iface.lastChange}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-6 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Activity className="w-4 h-4 mr-2" />
                          Monitor
                        </Button>
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
