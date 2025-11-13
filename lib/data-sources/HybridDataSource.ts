import type {
  IDataSource,
  SystemData,
  BandwidthData,
  InterfaceData,
  WirelessData,
  PPPoESession,
  RouteEntry,
  SecurityEvent,
  NetworkStatus,
} from "./DataSourceManager"
import { DummyDataSource } from "./DummyDataSource"
import { RealDataSource } from "./RealDataSource"

export class HybridDataSource implements IDataSource {
  private dummySource: DummyDataSource
  private realSource: RealDataSource
  private connectionStatus = false

  constructor() {
    this.dummySource = new DummyDataSource()
    this.realSource = new RealDataSource()
    this.checkConnection()
  }

  private async checkConnection() {
    try {
      this.connectionStatus = await this.realSource.testConnection()
    } catch (error) {
      this.connectionStatus = false
    }
  }

  async getSystemData(): Promise<SystemData> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getSystemData()
      }
    } catch (error) {
      console.warn("Real data source failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getSystemData()
  }

  async getBandwidthData(interfaceId: string): Promise<BandwidthData> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getBandwidthData(interfaceId)
      }
    } catch (error) {
      console.warn("Real bandwidth data failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getBandwidthData(interfaceId)
  }

  async getInterfaces(): Promise<InterfaceData[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getInterfaces()
      }
    } catch (error) {
      console.warn("Real interface data failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getInterfaces()
  }

  async getWirelessInterfaces(): Promise<WirelessData[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getWirelessInterfaces()
      }
    } catch (error) {
      console.warn("Real wireless data failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getWirelessInterfaces()
  }

  async getWirelessClients(interfaceId: string): Promise<any[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getWirelessClients(interfaceId)
      }
    } catch (error) {
      console.warn("Real wireless clients data failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getWirelessClients(interfaceId)
  }

  async getPPPoESessions(): Promise<PPPoESession[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getPPPoESessions()
      }
    } catch (error) {
      console.warn("Real PPPoE data failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getPPPoESessions()
  }

  async getRoutingTable(): Promise<RouteEntry[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getRoutingTable()
      }
    } catch (error) {
      console.warn("Real routing data failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getRoutingTable()
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getSecurityEvents()
      }
    } catch (error) {
      console.warn("Real security events failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getSecurityEvents()
  }

  async getFirewallRules(): Promise<any[]> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getFirewallRules()
      }
    } catch (error) {
      console.warn("Real firewall rules failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getFirewallRules()
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getNetworkStatus()
      }
    } catch (error) {
      console.warn("Real network status failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getNetworkStatus()
  }

  async getActiveDevices(): Promise<number> {
    try {
      if (this.connectionStatus) {
        return await this.realSource.getActiveDevices()
      }
    } catch (error) {
      console.warn("Real active devices failed, falling back to dummy data:", error)
    }
    return await this.dummySource.getActiveDevices()
  }

  async testConnection(): Promise<boolean> {
    this.connectionStatus = await this.realSource.testConnection()
    return this.connectionStatus
  }
}
