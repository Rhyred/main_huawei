import { NextResponse } from 'next/server';
import * as snmp from 'net-snmp';
import { CONFIG } from '@/lib/config';
import type { InterfaceData } from '@/lib/data-sources/DataSourceManager';

// Pindahkan lastCounters ke level modul agar state-nya bertahan antar panggilan API (dalam batasan serverless)
const lastCounters: Map<string, { inOctets: number; outOctets: number; timestamp: number }> = new Map();

export async function GET() {
    const snmpClient = snmp.createSession(CONFIG.SNMP.HOST, CONFIG.SNMP.COMMUNITY, {
        port: CONFIG.SNMP.PORT,
        retries: CONFIG.SNMP.RETRIES,
        timeout: CONFIG.SNMP.TIMEOUT,
        version: snmp.Version2c,
    });

    return new Promise((resolve) => {
        snmpClient.table("1.3.6.1.2.1.2.2", (error: any, table: any) => {
            if (error) {
                console.error("SNMP API Error:", error);
                const response = NextResponse.json({ message: `Failed to get interface table: ${error.message}` }, { status: 500 });
                resolve(response);
                return;
            }

            const interfaces: InterfaceData[] = Object.entries(table).map(([index, row]: [string, any]) => {
                const operStatusMap: { [key: number]: "up" | "down" | "testing" } = { 1: "up", 2: "down", 3: "testing" };
                const adminStatusMap: { [key: number]: "up" | "down" } = { 1: "up", 2: "down" };
                const typeMap: { [key: number]: InterfaceData['type'] } = { 6: "ethernet", 71: "wireless", 23: "ppp", 24: "loopback" };

                const inOctets = row[10] || 0;
                const outOctets = row[16] || 0;
                const speed = row[5] || 0;
                const lastCounter = lastCounters.get(index);
                let utilization = 0;

                if (lastCounter && speed > 0) {
                    const timeDiff = (Date.now() - lastCounter.timestamp) / 1000;
                    if (timeDiff > 0) {
                        const octetDiff = (inOctets - lastCounter.inOctets) + (outOctets - lastCounter.outOctets);
                        utilization = Math.min(100, ((octetDiff * 8) / (speed * timeDiff)) * 100);
                    }
                }

                // Update counter untuk panggilan selanjutnya
                lastCounters.set(index, { inOctets, outOctets, timestamp: Date.now() });

                return {
                    id: index,
                    name: row[2]?.toString() || `Interface ${index}`,
                    description: row[2]?.toString() || `Interface ${index}`,
                    type: typeMap[row[3]] || "ethernet",
                    status: operStatusMap[row[8]] ?? "down",
                    adminStatus: adminStatusMap[row[7]] ?? "down",
                    speed: speed / 1000000, // bps to Mbps
                    duplex: "auto",
                    mtu: row[4] || 1500,
                    mac: row[6]?.toString("hex").match(/.{1,2}/g)?.join(":") || "N/A",
                    ip: "N/A",
                    mask: "N/A",
                    inOctets,
                    outOctets,
                    inPackets: row[11] || 0,
                    outPackets: row[17] || 0,
                    inErrors: row[14] || 0,
                    outErrors: row[20] || 0,
                    inDrops: row[13] || 0,
                    outDrops: row[19] || 0,
                    utilization: parseFloat(utilization.toFixed(2)),
                    lastChange: new Date((row[9] || 0) * 10).toISOString(),
                    inDiscards: row[13] || 0,
                    outDiscards: row[19] || 0,
                    inUcastPkts: row[11] || 0,
                    outUcastPkts: row[17] || 0,
                };
            });

            const response = NextResponse.json(interfaces);
            resolve(response);
        });
    });
}
