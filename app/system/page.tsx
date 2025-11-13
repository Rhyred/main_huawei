"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import { Settings, Power, RotateCcw, Info, Clock, Cpu, HardDrive, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function SystemPage() {
  const [isLoading, setIsLoading] = useState(false)

  const systemInfo = {
    identity: "HuaPau-Router",
    version: "V200R010C00SPC600",
    uptime: "15d 7h 23m 45s",
    cpuLoad: "23.5%",
    memoryUsage: "45.2%",
    model: "Huawei AR2220E-S",
    serialNumber: "2102351BWL10E4000123",
    macAddress: "00:11:22:33:44:55",
    bootTime: "2024-01-15 08:30:45",
    lastConfigSave: "2024-01-28 14:22:10",
    firmwareDate: "2024-01-10",
    licenseStatus: "Valid",
  }

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleReboot = () => {
    if (confirm("Are you sure you want to reboot the router? This will temporarily disconnect all users.")) {
      alert("Reboot command sent. The router will restart in 30 seconds.")
    }
  }

  const handleShutdown = () => {
    if (
      confirm(
        "Are you sure you want to shutdown the router? This will disconnect all users and require manual power-on.",
      )
    ) {
      alert("Shutdown command sent. The router will power off in 30 seconds.")
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">System</h1>
            <p className="text-sm text-neutral-400">System information, configuration and management</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Information & Actions */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              System Information & Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ComponentLoader type="card" />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-300 mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Identity:</span>
                        <span className="text-white font-mono">{systemInfo.identity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Version:</span>
                        <span className="text-white font-mono">{systemInfo.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Uptime:</span>
                        <span className="text-green-400 font-mono">{systemInfo.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">CPU Load:</span>
                        <span className="text-blue-400 font-mono">{systemInfo.cpuLoad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Memory Usage:</span>
                        <span className="text-purple-400 font-mono">{systemInfo.memoryUsage}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-300 mb-3">Hardware Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Model:</span>
                        <span className="text-white font-mono">{systemInfo.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Serial Number:</span>
                        <span className="text-white font-mono">{systemInfo.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">MAC Address:</span>
                        <span className="text-white font-mono">{systemInfo.macAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Boot Time:</span>
                        <span className="text-white font-mono">{systemInfo.bootTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">License Status:</span>
                        <Badge className="bg-green-500/20 text-green-500">{systemInfo.licenseStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Actions */}
                <div className="pt-6 border-t border-neutral-700">
                  <h4 className="text-sm font-medium text-neutral-300 mb-4">System Actions</h4>
                  <div className="flex gap-4">
                    <Button onClick={handleReboot} className="bg-orange-500 hover:bg-orange-600 text-white">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reboot Router
                    </Button>
                    <Button onClick={handleShutdown} className="bg-red-500 hover:bg-red-600 text-white">
                      <Power className="w-4 h-4 mr-2" />
                      Shutdown Router
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 tracking-wider font-medium">CPU LOAD</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{systemInfo.cpuLoad}</p>
                </div>
                <Cpu className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 tracking-wider font-medium">MEMORY</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{systemInfo.memoryUsage}</p>
                </div>
                <HardDrive className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-400 tracking-wider font-medium">UPTIME</p>
                  <p className="text-lg font-bold text-white font-mono mt-1">15d 7h</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional System Information */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-500" />
              Detailed System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Software Information</h4>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Firmware Version:</span>
                  <span className="text-white font-mono">{systemInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Firmware Date:</span>
                  <span className="text-white font-mono">{systemInfo.firmwareDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Last Config Save:</span>
                  <span className="text-white font-mono">{systemInfo.lastConfigSave}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Network Information</h4>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Management IP:</span>
                  <span className="text-white font-mono">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">SNMP Status:</span>
                  <Badge className="bg-green-500/20 text-green-500">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">SSH Status:</span>
                  <Badge className="bg-green-500/20 text-green-500">Enabled</Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Performance Metrics</h4>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Active Sessions:</span>
                  <span className="text-white font-mono">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Interfaces:</span>
                  <span className="text-white font-mono">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Routing Entries:</span>
                  <span className="text-white font-mono">156</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
