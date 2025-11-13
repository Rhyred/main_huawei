import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all firewall rules
export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM firewall_rules');
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch firewall rules' }, { status: 500 });
    }
}

// POST a new firewall rule
export async function POST(request: Request) {
    try {
        const rule = await request.json();
        const { chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled } = rule;
        const [result] = await pool.query(
            'INSERT INTO firewall_rules (chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled]
        );
        const insertId = (result as any).insertId;
        await pool.query('INSERT INTO firewall_activity_logs (ruleId, action, details) VALUES (?, ?, ?)', [
            insertId,
            'CREATE',
            JSON.stringify(rule),
        ]);
        return NextResponse.json({ id: insertId, ...rule });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create firewall rule' }, { status: 500 });
    }
}
