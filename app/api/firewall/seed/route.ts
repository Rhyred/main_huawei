import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { dummyFirewallRules } from '@/lib/dummy-data';

export async function POST() {
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Hapus aturan yang ada untuk menghindari duplikat
            await connection.query('DELETE FROM firewall_rules');
            // Atur ulang auto-increment
            await connection.query('ALTER TABLE firewall_rules AUTO_INCREMENT = 1');

            const query = `
        INSERT INTO firewall_rules 
        (chain, action, protocol, srcAddress, dstAddress, dstPort, comment, enabled) 
        VALUES ?`;

            const values = dummyFirewallRules.map(rule => [
                rule.chain,
                rule.action,
                rule.protocol,
                rule.srcAddress,
                rule.dstAddress,
                rule.dstPort,
                rule.comment,
                rule.enabled,
            ]);

            await connection.query(query, [values]);
            await connection.commit();

            return NextResponse.json({ message: 'Database seeded successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
