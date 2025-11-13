"use client"

import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { dummyNotifications } from "@/lib/dummy-data"
import { Bell, ShieldAlert, AlertTriangle, Info, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface NotificationPanelProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
    const [notifications, setNotifications] = useState(dummyNotifications)

    const getIcon = (type: string) => {
        switch (type) {
            case "critical":
                return <ShieldAlert className="w-5 h-5 text-red-500" />
            case "warning":
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />
            case "info":
            default:
                return <Info className="w-5 h-5 text-blue-500" />
        }
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const clearAll = () => {
        setNotifications([])
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[440px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Bell />
                        Notifications
                    </SheetTitle>
                    <SheetDescription>
                        You have {notifications.filter(n => !n.read).length} unread messages.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Bell className="w-16 h-16 mb-4" />
                            <p>No new notifications</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div key={notification.id} className="py-4 flex items-start gap-4">
                                <div className="mt-1">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                )}
                            </div>
                        ))
                    )}
                </div>
                <SheetFooter>
                    <div className="w-full flex justify-between gap-2">
                        <Button variant="outline" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark all as read
                        </Button>
                        <Button variant="destructive" onClick={clearAll} disabled={notifications.length === 0}>
                            Clear all
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
