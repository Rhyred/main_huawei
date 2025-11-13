"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, ArrowDown, ArrowUp, Download, Upload } from "lucide-react"

// Helper to generate dynamic data
const generateDataPoint = (lastValue: number) => {
    const newValue = lastValue + (Math.random() - 0.5) * 10
    return Math.max(5, Math.min(95, newValue))
}

export default function BandwidthMonitoringPage() {
    const [data, setData] = useState(() => {
        const initialData = []
        let lastDownload = 50
        let lastUpload = 20
        for (let i = 0; i < 30; i++) {
            lastDownload = generateDataPoint(lastDownload)
            lastUpload = generateDataPoint(lastUpload)
            initialData.push({
                time: new Date(Date.now() - (30 - i) * 2000).toLocaleTimeString(),
                download: lastDownload,
                upload: lastUpload,
            })
        }
        return initialData
    })

    const [selectedInterface, setSelectedInterface] = useState("eth0")

    useEffect(() => {
        const interval = setInterval(() => {
            setData((currentData) => {
                const lastDataPoint = currentData[currentData.length - 1]
                const newDownload = generateDataPoint(lastDataPoint.download)
                const newUpload = generateDataPoint(lastDataPoint.upload)
                const newDataPoint = {
                    time: new Date().toLocaleTimeString(),
                    download: newDownload,
                    upload: newUpload,
                }
                return [...currentData.slice(1), newDataPoint]
            })
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    const peakDownload = Math.max(...data.map((d) => d.download))
    const peakUpload = Math.max(...data.map((d) => d.upload))
    const avgDownload = data.reduce((acc, d) => acc + d.download, 0) / data.length
    const avgUpload = data.reduce((acc, d) => acc + d.upload, 0) / data.length

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">Bandwidth Monitor</h1>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Real-time bandwidth monitoring for network interfaces.
                    </p>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <div>
                            <CardTitle>Live Traffic</CardTitle>
                            <p className="text-sm text-muted-foreground">Showing real-time data for the last minute.</p>
                        </div>
                        <Select value={selectedInterface} onValueChange={setSelectedInterface}>
                            <SelectTrigger className="w-full lg:w-64 mt-4 lg:mt-0">
                                <SelectValue placeholder="Select an interface" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="eth0">Ethernet 0/0/1 (WAN)</SelectItem>
                                <SelectItem value="eth1">Ethernet 0/0/2 (LAN)</SelectItem>
                                <SelectItem value="wlan0">WLAN 2.4GHz</SelectItem>
                                <SelectItem value="wlan1">WLAN 5GHz</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <div className="h-96 w-full">
                            <ResponsiveContainer>
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-neutral-700" />
                                    <XAxis dataKey="time" className="text-xs" />
                                    <YAxis unit=" Mbps" className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--background))",
                                            borderColor: "hsl(var(--border))",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="download"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorDownload)"
                                        name="Download"
                                        unit=" Mbps"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="upload"
                                        stroke="#ef4444"
                                        fillOpacity={1}
                                        fill="url(#colorUpload)"
                                        name="Upload"
                                        unit=" Mbps"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Peak Download</CardTitle>
                            <Download className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{peakDownload.toFixed(1)} Mbps</div>
                            <p className="text-xs text-muted-foreground">Highest download speed in the last minute</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Peak Upload</CardTitle>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{peakUpload.toFixed(1)} Mbps</div>
                            <p className="text-xs text-muted-foreground">Highest upload speed in the last minute</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Download</CardTitle>
                            <ArrowDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgDownload.toFixed(1)} Mbps</div>
                            <p className="text-xs text-muted-foreground">Average download over the last minute</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Upload</CardTitle>
                            <ArrowUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgUpload.toFixed(1)} Mbps</div>
                            <p className="text-xs text-muted-foreground">Average upload over the last minute</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
