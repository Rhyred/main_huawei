"use client"

import { useState, useEffect, useMemo } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, ShieldAlert, FileText, Download } from "lucide-react"
import { dummySecurityEvents } from "@/lib/dummy-data"
import { format } from "date-fns"

type SecurityEvent = typeof dummySecurityEvents[0]

export default function SecurityEventsPage() {
    const [events, setEvents] = useState<SecurityEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [severityFilter, setSeverityFilter] = useState("all")
    const [eventTypeFilter, setEventTypeFilter] = useState("all")

    useEffect(() => {
        // Simulate initial data fetch
        setTimeout(() => {
            setEvents(dummySecurityEvents)
            setIsLoading(false)
        }, 500)
    }, [])

    const filteredEvents = useMemo(() => {
        return events
            .filter((event) => severityFilter === "all" || event.severity === severityFilter)
            .filter((event) => eventTypeFilter === "all" || event.eventType === eventTypeFilter)
    }, [events, severityFilter, eventTypeFilter])

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case "critical":
                return (
                    <Badge variant="destructive" className="bg-red-500 text-white">
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Critical
                    </Badge>
                )
            case "warning":
                return (
                    <Badge variant="secondary" className="bg-yellow-500 text-black">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Warning
                    </Badge>
                )
            case "info":
                return (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">
                        <Info className="w-3 h-3 mr-1" />
                        Info
                    </Badge>
                )
            default:
                return <Badge>{severity}</Badge>
        }
    }

    const eventTypes = useMemo(() => [...new Set(events.map((e) => e.eventType))], [events])

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">Security Events</h1>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Review security-related events and logs.</p>
                    </div>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export Logs
                    </Button>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle>Event Log</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Showing {filteredEvents.length} of {events.length} events.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter by severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Severities</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="info">Info</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filter by event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Event Types</SelectItem>
                                        {eventTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-48">Timestamp</TableHead>
                                        <TableHead className="w-32">Severity</TableHead>
                                        <TableHead className="w-40">Event Type</TableHead>
                                        <TableHead className="w-40">Source IP</TableHead>
                                        <TableHead>Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">
                                                Loading events...
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell className="font-mono text-xs">
                                                    {format(new Date(event.timestamp), "yyyy-MM-dd HH:mm:ss")}
                                                </TableCell>
                                                <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                                                <TableCell className="font-medium">{event.eventType}</TableCell>
                                                <TableCell className="font-mono">{event.sourceIp}</TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{event.description}</TableCell>
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
