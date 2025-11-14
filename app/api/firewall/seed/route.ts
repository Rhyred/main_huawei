import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { firewallRules } from '@/lib/db/schema';
import { dummyFirewallRules } from '@/lib/dummy-data';
import { sql } from 'drizzle-orm';

export async function POST() {
    try {
        // Hapus aturan yang ada untuk menghindari duplikat
        await db.delete(firewallRules);

        // Atur ulang urutan auto-increment (spesifik PostgreSQL)
        await db.execute(sql`ALTER SEQUENCE firewall_rules_id_seq RESTART WITH 1;`);

        const valuesToInsert = dummyFirewallRules.map(rule => ({
            chain: rule.chain,
            action: rule.action,
            protocol: rule.protocol,
            srcAddress: rule.srcAddress,
            dstAddress: rule.dstAddress,
            dstPort: rule.dstPort,
            comment: rule.comment,
            enabled: rule.enabled,
        }));

        await db.insert(firewallRules).values(valuesToInsert);

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
