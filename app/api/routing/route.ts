import { NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

export async function GET() {
  try {
    const routingTable = await dataSourceManager.getRoutingTable()

    return NextResponse.json({
      success: true,
      data: routingTable,
      timestamp: new Date().toISOString(),
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("Routing API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch routing table",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
