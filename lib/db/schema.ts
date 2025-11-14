import { pgTable, serial, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const firewallRules = pgTable('firewall_rules', {
    id: serial('id').primaryKey(),
    chain: varchar('chain', { length: 255 }).notNull(),
    action: varchar('action', { length: 255 }).notNull(),
    srcAddress: varchar('srcAddress', { length: 255 }),
    dstAddress: varchar('dstAddress', { length: 255 }),
    protocol: varchar('protocol', { length: 255 }),
    dstPort: varchar('dstPort', { length: 255 }),
    comment: text('comment'),
    enabled: boolean('enabled').default(true),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

export const firewallActivityLogs = pgTable('firewall_activity_logs', {
    id: serial('id').primaryKey(),
    ruleId: integer('ruleId').references(() => firewallRules.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 255 }).notNull(),
    details: text('details'),
    timestamp: timestamp('timestamp').defaultNow(),
});
