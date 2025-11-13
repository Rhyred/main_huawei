import { type NextRequest, NextResponse } from "next/server"
import { dataSourceManager } from "@/lib/data-sources/DataSourceManager"

// Simulate SNMP bandwidth data collection
class BandwidthCollector {
  private static instances: Map<string, BandwidthCollector> = new Map()
  private interfaceId: string
  private lastCounters: { inOctets: number; outOctets: number; timestamp: number } | null = null
  private history: Array<{ timestamp: number; download: number; upload: number }> = []

  constructor(interfaceId: string) {
    this.interfaceId = interfaceId
  }

  static getInstance(interfaceId: string): BandwidthCollector {
    if (!this.instances.has(interfaceId)) {
      this.instances.set(interfaceId, new BandwidthCollector(interfaceId))
    }
    return this.instances.get(interfaceId)!
  }

  // Simulate SNMP counter collection
  private async getInterfaceCounters(): Promise<{ inOctets: number; outOctets: number }> {
    // In real implementation, this would query SNMP OIDs:
    // ifInOctets: 1.3.6.1.2.1.2.2.1.10.{interface_index}
    // ifOutOctets: 1.3.6.1.2.1.2.2.1.16.{interface_index}

    const baseIn = 1000000000 // 1GB base counter
    const baseOut = 500000000 // 500MB base counter

    // Simulate realistic network traffic patterns
    const now = Date.now()
    const timeOfDay = (now % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000) // Hours since midnight

    // Peak hours simulation (9-17 and 19-23)
    const isPeakHour = (timeOfDay >= 9 && timeOfDay <= 17) || (timeOfDay >= 19 && timeOfDay <= 23)
    const peakMultiplier = isPeakHour ? 2.5 : 1.0

    // Add some randomness and patterns
    const downloadVariation = Math.sin(now / 30000) * 0.3 + Math.random() * 0.4
    const uploadVariation = Math.cos(now / 25000) * 0.2 + Math.random() * 0.3

    return {
      inOctets: baseIn + (now / 100) * peakMultiplier * (1 + downloadVariation),
      outOctets: baseOut + (now / 150) * peakMultiplier * (1 + uploadVariation),
    }
  }

  async getCurrentBandwidth(): Promise<{ download: number; upload: number }> {
    const currentCounters = await this.getInterfaceCounters()
    const currentTime = Date.now()

    if (this.lastCounters) {
      const timeDiff = (currentTime - this.lastCounters.timestamp) / 1000 // seconds
      const inDiff = currentCounters.inOctets - this.lastCounters.inOctets
      const outDiff = currentCounters.outOctets - this.lastCounters.outOctets

      // Convert bytes per second to Mbps
      const downloadMbps = ((inDiff / timeDiff) * 8) / 1000000
      const uploadMbps = ((outDiff / timeDiff) * 8) / 1000000

      // Store in history
      this.history.push({
        timestamp: currentTime,
        download: Math.max(0, downloadMbps),
        upload: Math.max(0, uploadMbps),
      })

      // Keep only last 1000 entries
      if (this.history.length > 1000) {
        this.history = this.history.slice(-1000)
      }

      this.lastCounters = { ...currentCounters, timestamp: currentTime }

      return {
        download: Math.max(0, downloadMbps),
        upload: Math.max(0, uploadMbps),
      }
    } else {
      // First call, just store counters
      this.lastCounters = { ...currentCounters, timestamp: currentTime }
      return { download: 0, upload: 0 }
    }
  }

  getHistory(minutes = 5): Array<{ timestamp: number; download: number; upload: number }> {
    const cutoff = Date.now() - minutes * 60 * 1000
    return this.history.filter((entry) => entry.timestamp > cutoff)
  }

  getInterfaceInfo() {
    const interfaces = {
      eth0: { name: "Ethernet 0/0/1", type: "ethernet", speed: 1000, description: "WAN Interface" },
      eth1: { name: "Ethernet 0/0/2", type: "ethernet", speed: 1000, description: "LAN Interface" },
      wlan0: { name: "WLAN 2.4GHz", type: "wireless", speed: 300, description: "Wireless 2.4GHz" },
      wlan1: { name: "WLAN 5GHz", type: "wireless", speed: 867, description: "Wireless 5GHz" },
    }
    return interfaces[this.interfaceId] || interfaces.eth0
  }
}

export async function GET(request: NextRequest, { params }: { params: { interface: string } }) {
  try {
    const interfaceId = params.interface
    const bandwidthData = await dataSourceManager.getBandwidthData(interfaceId)
    const interfaces = await dataSourceManager.getInterfaces()
    const interfaceInfo = interfaces.find((iface) => iface.id === interfaceId)

    return NextResponse.json({
      success: true,
      interface: interfaceId,
      current: {
        download: bandwidthData.download,
        upload: bandwidthData.upload,
      },
      interfaceInfo: interfaceInfo,
      timestamp: bandwidthData.timestamp,
      source: dataSourceManager.getDataSourceType(),
    })
  } catch (error) {
    console.error("Bandwidth API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to collect bandwidth data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Get historical data
export async function POST(request: NextRequest, { params }: { params: { interface: string } }) {
  try {
    const { timeRange } = await request.json()
    const interfaceId = params.interface
    const collector = BandwidthCollector.getInstance(interfaceId)

    const history = collector.getHistory(timeRange || 5)

    return NextResponse.json({
      success: true,
      interface: interfaceId,
      history: history,
      timeRange: timeRange,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get historical data",
      },
      { status: 500 },
    )
  }
}
