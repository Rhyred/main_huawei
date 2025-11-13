import { NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

export async function GET() {
  try {
    const wirelessInterfaces = await dataSourceManager.getWirelessInterfaces()

    return NextResponse.json({
      success: true,
      data: wirelessInterfaces,
      timestamp: new Date().toISOString(),
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("Wireless API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wireless data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
