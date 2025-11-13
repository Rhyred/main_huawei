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
import { dummyRoutes } from "@/lib/dummy-data"
import { Route, Search, RefreshCw, GitBranch } from "lucide-react"

type RouteType = typeof dummyRoutes[0]

export default function DynamicRoutesPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [routes, setRoutes] = useState<RouteType[]>([])

    useEffect(() => {
        refreshData()
    }, [])

    const refreshData = async () => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 500))
        setRoutes(dummyRoutes.filter(r => r.protocol !== 'Static' && r.protocol !== 'Connected'))
        setIsLoading(false)
    }

    const getProtocolColor = (protocol: string) => {
        switch (protocol.toLowerCase()) {
            case "ospf": return "bg-purple-500/20 text-purple-500"
            case "rip": return "bg-orange-500/20 text-orange-500"
            case "bgp": return "bg-pink-500/20 text-pink-500"
            default: return "bg-muted text-muted-foreground"
        }
    }

    const filteredRoutes = routes.filter(
        (route) =>
            route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.gateway.includes(searchTerm) ||
            route.interface.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.protocol.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Dynamic Routes</h1>
                        <p className="text-sm text-muted-foreground">Routes learned from dynamic routing protocols like OSPF and RIP.</p>
                    </div>
                    <Button onClick={refreshData} disabled={isLoading} variant="outline">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>

                {/* Dynamic Routes Table */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="w-5 h-5" />
                                Learned Routes
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
                                        <TableHead>Age</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={6} className="text-center h-24">Loading routes...</TableCell></TableRow>
                                    ) : filteredRoutes.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center h-24">No dynamic routes found.</TableCell></TableRow>
                                    ) : (
                                        filteredRoutes.map((route) => (
                                            <TableRow key={route.id}>
                                                <TableCell className="font-mono">{route.destination}</TableCell>
                                                <TableCell className="font-mono">{route.gateway}</TableCell>
                                                <TableCell>{route.interface}</TableCell>
                                                <TableCell className="font-mono">{route.metric}</TableCell>
                                                <TableCell><Badge className={getProtocolColor(route.protocol)}>{route.protocol}</Badge></TableCell>
                                                <TableCell className="font-mono text-sm text-muted-foreground">{route.age}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
