import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET a single firewall rule
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const [rows] = await pool.query('SELECT * FROM firewall_rules WHERE id = ?', [params.id]);
        if ((rows as any).length === 0) {
            return NextResponse.json({ error: 'Firewall rule not found' }, { status: 404 });
        }
        return NextResponse.json((rows as any)[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch firewall rule' }, { status: 500 });
    }
}

// PUT (update) a firewall rule
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const rule = await request.json();
        const { chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled } = rule;
        await pool.query(
            'UPDATE firewall_rules SET chain = ?, action = ?, srcAddress = ?, dstAddress = ?, protocol = ?, dstPort = ?, comment = ?, enabled = ? WHERE id = ?',
            [chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled, params.id]
        );
        await pool.query('INSERT INTO firewall_activity_logs (ruleId, action, details) VALUES (?, ?, ?)', [
            params.id,
            'UPDATE',
            JSON.stringify(rule),
        ]);
        return NextResponse.json({ id: params.id, ...rule });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update firewall rule' }, { status: 500 });
    }
}

// DELETE a firewall rule
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await pool.query('DELETE FROM firewall_rules WHERE id = ?', [params.id]);
        await pool.query('INSERT INTO firewall_activity_logs (ruleId, action, details) VALUES (?, ?, ?)', [
            params.id,
            'DELETE',
            JSON.stringify({ id: params.id }),
        ]);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete firewall rule' }, { status: 500 });
    }
}
