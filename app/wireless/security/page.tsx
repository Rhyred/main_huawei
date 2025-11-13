"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentLoader } from "@/components/common/ComponentLoader"
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  Users,
  Activity,
} from "lucide-react"
import { useState, useEffect } from "react"

interface WirelessSecurityProfile {
  id: string
  name: string
  ssid: string
  band: "2.4GHz" | "5GHz"
  securityType: "Open" | "WEP" | "WPA" | "WPA2" | "WPA3" | "WPA2/WPA3"
  encryption: "None" | "TKIP" | "AES" | "TKIP/AES"
  authMethod: "PSK" | "Enterprise" | "SAE" | "OWE"
  passphrase?: string
  keyRotation: number
  pmfRequired: boolean
  pmfCapable: boolean
  hiddenSSID: boolean
  macFiltering: boolean
  maxClients: number
  clientIsolation: boolean
  bandSteering: boolean
  fastRoaming: boolean
  status: "active" | "inactive"
  connectedClients: number
  lastModified: string
  securityScore: number
}

interface SecurityEvent {
  id: number
  timestamp: string
  ssid: string
  eventType: "auth_failure" | "deauth" | "intrusion" | "weak_signal" | "suspicious_activity"
  clientMac: string
  clientIP?: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  action: "logged" | "blocked" | "monitored"
}

export default function WirelessSecurityPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<string>("all")
  const [showPasswords, setShowPasswords] = useState(false)
  const [securityProfiles, setSecurityProfiles] = useState<WirelessSecurityProfile[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])

  // Initialize data
  useEffect(() => {
    const profiles: WirelessSecurityProfile[] = [
      {
        id: "wlan0",
        name: "Main Network 2.4GHz",
        ssid: "HuaweiNet-2.4G",
        band: "2.4GHz",
        securityType: "WPA2/WPA3",
        encryption: "AES",
        authMethod: "PSK",
        passphrase: "SecurePassword123!",
        keyRotation: 3600,
        pmfRequired: true,
        pmfCapable: true,
        hiddenSSID: false,
        macFiltering: true,
        maxClients: 50,
        clientIsolation: false,
        bandSteering: true,
        fastRoaming: true,
        status: "active",
        connectedClients: 12,
        lastModified: "2024-01-30 14:23:45",
        securityScore: 95,
      },
      {
        id: "wlan1",
        name: "Main Network 5GHz",
        ssid: "HuaweiNet-5G",
        band: "5GHz",
        securityType: "WPA3",
        encryption: "AES",
        authMethod: "SAE",
        passphrase: "SecurePassword123!",
        keyRotation: 3600,
        pmfRequired: true,
        pmfCapable: true,
        hiddenSSID: false,
        macFiltering: true,
        maxClients: 100,
        clientIsolation: false,
        bandSteering: true,
        fastRoaming: true,
        status: "active",
        connectedClients: 8,
        lastModified: "2024-01-30 14:23:45",
        securityScore: 98,
      },
      {
        id: "guest",
        name: "Guest Network",
        ssid: "HuaweiNet-Guest",
        band: "2.4GHz",
        securityType: "WPA2",
        encryption: "AES",
        authMethod: "PSK",
        passphrase: "GuestPass2024",
        keyRotation: 1800,
        pmfRequired: false,
        pmfCapable: true,
        hiddenSSID: false,
        macFiltering: false,
        maxClients: 20,
        clientIsolation: true,
        bandSteering: false,
        fastRoaming: false,
        status: "active",
        connectedClients: 4,
        lastModified: "2024-01-30 12:15:30",
        securityScore: 78,
      },
    ]

    const events: SecurityEvent[] = [
      {
        id: 1,
        timestamp: "2024-01-30 15:23:45",
        ssid: "HuaweiNet-2.4G",
        eventType: "auth_failure",
        clientMac: "aa:bb:cc:dd:ee:01",
        clientIP: "192.168.1.100",
        severity: "medium",
        description: "Multiple authentication failures from client",
        action: "blocked",
      },
      {
        id: 2,
        timestamp: "2024-01-30 15:18:12",
        ssid: "HuaweiNet-5G",
        eventType: "intrusion",
        clientMac: "bb:cc:dd:ee:ff:02",
        severity: "high",
        description: "Unauthorized access attempt detected",
        action: "blocked",
      },
      {
        id: 3,
        timestamp: "2024-01-30 15:15:33",
        ssid: "HuaweiNet-Guest",
        eventType: "suspicious_activity",
        clientMac: "cc:dd:ee:ff:aa:03",
        clientIP: "192.168.2.150",
        severity: "low",
        description: "Unusual traffic pattern detected",
        action: "monitored",
      },
    ]

    setSecurityProfiles(profiles)
    setSecurityEvents(events)
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getSecurityIcon = (securityType: string) => {
    if (securityType === "Open") return <Unlock className="w-4 h-4 text-red-500" />
    if (securityType.includes("WPA3")) return <Shield className="w-4 h-4 text-green-500" />
    if (securityType.includes("WPA2")) return <Lock className="w-4 h-4 text-blue-500" />
    return <Key className="w-4 h-4 text-yellow-500" />
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-500"
      case "high":
        return "bg-orange-500/20 text-orange-500"
      case "medium":
        return "bg-yellow-500/20 text-yellow-500"
      case "low":
        return "bg-blue-500/20 text-blue-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const filteredProfiles =
    selectedProfile === "all"
      ? securityProfiles
      : securityProfiles.filter((profile) => profile.band === selectedProfile)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">Wireless Security</h1>
            <p className="text-sm text-neutral-400">Manage wireless network security settings and monitor threats</p>
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

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-400 tracking-wider font-medium">SECURE NETWORKS</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {securityProfiles.filter((p) => p.securityType !== "Open").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-400 tracking-wider font-medium">AVG SECURITY SCORE</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {Math.round(
                      securityProfiles.reduce((acc, p) => acc + p.securityScore, 0) / securityProfiles.length,
                    )}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-400 tracking-wider font-medium">SECURITY EVENTS</p>
                  <p className="text-2xl font-bold text-white font-mono">{securityEvents.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-400 tracking-wider font-medium">CONNECTED CLIENTS</p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {securityProfiles.reduce((acc, p) => acc + p.connectedClients, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles">Security Profiles</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="settings">Global Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            {/* Band Filter */}
            <div className="flex gap-4 items-center">
              <Label htmlFor="band-filter" className="text-sm text-neutral-300">
                Filter by Band:
              </Label>
              <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bands</SelectItem>
                  <SelectItem value="2.4GHz">2.4GHz</SelectItem>
                  <SelectItem value="5GHz">5GHz</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setShowPasswords(!showPasswords)} className="ml-auto">
                {showPasswords ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPasswords ? "Hide" : "Show"} Passwords
              </Button>
            </div>

            {/* Security Profiles */}
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <ComponentLoader key={i} type="card" />)
                : filteredProfiles.map((profile) => (
                    <Card key={profile.id} className="bg-neutral-900 border-neutral-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Wifi className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-white flex items-center gap-2">
                                {profile.name}
                                <Badge className="bg-blue-500/20 text-blue-400">{profile.band}</Badge>
                              </CardTitle>
                              <p className="text-sm text-neutral-400">SSID: {profile.ssid}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm text-neutral-400">Security Score</p>
                              <p
                                className={`text-2xl font-bold font-mono ${getSecurityScoreColor(profile.securityScore)}`}
                              >
                                {profile.securityScore}
                              </p>
                            </div>
                            <Badge
                              className={
                                profile.status === "active"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              }
                            >
                              {profile.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Security Configuration */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                              {getSecurityIcon(profile.securityType)}
                              Security Configuration
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Security Type:</span>
                                <span className="text-white font-mono">{profile.securityType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Encryption:</span>
                                <span className="text-white font-mono">{profile.encryption}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Auth Method:</span>
                                <span className="text-white font-mono">{profile.authMethod}</span>
                              </div>
                              {profile.passphrase && (
                                <div className="flex justify-between">
                                  <span className="text-neutral-400">Passphrase:</span>
                                  <span className="text-white font-mono">
                                    {showPasswords ? profile.passphrase : "••••••••••••"}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Key Rotation:</span>
                                <span className="text-white font-mono">{profile.keyRotation}s</span>
                              </div>
                            </div>
                          </div>

                          {/* Advanced Security */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-neutral-300">Advanced Security</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">PMF Required:</span>
                                {profile.pmfRequired ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">PMF Capable:</span>
                                {profile.pmfCapable ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Hidden SSID:</span>
                                {profile.hiddenSSID ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-neutral-500" />
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">MAC Filtering:</span>
                                {profile.macFiltering ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-neutral-500" />
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Client Isolation:</span>
                                {profile.clientIsolation ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-neutral-500" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Network Status */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-neutral-300">Network Status</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Connected Clients:</span>
                                <span className="text-white font-mono">
                                  {profile.connectedClients}/{profile.maxClients}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Band Steering:</span>
                                {profile.bandSteering ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-neutral-500" />
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-neutral-400">Fast Roaming:</span>
                                {profile.fastRoaming ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-neutral-500" />
                                )}
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Last Modified:</span>
                                <span className="text-white font-mono text-xs">{profile.lastModified}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-6 pt-4 border-t border-neutral-700">
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <Key className="w-4 h-4 mr-2" />
                            Change Password
                          </Button>
                          <Button variant="outline" size="sm">
                            <Users className="w-4 h-4 mr-2" />
                            View Clients
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Security Log
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Security Events Log */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ComponentLoader type="table" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-700">
                          <th className="text-left p-3 text-neutral-400 font-medium">Timestamp</th>
                          <th className="text-left p-3 text-neutral-400 font-medium">SSID</th>
                          <th className="text-left p-3 text-neutral-400 font-medium">Event Type</th>
                          <th className="text-left p-3 text-neutral-400 font-medium">Client MAC</th>
                          <th className="text-left p-3 text-neutral-400 font-medium">Severity</th>
                          <th className="text-left p-3 text-neutral-400 font-medium">Description</th>
                          <th className="text-left p-3 text-neutral-400 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {securityEvents.map((event) => (
                          <tr key={event.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                            <td className="p-3 text-white font-mono text-xs">{event.timestamp}</td>
                            <td className="p-3 text-white font-mono">{event.ssid}</td>
                            <td className="p-3 text-white">{event.eventType.replace("_", " ")}</td>
                            <td className="p-3 text-white font-mono">{event.clientMac}</td>
                            <td className="p-3">
                              <Badge className={getSeverityColor(event.severity)}>{event.severity.toUpperCase()}</Badge>
                            </td>
                            <td className="p-3 text-white">{event.description}</td>
                            <td className="p-3">
                              <Badge
                                className={
                                  event.action === "blocked"
                                    ? "bg-red-500/20 text-red-500"
                                    : event.action === "monitored"
                                      ? "bg-yellow-500/20 text-yellow-500"
                                      : "bg-blue-500/20 text-blue-500"
                                }
                              >
                                {event.action.toUpperCase()}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Global Security Settings */}
            <Card className="bg-neutral-900 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Global Security Settings</CardTitle>
                <p className="text-sm text-neutral-400">Configure system-wide wireless security policies</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="default-security" className="text-sm text-neutral-300">
                        Default Security Type
                      </Label>
                      <Select defaultValue="WPA2/WPA3">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA3">WPA3 Only</SelectItem>
                          <SelectItem value="WPA2/WPA3">WPA2/WPA3 Mixed</SelectItem>
                          <SelectItem value="WPA2">WPA2 Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="key-rotation" className="text-sm text-neutral-300">
                        Default Key Rotation (seconds)
                      </Label>
                      <Input id="key-rotation" type="number" defaultValue="3600" />
                    </div>

                    <div>
                      <Label htmlFor="max-auth-failures" className="text-sm text-neutral-300">
                        Max Authentication Failures
                      </Label>
                      <Input id="max-auth-failures" type="number" defaultValue="5" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="intrusion-detection" className="text-sm text-neutral-300">
                        Intrusion Detection
                      </Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                          <SelectItem value="monitor-only">Monitor Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="rogue-ap-detection" className="text-sm text-neutral-300">
                        Rogue AP Detection
                      </Label>
                      <Select defaultValue="enabled">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="event-logging" className="text-sm text-neutral-300">
                        Security Event Logging
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Events</SelectItem>
                          <SelectItem value="critical">Critical Only</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-neutral-700">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Apply Settings
                  </Button>
                  <Button variant="outline">Reset to Defaults</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
