"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Router, Wifi, User, Lock, Eye, EyeOff, Network } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    ipAddress: "192.168.1.1",
    snmpPort: "161",
    community: "public",
    username: "admin",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionMethod, setConnectionMethod] = useState("snmp") // snmp or web
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate SNMP connection
      const response = await fetch("/api/auth/huawei", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...credentials,
          method: connectionMethod,
        }),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("routerInfo", JSON.stringify(result.routerInfo))
        router.push("/")
      } else {
        alert(result.message || "Connection failed")
      }
    } catch (error) {
      alert("Network error. Please check your connection.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Router className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-wide">HuaPau</h1>
            <p className="text-slate-600 text-sm mt-2">Connect to your Huawei router to continue</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Connection Method Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setConnectionMethod("snmp")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${connectionMethod === "snmp"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                    }`}
                >
                  <Network className="w-4 h-4 inline mr-2" />
                  SNMP
                </button>
                <button
                  type="button"
                  onClick={() => setConnectionMethod("web")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${connectionMethod === "web"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                    }`}
                >
                  <Wifi className="w-4 h-4 inline mr-2" />
                  Web API
                </button>
              </div>

              {/* IP Address */}
              <div>
                <Label htmlFor="ipAddress" className="text-slate-700 text-sm font-medium flex items-center gap-2 mb-2">
                  <Router className="w-4 h-4 text-orange-500" />
                  IP Address
                </Label>
                <Input
                  id="ipAddress"
                  type="text"
                  value={credentials.ipAddress}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, ipAddress: e.target.value }))}
                  className="h-12 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="192.168.1.1"
                  required
                />
              </div>

              {/* Port */}
              <div>
                <Label htmlFor="port" className="text-slate-700 text-sm font-medium flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-blue-500" />
                  {connectionMethod === "snmp" ? "SNMP Port" : "HTTP Port"}
                </Label>
                <Input
                  id="port"
                  type="text"
                  value={connectionMethod === "snmp" ? credentials.snmpPort : "80"}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      [connectionMethod === "snmp" ? "snmpPort" : "httpPort"]: e.target.value,
                    }))
                  }
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={connectionMethod === "snmp" ? "161" : "80"}
                  required
                />
              </div>

              {/* SNMP Community (only for SNMP) */}
              {connectionMethod === "snmp" && (
                <div>
                  <Label
                    htmlFor="community"
                    className="text-slate-700 text-sm font-medium flex items-center gap-2 mb-2"
                  >
                    <Lock className="w-4 h-4 text-green-500" />
                    SNMP Community
                  </Label>
                  <Input
                    id="community"
                    type="text"
                    value={credentials.community}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, community: e.target.value }))}
                    className="h-12 border-slate-300 focus:border-green-500 focus:ring-green-500"
                    placeholder="public"
                    required
                  />
                </div>
              )}

              {/* Username (only for Web API) */}
              {connectionMethod === "web" && (
                <div>
                  <Label htmlFor="username" className="text-slate-700 text-sm font-medium flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-purple-500" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    className="h-12 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="admin"
                    required
                  />
                </div>
              )}

              {/* Password (only for Web API) */}
              {connectionMethod === "web" && (
                <div>
                  <Label htmlFor="password" className="text-slate-700 text-sm font-medium flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-red-500" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      className="h-12 border-slate-300 focus:border-red-500 focus:ring-red-500 pr-12"
                      placeholder="Enter password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-12 px-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Connect Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-base mt-6 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </div>
                ) : (
                  "Connect"
                )}
              </Button>
            </form>

            {/* Help Link */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-sm">
                Need help?{" "}
                <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">
                  Contact support
                </a>
              </p>
            </div>

            {/* Connection Info */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Connection Methods:</h3>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Network className="w-3 h-3" />
                  <span>
                    <strong>SNMP:</strong> Read-only monitoring (Port 161)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3" />
                  <span>
                    <strong>Web API:</strong> Full management access
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
