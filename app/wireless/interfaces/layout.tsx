import type { Metadata, Viewport } from 'next'
import type React from "react"

export const metadata: Metadata = {
    title: "Wireless Interfaces - HuaPau",
    description: "Manage and monitor wireless network interfaces.",
}

export const viewport: Viewport = {
    themeColor: "black",
}

export default function WirelessInterfacesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
