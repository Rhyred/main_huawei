"use client"

import { useState, useEffect, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, FileText, Activity, BarChart2 } from "lucide-react"
import { dummyPppoeProfiles, dummyPppoeSecrets, dummyPppoeActiveConnections } from "@/lib/dummy-data"
import { PppoeProfile, PppoeSecret } from "@/lib/types"

export default function PPPoEStatsPage() {
    const [profiles, setProfiles] = useState<PppoeProfile[]>([])
    const [secrets, setSecrets] = useState<PppoeSecret[]>([])
    const [activeConnections, setActiveConnections] = useState(dummyPppoeActiveConnections)

    useEffect(() => {
        setProfiles(dummyPppoeProfiles)
        setSecrets(dummyPppoeSecrets)
    }, [])

    const stats = useMemo(() => {
        const usersPerProfile = profiles.map(profile => ({
            name: profile.name,
            users: secrets.filter(secret => secret.profile === profile.name).length,
        }))

        const totalTraffic = activeConnections.reduce((acc, conn) => acc + conn.rxBytes + conn.txBytes, 0)

        return {
            totalProfiles: profiles.length,
            totalSecrets: secrets.length,
            activeSessions: activeConnections.length,
            totalTraffic: totalTraffic,
            usersPerProfile,
        }
    }, [profiles, secrets, activeConnections])

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 B"
        const k = 1024
        const sizes = ["B", "KB", "MB", "GB", "TB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }

    const sessionHistoryData = [
        { time: "24h ago", sessions: 12 },
        { time: "18h ago", sessions: 15 },
        { time: "12h ago", sessions: 25 },
        { time: "6h ago", sessions: 22 },
        { time: "Now", sessions: stats.activeSessions },
    ]

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">PPPoE Statistics</h1>
                    <p className="text-sm text-muted-foreground">Overview and statistical analysis of the PPPoE service.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProfiles}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Secrets</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSecrets}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeSessions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Traffic (Active)</CardTitle>
                            <BarChart2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatBytes(stats.totalTraffic)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users per Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 w-full">
                                <ResponsiveContainer>
                                    <BarChart data={stats.usersPerProfile}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="name" className="text-xs" />
                                        <YAxis allowDecimals={false} className="text-xs" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--background))",
                                                borderColor: "hsl(var(--border))",
                                            }}
                                        />
                                        <Bar dataKey="users" fill="hsl(var(--primary))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Session History (Last 24h)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80 w-full">
                                <ResponsiveContainer>
                                    <LineChart data={sessionHistoryData}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="time" className="text-xs" />
                                        <YAxis allowDecimals={false} className="text-xs" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--background))",
                                                borderColor: "hsl(var(--border))",
                                            }}
                                        />
                                        <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
