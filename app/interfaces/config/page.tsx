"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import {
  Settings,
  Network,
  Wifi,
  Router,
  Save,
  RefreshCw,
  AlertTriangle,
  Globe,
  Shield,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState } from "react"

interface InterfaceConfig {
  id: string
  name: string
  type: "ethernet" | "wireless" | "ppp"
  enabled: boolean
  ipAddress: string
  subnetMask: string
  gateway: string
  dns1: string
  dns2: string
  mtu: number
  duplex: "auto" | "full" | "half"
  speed: "auto" | "10" | "100" | "1000"
  description: string
  vlan: number
  security: {
    enabled: boolean
    method: string
    password: string
  }
  wireless?: {
    ssid: string
    channel: number
    power: number
    mode: string
    hidden: boolean
  }
}

export default function InterfaceConfigPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInterface, setSelectedInterface] = useState("eth0")
  const [showPassword, setShowPassword] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [interfaces, setInterfaces] = useState<InterfaceConfig[]>([
    {
      id: "eth0",
      name: "GigabitEthernet0/0/1",
      type: "ethernet",
      enabled: true,
      ipAddress: "192.168.1.1",
      subnetMask: "255.255.255.0",
      gateway: "192.168.1.254",
      dns1: "8.8.8.8",
      dns2: "8.8.4.4",
      mtu: 1500,
      duplex: "auto",
      speed: "auto",
      description: "WAN Interface - Internet Connection",
      vlan: 0,
      security: {
        enabled: false,
        method: "none",
        password: "",
      },
    },
    {
      id: "eth1",
      name: "GigabitEthernet0/0/2",
      type: "ethernet",
      enabled: true,
      ipAddress: "10.0.0.1",
      subnetMask: "255.255.255.0",
      gateway: "",
      dns1: "",
      dns2: "",
      mtu: 1500,
      duplex: "full",
      speed: "1000",
      description: "LAN Interface - Local Network",
      vlan: 0,
      security: {
        enabled: false,
        method: "none",
        password: "",
      },
    },
    {
      id: "wlan0",
      name: "WLAN 2.4GHz",
      type: "wireless",
      enabled: true,
      ipAddress: "192.168.2.1",
      subnetMask: "255.255.255.0",
      gateway: "",
      dns1: "",
      dns2: "",
      mtu: 1500,
      duplex: "half",
      speed: "auto",
      description: "Wireless 2.4GHz Interface",
      vlan: 0,
      security: {
        enabled: true,
        method: "WPA2-PSK",
        password: "huapau2024",
      },
      wireless: {
        ssid: "HuaPau-2.4G",
        channel: 6,
        power: 20,
        mode: "802.11n",
        hidden: false,
      },
    },
    {
      id: "wlan1",
      name: "WLAN 5GHz",
      type: "wireless",
      enabled: true,
      ipAddress: "192.168.5.1",
      subnetMask: "255.255.255.0",
      gateway: "",
      dns1: "",
      dns2: "",
      mtu: 1500,
      duplex: "half",
      speed: "auto",
      description: "Wireless 5GHz Interface",
      vlan: 0,
      security: {
        enabled: true,
        method: "WPA3-SAE",
        password: "huapau2024",
      },
      wireless: {
        ssid: "HuaPau-5G",
        channel: 36,
        power: 23,
        mode: "802.11ac",
        hidden: false,
      },
    },
  ])

  const currentInterface = interfaces.find((iface) => iface.id === selectedInterface)

  const updateInterface = (updates: Partial<InterfaceConfig>) => {
    setInterfaces((prev) => prev.map((iface) => (iface.id === selectedInterface ? { ...iface, ...updates } : iface)))
    setHasChanges(true)
  }

  const saveConfiguration = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setHasChanges(false)
      // Here you would typically send the configuration to the API
      console.log("Configuration saved:", currentInterface)
    } catch (error) {
      console.error("Failed to save configuration:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetConfiguration = () => {
    // Reset to original values
    setHasChanges(false)
  }

  const getInterfaceIcon = (type: string) => {
    switch (type) {
      case "wireless":
        return <Wifi className="w-4 h-4" />
      case "ethernet":
        return <Router className="w-4 h-4" />
      case "ppp":
        return <Globe className="w-4 h-4" />
      default:
        return <Network className="w-4 h-4" />
    }
  }

  if (!currentInterface) {
    return <ComponentLoader type="page" />
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Interface Configuration</h1>
            <p className="text-sm text-neutral-400">Configure network interface settings and parameters</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={resetConfiguration}
              variant="outline"
              disabled={!hasChanges}
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-800 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={saveConfiguration}
              disabled={isLoading || !hasChanges}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Save className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Interface Selection */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-500" />
              Select Interface
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {interfaces.map((iface) => (
                <button
                  key={iface.id}
                  onClick={() => setSelectedInterface(iface.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedInterface === iface.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-neutral-600 bg-neutral-800 hover:border-neutral-500"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getInterfaceIcon(iface.type)}
                    <span className="text-white font-medium">{iface.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={iface.enabled ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}>
                      {iface.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <span className="text-xs text-neutral-400">{iface.ipAddress}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Tabs */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-neutral-800 border-neutral-700">
            <TabsTrigger value="basic" className="data-[state=active]:bg-orange-500">
              Basic Settings
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-orange-500">
              Advanced
            </TabsTrigger>
            {currentInterface.type === "wireless" && (
              <TabsTrigger value="wireless" className="data-[state=active]:bg-orange-500">
                Wireless
              </TabsTrigger>
            )}
            <TabsTrigger value="security" className="data-[state=active]:bg-orange-500">
              Security
            </TabsTrigger>
          </TabsList>

          {/* Basic Settings Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    {getInterfaceIcon(currentInterface.type)}
                    {currentInterface.name} - Basic Configuration
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={currentInterface.enabled}
                      onCheckedChange={(enabled) => updateInterface({ enabled })}
                    />
                    <Label className="text-sm text-neutral-300">Interface Enabled</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-neutral-300">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={currentInterface.description}
                        onChange={(e) => updateInterface({ description: e.target.value })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        placeholder="Interface description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ipAddress" className="text-sm font-medium text-neutral-300">
                        IP Address
                      </Label>
                      <Input
                        id="ipAddress"
                        value={currentInterface.ipAddress}
                        onChange={(e) => updateInterface({ ipAddress: e.target.value })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        placeholder="192.168.1.1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subnetMask" className="text-sm font-medium text-neutral-300">
                        Subnet Mask
                      </Label>
                      <Input
                        id="subnetMask"
                        value={currentInterface.subnetMask}
                        onChange={(e) => updateInterface({ subnetMask: e.target.value })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        placeholder="255.255.255.0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gateway" className="text-sm font-medium text-neutral-300">
                        Gateway
                      </Label>
                      <Input
                        id="gateway"
                        value={currentInterface.gateway}
                        onChange={(e) => updateInterface({ gateway: e.target.value })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        placeholder="192.168.1.254"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dns1" className="text-sm font-medium text-neutral-300">
                        Primary DNS
                      </Label>
                      <Input
                        id="dns1"
                        value={currentInterface.dns1}
                        onChange={(e) => updateInterface({ dns1: e.target.value })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        placeholder="8.8.8.8"
                      />
                    </div>

                    <div>
                      <Label htmlFor="dns2" className="text-sm font-medium text-neutral-300">
                        Secondary DNS
                      </Label>
                      <Input
                        id="dns2"
                        value={currentInterface.dns2}
                        onChange={(e) => updateInterface({ dns2: e.target.value })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        placeholder="8.8.4.4"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mtu" className="text-sm font-medium text-neutral-300">
                        MTU Size
                      </Label>
                      <Input
                        id="mtu"
                        type="number"
                        value={currentInterface.mtu}
                        onChange={(e) => updateInterface({ mtu: Number.parseInt(e.target.value) })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        min="576"
                        max="9000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vlan" className="text-sm font-medium text-neutral-300">
                        VLAN ID
                      </Label>
                      <Input
                        id="vlan"
                        type="number"
                        value={currentInterface.vlan}
                        onChange={(e) => updateInterface({ vlan: Number.parseInt(e.target.value) })}
                        className="bg-neutral-800 border-neutral-600 text-white"
                        min="0"
                        max="4094"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Advanced Interface Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="speed" className="text-sm font-medium text-neutral-300">
                        Speed
                      </Label>
                      <Select
                        value={currentInterface.speed}
                        onValueChange={(speed) => updateInterface({ speed: speed as any })}
                      >
                        <SelectTrigger className="bg-neutral-800 border-neutral-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto Negotiate</SelectItem>
                          <SelectItem value="10">10 Mbps</SelectItem>
                          <SelectItem value="100">100 Mbps</SelectItem>
                          <SelectItem value="1000">1000 Mbps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="duplex" className="text-sm font-medium text-neutral-300">
                        Duplex Mode
                      </Label>
                      <Select
                        value={currentInterface.duplex}
                        onValueChange={(duplex) => updateInterface({ duplex: duplex as any })}
                      >
                        <SelectTrigger className="bg-neutral-800 border-neutral-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto Negotiate</SelectItem>
                          <SelectItem value="full">Full Duplex</SelectItem>
                          <SelectItem value="half">Half Duplex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-800 rounded-lg">
                      <h4 className="text-sm font-medium text-neutral-300 mb-3">Interface Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Status:</span>
                          <Badge
                            className={
                              currentInterface.enabled ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                            }
                          >
                            {currentInterface.enabled ? "UP" : "DOWN"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Type:</span>
                          <span className="text-white capitalize">{currentInterface.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Current Speed:</span>
                          <span className="text-white">
                            {currentInterface.speed === "auto" ? "Auto" : `${currentInterface.speed} Mbps`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Duplex:</span>
                          <span className="text-white capitalize">{currentInterface.duplex}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wireless Settings Tab */}
          {currentInterface.type === "wireless" && currentInterface.wireless && (
            <TabsContent value="wireless" className="space-y-6">
              <Card className="bg-neutral-900 border-neutral-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-orange-500" />
                    Wireless Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ssid" className="text-sm font-medium text-neutral-300">
                          SSID (Network Name)
                        </Label>
                        <Input
                          id="ssid"
                          value={currentInterface.wireless.ssid}
                          onChange={(e) =>
                            updateInterface({
                              wireless: { ...currentInterface.wireless!, ssid: e.target.value },
                            })
                          }
                          className="bg-neutral-800 border-neutral-600 text-white"
                          placeholder="Network Name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="channel" className="text-sm font-medium text-neutral-300">
                          Channel
                        </Label>
                        <Select
                          value={currentInterface.wireless.channel.toString()}
                          onValueChange={(channel) =>
                            updateInterface({
                              wireless: { ...currentInterface.wireless!, channel: Number.parseInt(channel) },
                            })
                          }
                        >
                          <SelectTrigger className="bg-neutral-800 border-neutral-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currentInterface.name.includes("2.4") ? (
                              <>
                                <SelectItem value="1">Channel 1 (2412 MHz)</SelectItem>
                                <SelectItem value="6">Channel 6 (2437 MHz)</SelectItem>
                                <SelectItem value="11">Channel 11 (2462 MHz)</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="36">Channel 36 (5180 MHz)</SelectItem>
                                <SelectItem value="40">Channel 40 (5200 MHz)</SelectItem>
                                <SelectItem value="44">Channel 44 (5220 MHz)</SelectItem>
                                <SelectItem value="48">Channel 48 (5240 MHz)</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="power" className="text-sm font-medium text-neutral-300">
                          Transmit Power (dBm)
                        </Label>
                        <Input
                          id="power"
                          type="number"
                          value={currentInterface.wireless.power}
                          onChange={(e) =>
                            updateInterface({
                              wireless: { ...currentInterface.wireless!, power: Number.parseInt(e.target.value) },
                            })
                          }
                          className="bg-neutral-800 border-neutral-600 text-white"
                          min="1"
                          max="30"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mode" className="text-sm font-medium text-neutral-300">
                          Wireless Mode
                        </Label>
                        <Select
                          value={currentInterface.wireless.mode}
                          onValueChange={(mode) =>
                            updateInterface({
                              wireless: { ...currentInterface.wireless!, mode },
                            })
                          }
                        >
                          <SelectTrigger className="bg-neutral-800 border-neutral-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="802.11n">802.11n</SelectItem>
                            <SelectItem value="802.11ac">802.11ac</SelectItem>
                            <SelectItem value="802.11ax">802.11ax (Wi-Fi 6)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="hidden" className="text-sm font-medium text-neutral-300">
                          Hidden Network
                        </Label>
                        <Switch
                          id="hidden"
                          checked={currentInterface.wireless.hidden}
                          onCheckedChange={(hidden) =>
                            updateInterface({
                              wireless: { ...currentInterface.wireless!, hidden },
                            })
                          }
                        />
                      </div>

                      <div className="p-4 bg-neutral-800 rounded-lg">
                        <h4 className="text-sm font-medium text-neutral-300 mb-3">Wireless Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">SSID:</span>
                            <span className="text-white">{currentInterface.wireless.ssid}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Channel:</span>
                            <span className="text-white">{currentInterface.wireless.channel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Power:</span>
                            <span className="text-white">{currentInterface.wireless.power} dBm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Mode:</span>
                            <span className="text-white">{currentInterface.wireless.mode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500" />
                  Security Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-300">Enable Security</h4>
                    <p className="text-xs text-neutral-400">Enable security features for this interface</p>
                  </div>
                  <Switch
                    checked={currentInterface.security.enabled}
                    onCheckedChange={(enabled) =>
                      updateInterface({
                        security: { ...currentInterface.security, enabled },
                      })
                    }
                  />
                </div>

                {currentInterface.security.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="securityMethod" className="text-sm font-medium text-neutral-300">
                        Security Method
                      </Label>
                      <Select
                        value={currentInterface.security.method}
                        onValueChange={(method) =>
                          updateInterface({
                            security: { ...currentInterface.security, method },
                          })
                        }
                      >
                        <SelectTrigger className="bg-neutral-800 border-neutral-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="WPA-PSK">WPA-PSK</SelectItem>
                          <SelectItem value="WPA2-PSK">WPA2-PSK</SelectItem>
                          <SelectItem value="WPA3-SAE">WPA3-SAE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentInterface.security.method !== "none" && (
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-neutral-300">
                          Password/Passphrase
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={currentInterface.security.password}
                            onChange={(e) =>
                              updateInterface({
                                security: { ...currentInterface.security, password: e.target.value },
                              })
                            }
                            className="bg-neutral-800 border-neutral-600 text-white pr-10"
                            placeholder="Enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-500">Security Notice</h4>
                          <p className="text-xs text-yellow-400 mt-1">
                            Changing security settings may disconnect existing clients. Make sure to update all
                            connected devices with the new credentials.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Confirmation */}
        {hasChanges && (
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-500">Unsaved Changes</h4>
                    <p className="text-xs text-orange-400">You have unsaved configuration changes.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={resetConfiguration}
                    variant="outline"
                    size="sm"
                    className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 bg-transparent"
                  >
                    Discard
                  </Button>
                  <Button onClick={saveConfiguration} size="sm" className="bg-orange-500 hover:bg-orange-600">
                    Save Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
