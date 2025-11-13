"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Bell, RefreshCw } from "lucide-react"
import { NotificationPanel } from "./NotificationPanel"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // We can't know the theme on the server, so we wait until the component is mounted on the client.
  if (!isMounted) {
    return null
  }

  return (
    <div
      className="h-16 bg-white dark:bg-neutral-800 border-b border-gray-300 dark:border-neutral-700 flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-500 font-medium">Connected to Huawei</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-neutral-400">
          Last update:{" "}
          <span className="text-gray-900 dark:text-white font-mono">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsNotificationsOpen(true)}
          className="text-gray-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500"
        >
          <Bell className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.location.reload()}
          className="text-gray-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      <NotificationPanel open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen} />
    </div>
  )
}
