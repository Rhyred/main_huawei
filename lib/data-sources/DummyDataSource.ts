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

export class DummyDataSource implements IDataSource {
  private lastBandwidthCounters: Map<string, { inOctets: number; outOctets: number; timestamp: number }> = new Map()

  async getSystemData(): Promise<SystemData> {
    const baseTime = Date.now()

    return {
      cpu: Math.max(10, Math.min(95, 23 + Math.sin(baseTime / 30000) * 20 + (Math.random() - 0.5) * 10)),
      memory: Math.max(20, Math.min(90, 45 + Math.cos(baseTime / 25000) * 15 + (Math.random() - 0.5) * 8)),
      temperature: Math.max(35, Math.min(80, 42 + Math.sin(baseTime / 40000) * 10 + (Math.random() - 0.5) * 5)),
      uptime: "15d 7h 23m 45s",
      model: "Huawei AR2220E-S",
      version: "V200R010C00SPC600",
      serial: "2102351BWL10E4000123",
      loadAverage: [1.2, 1.5, 1.8],
      processes: {
        total: 127,
        running: 3,
        sleeping: 120,
        zombie: 0,
      },
    }
  }

  async getBandwidthData(interfaceId: string): Promise<BandwidthData> {
    const now = Date.now()
    const timeOfDay = (now % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)

    const isPeakHour = (timeOfDay >= 9 && timeOfDay <= 17) || (timeOfDay >= 19 && timeOfDay <= 23)
    const peakMultiplier = isPeakHour ? 2.5 : 1.0

    const downloadVariation = Math.sin(now / 30000) * 0.3 + Math.random() * 0.4
    const uploadVariation = Math.cos(now / 25000) * 0.2 + Math.random() * 0.3

    return {
      timestamp: now,
      download: Math.max(0, 50 * peakMultiplier * (1 + downloadVariation)),
      upload: Math.max(0, 25 * peakMultiplier * (1 + uploadVariation)),
      interface: interfaceId,
      packets: {
        inbound: Math.floor(Math.random() * 10000) + 1000,
        outbound: Math.floor(Math.random() * 8000) + 800,
      },
    }
  }

  async getInterfaces(): Promise<InterfaceData[]> {
    return [
      {
        id: "eth0",
        name: "GigabitEthernet0/0/1",
        description: "WAN Interface - Internet Connection",
        type: "ethernet",
        status: "up",
        adminStatus: "up",
        speed: 1000,
        duplex: "full",
        ip: "192.168.1.1",
        mask: "255.255.255.0",
        mac: "00:11:22:33:44:55",
        mtu: 1500,
        inOctets: Math.floor(Math.random() * 1000000000),
        outOctets: Math.floor(Math.random() * 500000000),
        inPackets: Math.floor(Math.random() * 10000000),
        outPackets: Math.floor(Math.random() * 8000000),
        inErrors: Math.floor(Math.random() * 10),
        outErrors: Math.floor(Math.random() * 5),
        inDrops: Math.floor(Math.random() * 20),
        outDrops: Math.floor(Math.random() * 15),
        utilization: Math.random() * 80 + 10,
        lastChange: "2024-01-15 08:30:45",
      },
      {
        id: "eth1",
        name: "GigabitEthernet0/0/2",
        description: "LAN Interface - Local Network",
        type: "ethernet",
        status: "up",
        adminStatus: "up",
        speed: 1000,
        duplex: "full",
        ip: "10.0.0.1",
        mask: "255.255.255.0",
        mac: "00:11:22:33:44:56",
        mtu: 1500,
        inOctets: Math.floor(Math.random() * 2000000000),
        outOctets: Math.floor(Math.random() * 1000000000),
        inPackets: Math.floor(Math.random() * 15000000),
        outPackets: Math.floor(Math.random() * 12000000),
        inErrors: Math.floor(Math.random() * 5),
        outErrors: Math.floor(Math.random() * 3),
        inDrops: Math.floor(Math.random() * 15),
        outDrops: Math.floor(Math.random() * 10),
        utilization: Math.random() * 60 + 15,
        lastChange: "2024-01-15 08:30:47",
      },
      {
        id: "wlan0",
        name: "WLAN 2.4GHz",
        description: "Wireless 2.4GHz Interface",
        type: "wireless",
        status: "up",
        adminStatus: "up",
        speed: 300,
        duplex: "half",
        ip: "192.168.2.1",
        mask: "255.255.255.0",
        mac: "00:11:22:33:44:57",
        mtu: 1500,
        inOctets: Math.floor(Math.random() * 500000000),
        outOctets: Math.floor(Math.random() * 250000000),
        inPackets: Math.floor(Math.random() * 5000000),
        outPackets: Math.floor(Math.random() * 4000000),
        inErrors: Math.floor(Math.random() * 15),
        outErrors: Math.floor(Math.random() * 10),
        inDrops: Math.floor(Math.random() * 25),
        outDrops: Math.floor(Math.random() * 20),
        utilization: Math.random() * 40 + 5,
        lastChange: "2024-01-15 08:31:12",
      },
      {
        id: "wlan1",
        name: "WLAN 5GHz",
        description: "Wireless 5GHz Interface",
        type: "wireless",
        status: "up",
        adminStatus: "up",
        speed: 867,
        duplex: "half",
        ip: "192.168.5.1",
        mask: "255.255.255.0",
        mac: "00:11:22:33:44:58",
        mtu: 1500,
        inOctets: Math.floor(Math.random() * 800000000),
        outOctets: Math.floor(Math.random() * 400000000),
        inPackets: Math.floor(Math.random() * 8000000),
        outPackets: Math.floor(Math.random() * 6000000),
        inErrors: Math.floor(Math.random() * 8),
        outErrors: Math.floor(Math.random() * 5),
        inDrops: Math.floor(Math.random() * 12),
        outDrops: Math.floor(Math.random() * 8),
        utilization: Math.random() * 50 + 20,
        lastChange: "2024-01-15 08:31:15",
      },
    ]
  }

  async getWirelessInterfaces(): Promise<WirelessData[]> {
    return [
      {
        id: "wlan0",
        name: "WLAN 2.4GHz",
        ssid: "HuaPau-2.4G",
        band: "2.4GHz",
        channel: 6,
        channelWidth: 20,
        power: 20,
        maxPower: 23,
        mode: "802.11n",
        security: "WPA2-PSK",
        status: "up",
        clients: 12,
        maxClients: 50,
        utilization: 45.2,
        signalStrength: -42,
        noiseFloor: -95,
        snr: 53,
        dataRate: "150 Mbps",
        beaconInterval: 100,
        dtimPeriod: 2,
        rtsThreshold: 2347,
        fragThreshold: 2346,
        lastActivity: new Date().toISOString(),
      },
      {
        id: "wlan1",
        name: "WLAN 5GHz",
        ssid: "HuaPau-5G",
        band: "5GHz",
        channel: 36,
        channelWidth: 80,
        power: 23,
        maxPower: 30,
        mode: "802.11ac",
        security: "WPA3-SAE",
        status: "up",
        clients: 8,
        maxClients: 100,
        utilization: 23.7,
        signalStrength: -38,
        noiseFloor: -92,
        snr: 54,
        dataRate: "867 Mbps",
        beaconInterval: 100,
        dtimPeriod: 2,
        rtsThreshold: 2347,
        fragThreshold: 2346,
        lastActivity: new Date().toISOString(),
      },
    ]
  }

  async getWirelessClients(interfaceId: string): Promise<any[]> {
    return [
      {
        id: 1,
        mac: "aa:bb:cc:dd:ee:01",
        ip: "192.168.2.100",
        hostname: "iPhone-John",
        signal: -45,
        uptime: "2h 15m",
        rxBytes: 1024000,
        txBytes: 512000,
      },
      {
        id: 2,
        mac: "aa:bb:cc:dd:ee:02",
        ip: "192.168.2.101",
        hostname: "Laptop-Sarah",
        signal: -52,
        uptime: "1h 30m",
        rxBytes: 2048000,
        txBytes: 1024000,
      },
    ]
  }

  async getPPPoESessions(): Promise<PPPoESession[]> {
    return [
      {
        id: 1,
        username: "user001@huapau.net",
        service: "pppoe-service-1",
        ipAddress: "192.168.100.10",
        uptime: "2h 15m 30s",
        rxBytes: 1024000000,
        txBytes: 512000000,
        rxRate: "15.2 Mbps",
        txRate: "8.5 Mbps",
        sessionId: "0x1A2B3C4D",
        macAddress: "00:11:22:33:44:55",
        status: "active",
      },
      {
        id: 2,
        username: "admin@huapau.net",
        service: "pppoe-service-1",
        ipAddress: "192.168.100.11",
        uptime: "5h 42m 18s",
        rxBytes: 2048000000,
        txBytes: 1024000000,
        rxRate: "25.8 Mbps",
        txRate: "12.3 Mbps",
        sessionId: "0x2B3C4D5E",
        macAddress: "00:22:33:44:55:66",
        status: "active",
      },
    ]
  }

  async getRoutingTable(): Promise<RouteEntry[]> {
    return [
      {
        id: 1,
        destination: "0.0.0.0/0",
        gateway: "192.168.1.1",
        interface: "GigabitEthernet0/0/1",
        metric: 1,
        protocol: "Static",
        type: "Default",
        status: "active",
        age: "2d 5h",
      },
      {
        id: 2,
        destination: "192.168.1.0/24",
        gateway: "0.0.0.0",
        interface: "GigabitEthernet0/0/1",
        metric: 0,
        protocol: "Connected",
        type: "Direct",
        status: "active",
        age: "2d 5h",
      },
      {
        id: 3,
        destination: "10.0.0.0/8",
        gateway: "192.168.1.254",
        interface: "GigabitEthernet0/0/1",
        metric: 10,
        protocol: "OSPF",
        type: "Network",
        status: "active",
        age: "1d 12h",
      },
    ]
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    return [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        sourceIP: "203.0.113.45",
        destinationType: "SYN Flood Attack",
        severity: "critical",
        description: "High volume SYN packets detected",
        action: "block",
        protocol: "TCP",
        port: 80,
        packets: 15000,
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        sourceIP: "198.51.100.23",
        destinationType: "Port Scan",
        severity: "medium",
        description: "Sequential port scanning detected",
        action: "monitor",
        protocol: "TCP",
        port: 22,
        packets: 500,
      },
    ]
  }

  async getFirewallRules(): Promise<any[]> {
    return [
      {
        id: 1,
        rule: "ACCEPT tcp 22",
        source: "192.168.1.0/24",
        destination: "any",
        action: "ALLOW",
        status: "Active",
      },
      {
        id: 2,
        rule: "DROP tcp 23",
        source: "0.0.0.0/0",
        destination: "any",
        action: "BLOCK",
        status: "Active",
      },
    ]
  }

  async getNetworkStatus(): Promise<NetworkStatus> {
    return {
      ping: Math.floor(Math.random() * 50 + 10),
      packetLoss: Math.random() * 2,
      gateway: "192.168.1.1",
      dns: ["8.8.8.8", "8.8.4.4"],
      connected: true,
      publicIP: "203.0.113.100",
      ispInfo: {
        provider: "Example ISP",
        location: "Jakarta, Indonesia",
      },
    }
  }

  async getActiveDevices(): Promise<number> {
    const baseCount = 24
    const variation = Math.floor(Math.sin(Date.now() / 60000) * 5)
    return Math.max(1, baseCount + variation)
  }

  async testConnection(): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }
}
