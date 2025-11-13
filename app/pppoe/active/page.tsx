"use client"

import { useState, useEffect, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { dummyPppoeActiveConnections } from "@/lib/dummy-data"
import { Wifi, Search, RefreshCw, Users, Clock, Download, Upload, Trash2 } from "lucide-react"

type Connection = typeof dummyPppoeActiveConnections[0]

export default function PPPoEActivePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [connections, setConnections] = useState<Connection[]>([])
  const [connectionToDisconnect, setConnectionToDisconnect] = useState<Connection | null>(null)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setConnections(dummyPppoeActiveConnections)
    setIsLoading(false)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const filteredConnections = connections.filter(
    (conn) =>
      conn.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.ipAddress.includes(searchTerm) ||
      conn.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDisconnect = () => {
    if (connectionToDisconnect) {
      setConnections(connections.filter((c) => c.id !== connectionToDisconnect.id))
      setConnectionToDisconnect(null)
    }
  }

  const statistics = useMemo(() => {
    const totalRx = connections.reduce((acc, conn) => acc + conn.rxBytes, 0)
    const totalTx = connections.reduce((acc, conn) => acc + conn.txBytes, 0)
    return {
      totalConnections: connections.length,
      totalRxTraffic: formatBytes(totalRx),
      totalTxTraffic: formatBytes(totalTx),
    }
  }, [connections])

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">PPPoE Active Sessions</h1>
            <p className="text-sm text-muted-foreground">Monitor real-time PPPoE user sessions.</p>
          </div>
          <Button onClick={refreshData} disabled={isLoading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalConnections}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Download</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalRxTraffic}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Upload</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalTxTraffic}</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Connections Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5" />
                Active Sessions List
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Traffic (DL/UL)</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24">Loading sessions...</TableCell></TableRow>
                  ) : filteredConnections.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24">No active sessions found.</TableCell></TableRow>
                  ) : (
                    filteredConnections.map((conn) => (
                      <TableRow key={conn.id}>
                        <TableCell className="font-medium">{conn.username}</TableCell>
                        <TableCell className="font-mono">{conn.ipAddress}</TableCell>
                        <TableCell className="font-mono">{conn.macAddress}</TableCell>
                        <TableCell className="font-mono">{conn.uptime}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-green-600 dark:text-green-400 font-mono text-xs">↓ {formatBytes(conn.rxBytes)}</span>
                            <span className="text-orange-600 dark:text-orange-400 font-mono text-xs">↑ {formatBytes(conn.txBytes)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setConnectionToDisconnect(conn)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Disconnect Confirmation Dialog */}
        <AlertDialog open={!!connectionToDisconnect} onOpenChange={(open) => !open && setConnectionToDisconnect(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will disconnect the user session for <span className="font-bold">{connectionToDisconnect?.username}</span>. They will need to reconnect.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDisconnect}>Disconnect</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
