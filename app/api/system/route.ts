import { type NextRequest, NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

export async function GET(request: NextRequest) {
  try {
    const systemData = await dataSourceManager.getSystemData()

    return NextResponse.json({
      success: true,
      data: systemData,
      timestamp: new Date().toISOString(),
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("System API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch system data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
