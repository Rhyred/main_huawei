import * as z from "zod";

// Firewall Rule Schema and Type
export const firewallRuleSchema = z.object({
    id: z.number(),
    chain: z.enum(["input", "forward", "output"]),
    action: z.enum(["accept", "drop", "reject"]),
    protocol: z.string(),
    srcAddress: z.string(),
    dstAddress: z.string(),
    dstPort: z.string(),
    comment: z.string(),
    enabled: z.boolean(),
    packets: z.number(),
    bytes: z.number(),
});
export type FirewallRule = z.infer<typeof firewallRuleSchema>;


// Route Schema and Type
export const routeSchema = z.object({
    id: z.number(),
    destination: z.string(),
    gateway: z.string(),
    interface: z.string(),
    metric: z.number(),
    protocol: z.enum(["Static", "Connected", "OSPF", "RIP", "BGP"]),
    type: z.string(),
    status: z.enum(["active", "inactive"]),
    age: z.string(),
});
export type Route = z.infer<typeof routeSchema>;


// PPPoE Profile Schema and Type
export const pppoeProfileSchema = z.object({
    id: z.number(),
    name: z.string(),
    localAddress: z.string(),
    remoteAddressPool: z.string(),
    rateLimit: z.string(),
    comment: z.string(),
});
export type PppoeProfile = z.infer<typeof pppoeProfileSchema>;


// PPPoE Secret Schema and Type
export const pppoeSecretSchema = z.object({
    id: z.number(),
    username: z.string(),
    password: z.string().optional(), // Password is not always present
    service: z.string(),
    profile: z.string(),
    lastLoggedIn: z.string(),
    disabled: z.boolean(),
});
export type PppoeSecret = z.infer<typeof pppoeSecretSchema>;
