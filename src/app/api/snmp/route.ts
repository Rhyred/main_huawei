import { NextResponse } from 'next/server';
import * as snmp from 'net-snmp';

// --- Konfigurasi Router Huawei ---
const HUAWEI_ROUTER = {
    ip: process.env.HUAWEI_IP || '192.168.1.1', // Ganti atau gunakan .env.local
    community: process.env.HUAWEI_COMMUNITY || 'public', // Ganti atau gunakan .env.local
};

// --- OID (Object Identifiers) - GANTI DENGAN OID YANG SESUAI ---
const OIDS = {
    sysName: "1.3.6.1.2.1.1.5.0",
    cpuUsage: "1.3.6.1.4.1.2011.5.25.31.1.1.1.1.5", // Contoh OID untuk CPU
    memoryUsage: "1.3.6.1.4.1.2011.5.25.31.1.1.1.1.7", // Contoh OID untuk Memori
};

/**
 * Fungsi untuk mengambil beberapa nilai SNMP secara bersamaan.
 * @param oids Array dari OID yang akan diambil.
 * @returns Promise yang me-resolve dengan array varbinds.
 */
const getSnmpValues = (oids: string[]): Promise<snmp.Varbind[]> => {
    return new Promise((resolve, reject) => {
        const session = snmp.createSession(HUAWEI_ROUTER.ip, HUAWEI_ROUTER.community);

        session.get(oids, (error, varbinds) => {
            if (error) {
                reject(error);
            } else {
                // Cek jika ada error pada salah satu varbind
                const firstError = varbinds.find(vb => snmp.isVarbindError(vb));
                if (firstError) {
                    reject(snmp.varbindError(firstError));
                } else {
                    resolve(varbinds);
                }
            }
            session.close();
        });
    });
};

export async function GET() {
    try {
        const oidsToFetch = [OIDS.sysName, OIDS.cpuUsage, OIDS.memoryUsage];
        const varbinds = await getSnmpValues(oidsToFetch);

        // Fungsi helper untuk mencari nilai berdasarkan OID
        const findValue = (oid: string) => {
            const varbind = varbinds.find(vb => vb.oid === oid);
            return varbind ? varbind.value : null;
        };

        const data = {
            success: true,
            deviceName: findValue(OIDS.sysName)?.toString() || 'Unknown Device',
            cpuUsage: findValue(OIDS.cpuUsage) || 0,
            memoryUsage: findValue(OIDS.memoryUsage) || 0,
        };

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("SNMP API Error:", error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch data from Huawei router.',
            details: error.message || error.toString(),
        }, { status: 500 });
    }
}
