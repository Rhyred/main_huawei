"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface ActivityLog {
    id: number
    ruleId: number
    action: string
    details: string
    timestamp: string
}

export function FirewallActivityLog({ refreshKey }: { refreshKey: number }) {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchLogs()
    }, [refreshKey])

    const fetchLogs = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/firewall/logs")
            const data = await response.json()
            setLogs(data)
        } catch (error) {
            console.error("Failed to fetch activity logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getActionBadge = (action: string) => {
        switch (action) {
            case "CREATE":
                return <Badge className="bg-blue-500/20 text-blue-500">{action}</Badge>
            case "UPDATE":
                return <Badge className="bg-yellow-500/20 text-yellow-500">{action}</Badge>
            case "DELETE":
                return <Badge variant="destructive">{action}</Badge>
            default:
                return <Badge>{action}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Recent changes to firewall rules.
                </p>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24">Action</TableHead>
                                <TableHead className="w-24">Rule ID</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="w-48">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        Loading logs...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{getActionBadge(log.action)}</TableCell>
                                        <TableCell>{log.ruleId}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground font-mono">{log.details}</TableCell>
                                        <TableCell>{format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
