import { NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

export async function GET() {
  try {
    const sessions = await dataSourceManager.getPPPoESessions()

    return NextResponse.json({
      success: true,
      data: sessions,
      timestamp: new Date().toISOString(),
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("PPPoE API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PPPoE sessions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
