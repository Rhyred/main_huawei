import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { firewallRules, firewallActivityLogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET a single firewall rule by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        const rule = await db.select().from(firewallRules).where(eq(firewallRules.id, id));

        if (rule.length === 0) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }
        return NextResponse.json(rule[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch firewall rule' }, { status: 500 });
    }
}

// PUT (update) a firewall rule by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);
        const ruleData = await request.json();
        const { chain, action, srcAddress, dstAddress, protocol, dstPort, comment, enabled } = ruleData;

        const updatedRule = await db.update(firewallRules)
            .set({
                chain,
                action,
                srcAddress,
                dstAddress,
                protocol,
                dstPort,
                comment,
                enabled,
                updatedAt: new Date(),
            })
            .where(eq(firewallRules.id, id))
            .returning();

        if (updatedRule.length === 0) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        await db.insert(firewallActivityLogs).values({
            ruleId: id,
            action: 'UPDATE',
            details: JSON.stringify(updatedRule[0]),
        });

        return NextResponse.json(updatedRule[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update firewall rule' }, { status: 500 });
    }
}

// DELETE a firewall rule by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseInt(params.id, 10);

        const deletedRule = await db.delete(firewallRules)
            .where(eq(firewallRules.id, id))
            .returning();

        if (deletedRule.length === 0) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        await db.insert(firewallActivityLogs).values({
            ruleId: id,
            action: 'DELETE',
            details: JSON.stringify(deletedRule[0]),
        });

        return NextResponse.json({ message: 'Rule deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete firewall rule' }, { status: 500 });
    }
}
