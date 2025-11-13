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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { RouteForm } from "@/components/routing/RouteForm"
import { dummyRoutes } from "@/lib/dummy-data"
import { Route as RouteIcon, Search, RefreshCw, Plus, Edit, Trash2, Network, MapPin, Activity } from "lucide-react"
import { Route } from "@/lib/types"
import * as z from "zod"

export default function RoutingTablePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [routes, setRoutes] = useState<Route[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)

  useEffect(() => {
    refreshData()
  }, [])

  const statistics = useMemo(() => {
    return {
      totalRoutes: routes.length,
      activeRoutes: routes.filter(r => r.status === 'active').length,
      staticRoutes: routes.filter(r => r.protocol === 'Static').length,
      connectedRoutes: routes.filter(r => r.protocol === 'Connected').length,
      ospfRoutes: routes.filter(r => r.protocol === 'OSPF').length,
      ripRoutes: routes.filter(r => r.protocol === 'RIP').length,
    }
  }, [routes])

  const refreshData = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRoutes(dummyRoutes)
    setIsLoading(false)
  }

  const handleOpenDialog = (route: Route | null = null) => {
    setSelectedRoute(route)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedRoute(null)
  }

  const handleOpenAlert = (route: Route) => {
    setSelectedRoute(route)
    setIsAlertOpen(true)
  }

  const handleCloseAlert = () => {
    setIsAlertOpen(false)
    setSelectedRoute(null)
  }

  const handleSubmitRoute = (values: Pick<Route, "destination" | "gateway" | "interface" | "metric">) => {
    const newRoute: Route = {
      id: selectedRoute?.id || Date.now(),
      protocol: 'Static',
      type: values.destination === '0.0.0.0/0' ? 'Default' : 'Network',
      status: 'active',
      age: '0d 0h',
      ...values,
    }

    if (selectedRoute) {
      setRoutes(routes.map((r) => (r.id === newRoute.id ? newRoute : r)))
    } else {
      setRoutes([...routes, newRoute])
    }
    handleCloseDialog()
  }

  const handleDeleteRoute = () => {
    if (selectedRoute) {
      setRoutes(routes.filter((r) => r.id !== selectedRoute.id))
    }
    handleCloseAlert()
  }

  const getProtocolColor = (protocol: string) => {
    switch (protocol.toLowerCase()) {
      case "connected": return "bg-green-500/20 text-green-500"
      case "static": return "bg-blue-500/20 text-blue-500"
      case "ospf": return "bg-purple-500/20 text-purple-500"
      case "rip": return "bg-orange-500/20 text-orange-500"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const filteredRoutes = routes.filter(
    (route) =>
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.gateway.includes(searchTerm) ||
      route.interface.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.protocol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Routing Table</h1>
            <p className="text-sm text-muted-foreground">Network routing configuration and management</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
            <Button onClick={refreshData} disabled={isLoading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="p-4 text-center">
              <p className="text-2xl font-bold">{statistics.totalRoutes}</p>
              <p className="text-xs text-muted-foreground tracking-wider">Total Routes</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4 text-center">
              <p className="text-2xl font-bold">{statistics.activeRoutes}</p>
              <p className="text-xs text-muted-foreground tracking-wider">Active</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4 text-center">
              <p className="text-2xl font-bold">{statistics.connectedRoutes}</p>
              <p className="text-xs text-muted-foreground tracking-wider">Connected</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4 text-center">
              <p className="text-2xl font-bold">{statistics.staticRoutes}</p>
              <p className="text-xs text-muted-foreground tracking-wider">Static</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4 text-center">
              <p className="text-2xl font-bold">{statistics.ospfRoutes}</p>
              <p className="text-xs text-muted-foreground tracking-wider">OSPF</p>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="p-4 text-center">
              <p className="text-2xl font-bold">{statistics.ripRoutes}</p>
              <p className="text-xs text-muted-foreground tracking-wider">RIP</p>
            </CardHeader>
          </Card>
        </div>

        {/* Routing Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <RouteIcon className="w-5 h-5" />
                IP Routing Table
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search routes..."
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
                    <TableHead>Destination</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Interface</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="text-center h-24">Loading routes...</TableCell></TableRow>
                  ) : filteredRoutes.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center h-24">No routes found.</TableCell></TableRow>
                  ) : (
                    filteredRoutes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-mono">{route.destination}</TableCell>
                        <TableCell className="font-mono">{route.gateway}</TableCell>
                        <TableCell>{route.interface}</TableCell>
                        <TableCell className="font-mono">{route.metric}</TableCell>
                        <TableCell><Badge className={getProtocolColor(route.protocol)}>{route.protocol}</Badge></TableCell>
                        <TableCell><Badge variant={route.status === 'active' ? 'default' : 'outline'}>{route.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          {route.protocol === 'Static' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(route)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleOpenAlert(route)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Route Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRoute ? "Edit Static Route" : "Add New Static Route"}</DialogTitle>
            </DialogHeader>
            <RouteForm
              route={selectedRoute}
              onSubmit={handleSubmitRoute}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the static route.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseAlert}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteRoute}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
