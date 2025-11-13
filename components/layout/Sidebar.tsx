"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Network,
  Wifi,
  Activity,
  Shield,
  Route,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Globe,
  Router,
  Zap,
  Eye,
  Lock,
  GitBranch,
  UserCheck,
  Gauge,
  HardDrive,
  PanelLeftClose,
  PanelRightClose,
  LogOut,
} from "lucide-react"

interface MenuItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: MenuItem[]
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onDisconnect: () => void
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Interfaces",
    icon: Network,
    children: [
      { title: "Status", icon: Eye, href: "/interfaces/status" },
      { title: "Configuration", icon: Settings, href: "/interfaces/config" },
      { title: "Statistics", icon: BarChart3, href: "/interfaces/stats" },
    ],
  },
  {
    title: "Wireless",
    icon: Wifi,
    children: [
      { title: "Interfaces", icon: Wifi, href: "/wireless/interfaces" },
      { title: "Security", icon: Lock, href: "/wireless/security" },
      { title: "Clients", icon: Users, href: "/wireless/clients" },
    ],
  },
  {
    title: "Monitoring",
    icon: Activity,
    children: [
      { title: "System", icon: Gauge, href: "/monitoring/system" },
      { title: "Traffic", icon: BarChart3, href: "/monitoring/traffic" },
      { title: "Bandwidth", icon: Zap, href: "/monitoring/bandwidth" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    children: [
      { title: "Firewall", icon: Shield, href: "/security/firewall" },
      { title: "Events", icon: Eye, href: "/security/events" },
      { title: "DDoS Protection", icon: Lock, href: "/security" },
    ],
  },
  {
    title: "Routing",
    icon: Route,
    children: [
      { title: "Table", icon: GitBranch, href: "/routing/table" },
      { title: "Static Routes", icon: Route, href: "/routing/static" },
      { title: "Dynamic Routes", icon: Router, href: "/routing/dynamic" },
    ],
  },
  {
    title: "PPPoE",
    icon: Globe,
    children: [
      { title: "Active Sessions", icon: UserCheck, href: "/pppoe/active" },
      { title: "Configuration", icon: Settings, href: "/pppoe/config" },
      { title: "Statistics", icon: BarChart3, href: "/pppoe/stats" },
    ],
  },
  {
    title: "System",
    icon: HardDrive,
    href: "/system",
  },
]

export default function Sidebar({ collapsed, onToggle, onDisconnect }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const pathname = usePathname()

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => {
      // Close all other menus and toggle the clicked one
      if (prev.includes(title)) {
        return prev.filter((menu) => menu !== title)
      } else {
        return [title] // Only keep the clicked menu open
      }
    })
  }

  const isMenuOpen = (title: string) => openMenus.includes(title)

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const isParentActive = (children: MenuItem[]) => {
    return children.some((child) => child.href && isActive(child.href))
  }

  return (
    <div
      className={cn(
        "h-screen overflow-y-auto transition-all duration-300 ease-in-out",
        "bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-700",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8 h-12">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Router className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-wider whitespace-nowrap">
                HuaPau
              </h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400 whitespace-nowrap">
                Network Management
              </p>
            </div>
          )}
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isParentActive(item.children)
                        ? "bg-orange-500/20 text-orange-500 dark:text-orange-400"
                        : "text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white",
                      collapsed && "justify-center",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </div>
                    {!collapsed &&
                      (isMenuOpen(item.title) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      ))}
                  </button>
                  {!collapsed && isMenuOpen(item.title) && (
                    <div className="ml-4 mt-2 space-y-1 border-l border-gray-200 dark:border-neutral-700 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href || "#"}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            pathname === (child.href || "")
                              ? "bg-orange-500 text-white font-medium"
                              : "text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white",
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-orange-500 text-white"
                      : "text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white",
                    collapsed && "justify-center",
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button
            onClick={onDisconnect}
            className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-red-500 dark:text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Disconnect</span>}
          </button>
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
          >
            {collapsed ? (
              <PanelRightClose className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
