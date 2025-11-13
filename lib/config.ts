// Configuration management for HuaPau Network Management System
export const CONFIG = {
  // Data source configuration
  DATA_SOURCE: process.env.NEXT_PUBLIC_DATA_SOURCE || "hybrid", // "dummy", "real", "hybrid"

  // SNMP Configuration for real data
  SNMP: {
    HOST: process.env.SNMP_HOST || "192.168.1.1",
    PORT: Number.parseInt(process.env.SNMP_PORT || "161"),
    COMMUNITY: process.env.SNMP_COMMUNITY || "public",
    TIMEOUT: Number.parseInt(process.env.SNMP_TIMEOUT || "5000"),
    RETRIES: Number.parseInt(process.env.SNMP_RETRIES || "3"),
    VERSION: process.env.SNMP_VERSION || "2c",
  },

  // Huawei Router Configuration
  ROUTER: {
    HOST: process.env.ROUTER_HOST || "192.168.1.1",
    USERNAME: process.env.ROUTER_USERNAME || "admin",
    PASSWORD: process.env.ROUTER_PASSWORD || "admin",
    SSH_PORT: Number.parseInt(process.env.ROUTER_SSH_PORT || "22"),
    HTTP_PORT: Number.parseInt(process.env.ROUTER_HTTP_PORT || "80"),
    HTTPS_PORT: Number.parseInt(process.env.ROUTER_HTTPS_PORT || "443"),
  },

  // Application Features
  FEATURES: {
    SNMP_MONITORING: process.env.NEXT_PUBLIC_ENABLE_SNMP === "true",
    AI_DETECTION: process.env.NEXT_PUBLIC_ENABLE_AI === "true",
    REAL_TIME_UPDATES: process.env.NEXT_PUBLIC_REAL_TIME === "true",
    CHAT_ASSISTANT: process.env.NEXT_PUBLIC_CHAT_ASSISTANT === "true",
  },

  // Refresh intervals (in milliseconds)
  INTERVALS: {
    DASHBOARD_REFRESH: 5000,
    BANDWIDTH_REFRESH: 2000,
    SYSTEM_REFRESH: 10000,
    INTERFACE_REFRESH: 5000,
  },

  // API Configuration
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    TIMEOUT: Number.parseInt(process.env.API_TIMEOUT || "10000"),
  },
}

// Helper functions
export const isDummyMode = () => CONFIG.DATA_SOURCE === "dummy"
export const isRealMode = () => CONFIG.DATA_SOURCE === "real"
export const isHybridMode = () => CONFIG.DATA_SOURCE === "hybrid"
