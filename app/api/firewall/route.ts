import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { firewallRules, firewallActivityLogs } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

// GET all firewall rules
export async function GET() {
    try {
        const rules = await db.select().from(firewallRules).orderBy(asc(firewallRules.id));
        return NextResponse.json(rules);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch firewall rules' }, { status: 500 });
    }
}

// POST a new firewall rule
export async function POST(request: Request) {
    try {
        const rule = await request.json();
        const { chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled } = rule;

        const newRule = await db.insert(firewallRules).values({
            chain,
            action,
            srcAddress,
            dstAddress,
            protocol,
            dstPort,
            comment,
            enabled,
        }).returning();

        if (newRule.length === 0) {
            throw new Error('Failed to create rule');
        }

        await db.insert(firewallActivityLogs).values({
            ruleId: newRule[0].id,
            action: 'CREATE',
            details: JSON.stringify(newRule[0]),
        });

        return NextResponse.json(newRule[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create firewall rule' }, { status: 500 });
    }
}
