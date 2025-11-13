import { CONFIG, isDummyMode, isRealMode } from "../config"
import { DummyDataSource } from "./DummyDataSource"
import { RealDataSource } from "./RealDataSource"
import { HybridDataSource } from "./HybridDataSource"

export interface SystemData {
  cpu: number
  memory: number
  temperature: number
  uptime: string
  model: string
  version: string
  serial: string
  loadAverage: number[]
  processes: {
    total: number
    running: number
    sleeping: number
    zombie: number
  }
}

export interface BandwidthData {
  timestamp: number
  download: number
  upload: number
  interface: string
  packets: {
    inbound: number
    outbound: number
  }
}

export interface InterfaceData {
  id: string
  name: string
  description: string
  type: "ethernet" | "wireless" | "ppp" | "loopback"
  status: "up" | "down" | "testing"
  adminStatus: "up" | "down"
  speed: number
  duplex: "full" | "half" | "auto"
  ip?: string
  mask?: string
  mac?: string
  mtu: number
  inOctets: number
  outOctets: number
  inPackets: number
  outPackets: number
  inErrors: number
  outErrors: number
  inDrops: number
  outDrops: number
  utilization: number
  lastChange: string
}

export interface WirelessData {
  id: string
  name: string
  ssid: string
  band: "2.4GHz" | "5GHz" | "6GHz"
  channel: number
  channelWidth: number
  power: number
  maxPower: number
  mode: string
  security: string
  status: "up" | "down"
  clients: number
  maxClients: number
  utilization: number
  signalStrength: number
  noiseFloor: number
  snr: number
  dataRate: string
  beaconInterval: number
  dtimPeriod: number
  rtsThreshold: number
  fragThreshold: number
  lastActivity: string
}

export interface PPPoESession {
  id: number
  username: string
  service: string
  ipAddress: string
  uptime: string
  rxBytes: number
  txBytes: number
  rxRate: string
  txRate: string
  sessionId: string
  macAddress: string
  status: "active" | "inactive" | "connecting"
}

export interface RouteEntry {
  id: number
  destination: string
  gateway: string
  interface: string
  metric: number
  protocol: "Static" | "Connected" | "OSPF" | "RIP" | "BGP"
  type: "Default" | "Direct" | "Network" | "Host"
  status: "active" | "inactive"
  age: string
}

export interface SecurityEvent {
  id: number
  timestamp: string
  sourceIP: string
  destinationType: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  action: "allow" | "block" | "monitor"
  protocol: string
  port: number
  packets: number
}

export interface NetworkStatus {
  ping: number
  packetLoss: number
  gateway: string
  dns: string[]
  connected: boolean
  publicIP: string
  ispInfo: {
    provider: string
    location: string
  }
}

export interface IDataSource {
  // System monitoring
  getSystemData(): Promise<SystemData>
  getBandwidthData(interfaceId: string): Promise<BandwidthData>
  getInterfaces(): Promise<InterfaceData[]>
  getNetworkStatus(): Promise<NetworkStatus>

  // Wireless management
  getWirelessInterfaces(): Promise<WirelessData[]>
  getWirelessClients(interfaceId: string): Promise<any[]>

  // PPPoE management
  getPPPoESessions(): Promise<PPPoESession[]>

  // Routing
  getRoutingTable(): Promise<RouteEntry[]>

  // Security
  getSecurityEvents(): Promise<SecurityEvent[]>
  getFirewallRules(): Promise<any[]>

  // General
  getActiveDevices(): Promise<number>
  testConnection(): Promise<boolean>
}

class DataSourceManager {
  private dataSource: IDataSource

  constructor() {
    if (isDummyMode()) {
      this.dataSource = new DummyDataSource()
    } else if (isRealMode()) {
      this.dataSource = new RealDataSource()
    } else {
      this.dataSource = new HybridDataSource()
    }
  }

  async getSystemData(): Promise<SystemData> {
    try {
      return await this.dataSource.getSystemData()
    } catch (error) {
      console.error("Failed to get system data:", error)
      const fallback = new DummyDataSource()
      return await fallback.getSystemData()
    }
  }

  async getBandwidthData(interfaceId: string): Promise<BandwidthData> {
    try {
      return await this.dataSource.getBandwidthData(interfaceId)
    } catch (error) {
      console.error("Failed to get bandwidth data:", error)
      const fallback = new DummyDataSource()
      return await fallback.getBandwidthData(interfaceId)
    }
  }

  async getInterfaces(): Promise<InterfaceData[]> {
    try {
      return await this.dataSource.getInterfaces()
    } catch (error) {
      console.error("Failed to get interfaces:", error)
      const fallback = new DummyDataSource()
      return await fallback.getInterfaces()
    }
  }

  async getWirelessInterfaces(): Promise<WirelessData[]> {
    try {
      return await this.dataSource.getWirelessInterfaces()
    } catch (error) {
      console.error("Failed to get wireless interfaces:", error)
      const fallback = new DummyDataSource()
      return await fallback.getWirelessInterfaces()
    }
  }

  async getPPPoESessions(): Promise<PPPoESession[]> {
    try {
      return await this.dataSource.getPPPoESessions()
    } catch (error) {
      console.error("Failed to get PPPoE sessions:", error)
      const fallback = new DummyDataSource()
      return await fallback.getPPPoESessions()
    }
  }

  async getRoutingTable(): Promise<RouteEntry[]> {
    try {
      return await this.dataSource.getRoutingTable()
    } catch (error) {
      console.error("Failed to get routing table:", error)
      const fallback = new DummyDataSource()
      return await fallback.getRoutingTable()
    }
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    try {
      return await this.dataSource.getSecurityEvents()
    } catch (error) {
      console.error("Failed to get security events:", error)
      const fallback = new DummyDataSource()
      return await fallback.getSecurityEvents()
    }
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    try {
      return await this.dataSource.getNetworkStatus()
    } catch (error) {
      console.error("Failed to get network status:", error)
      const fallback = new DummyDataSource()
      return await fallback.getNetworkStatus()
    }
  }

  async getActiveDevices(): Promise<number> {
    try {
      return await this.dataSource.getActiveDevices()
    } catch (error) {
      console.error("Failed to get active devices:", error)
      const fallback = new DummyDataSource()
      return await fallback.getActiveDevices()
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      return await this.dataSource.testConnection()
    } catch (error) {
      console.error("Connection test failed:", error)
      return false
    }
  }

  getDataSourceType(): string {
    return CONFIG.DATA_SOURCE
  }
}

export const dataSourceManager = new DataSourceManager()
