import type { Metadata, Viewport } from 'next'
import type React from "react"

export const metadata: Metadata = {
    title: "Wireless Security - HuaPau",
    description: "Manage wireless network security settings and monitor threats.",
}

export const viewport: Viewport = {
    themeColor: "black",
}

export default function WirelessSecurityLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
