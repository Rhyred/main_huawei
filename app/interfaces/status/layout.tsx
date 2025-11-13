import type { Metadata, Viewport } from 'next'
import type React from "react"

export const metadata: Metadata = {
    title: "Interface Status - HuaPau",
    description: "Monitor network interface status and statistics.",
}

export const viewport: Viewport = {
    themeColor: "black",
}

export default function InterfaceStatusLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
