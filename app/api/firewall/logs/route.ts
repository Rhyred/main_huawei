import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { firewallActivityLogs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const logs = await db.select().from(firewallActivityLogs).orderBy(desc(firewallActivityLogs.timestamp));
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
    }
}
