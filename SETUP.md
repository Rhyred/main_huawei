# Huawei Dashboard Setup Guide

## 🚀 Quick Start (Dummy Data)

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

3. **Access dashboard:**
Open http://localhost:3000

## 🔧 Real Data Configuration

### Step 1: Install Optional Dependencies

For real SNMP monitoring:
\`\`\`bash
npm install net-snmp systeminformation node-ssh
\`\`\`

### Step 2: Configure Environment

1. Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Edit `.env.local` with your router details:
\`\`\`bash
# Switch to real data
NEXT_PUBLIC_DATA_SOURCE=real

# Your router IP
HUAWEI_HOST=192.168.1.1

# SNMP community (default: public)
HUAWEI_COMMUNITY=public

# Enable features
ENABLE_SNMP=true
ENABLE_REAL_PING=true
ENABLE_REAL_TRACEROUTE=true
\`\`\`

### Step 3: Router Configuration

#### Enable SNMP on Huawei Router:
\`\`\`bash
# Via CLI
snmp-agent
snmp-agent community read public
snmp-agent sys-info version v2c
\`\`\`

#### Or via Web Interface:
1. Login to router web interface
2. Go to System → SNMP
3. Enable SNMP v2c
4. Set community string (default: public)

### Step 4: Test Connection

\`\`\`bash
# Test SNMP connection
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0
\`\`\`

## 📊 Data Source Modes

### 1. Dummy Mode (Default)
\`\`\`bash
NEXT_PUBLIC_DATA_SOURCE=dummy
\`\`\`
- ✅ No router required
- ✅ Perfect for development
- ✅ Realistic simulated data

### 2. Real Mode
\`\`\`bash
NEXT_PUBLIC_DATA_SOURCE=real
\`\`\`
- ✅ Real router data via SNMP
- ✅ Actual bandwidth monitoring
- ⚠️ Requires router configuration

### 3. Hybrid Mode
\`\`\`bash
NEXT_PUBLIC_DATA_SOURCE=hybrid
\`\`\`
- ✅ Real data when available
- ✅ Fallback to dummy on failure
- ✅ Best of both worlds

## 🔍 Troubleshooting

### SNMP Connection Issues:
1. Check router IP and community string
2. Verify SNMP is enabled on router
3. Check firewall settings
4. Test with snmpwalk command

### Permission Issues:
\`\`\`bash
# On Linux, may need sudo for ping/traceroute
sudo setcap cap_net_raw+ep /usr/bin/ping
\`\`\`

### Network Tools Not Working:
- Windows: Install Windows Subsystem for Linux
- macOS: Should work out of the box
- Linux: Install iputils-ping and traceroute

## 📱 Production Deployment

### Environment Variables for Production:
\`\`\`bash
NEXT_PUBLIC_DATA_SOURCE=real
HUAWEI_HOST=your_router_ip
HUAWEI_COMMUNITY=your_snmp_community
ENABLE_SNMP=true
ENABLE_REAL_PING=true
ENABLE_REAL_TRACEROUTE=true
\`\`\`

### Security Considerations:
- Use read-only SNMP community
- Restrict SNMP access by IP
- Use HTTPS in production
- Don't expose SNMP credentials in client-side code

## 🎯 Feature Status

| Feature | Dummy | Real | Status |
|---------|-------|------|--------|
| System Monitoring | ✅ | ✅ | Ready |
| Bandwidth Charts | ✅ | ✅ | Ready |
| Interface Status | ✅ | ✅ | Ready |
| Network Testing | ✅ | ✅ | Ready |
| Device Discovery | ✅ | 🚧 | In Progress |
| Anomaly Detection | ✅ | ✅ | Ready |

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify router connectivity
3. Test SNMP manually
4. Check environment variables
\`\`\`

Sekarang update API untuk menggunakan data source manager:
