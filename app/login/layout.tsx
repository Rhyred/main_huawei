import type { Metadata, Viewport } from 'next'
import type React from "react"

export const metadata: Metadata = {
    title: "Login - HuaPau",
    description: "Connect to your Huawei router.",
}

export const viewport: Viewport = {
    themeColor: "black",
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
