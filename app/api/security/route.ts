import { NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

export async function GET() {
  try {
    const securityEvents = await dataSourceManager.getSecurityEvents()

    return NextResponse.json({
      success: true,
      data: securityEvents,
      timestamp: new Date().toISOString(),
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("Security API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch security events",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
