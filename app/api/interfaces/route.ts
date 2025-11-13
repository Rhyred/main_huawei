import { NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

export async function GET() {
  try {
    const interfaces = await dataSourceManager.getInterfaces()

    return NextResponse.json({
      success: true,
      data: interfaces,
      timestamp: new Date().toISOString(),
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("Interfaces API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch interface data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
