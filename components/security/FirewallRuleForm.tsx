"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { FirewallRule, firewallRuleSchema } from "@/lib/types"

// The form schema can be a subset of the main schema, for fields that are editable.
const formSchema = firewallRuleSchema.omit({
    id: true,
    packets: true,
    bytes: true
});

interface FirewallRuleFormProps {
    rule?: FirewallRule | null
    onSubmit: (values: FirewallRule) => void
    onCancel: () => void
}

export function FirewallRuleForm({ rule, onSubmit, onCancel }: FirewallRuleFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            chain: rule?.chain || "input",
            action: rule?.action || "accept",
            protocol: rule?.protocol || "tcp",
            srcAddress: rule?.srcAddress || "",
            dstAddress: rule?.dstAddress || "",
            dstPort: rule?.dstPort || "",
            comment: rule?.comment || "",
            enabled: rule?.enabled ?? true,
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const newRule: FirewallRule = {
            id: rule?.id || Date.now(),
            packets: rule?.packets || 0,
            bytes: rule?.bytes || 0,
            // The form values are already compliant with the schema
            ...values,
        }
        onSubmit(newRule)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="chain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chain</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a chain" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="input">Input</SelectItem>
                                        <SelectItem value="forward">Forward</SelectItem>
                                        <SelectItem value="output">Output</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="action"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Action</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an action" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="accept">Accept</SelectItem>
                                        <SelectItem value="drop">Drop</SelectItem>
                                        <SelectItem value="reject">Reject</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="protocol"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Protocol</FormLabel>
                                <Input placeholder="e.g., tcp, udp, icmp" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="srcAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source Address</FormLabel>
                                <Input placeholder="e.g., 192.168.1.0/24" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dstAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Destination Address</FormLabel>
                                <Input placeholder="e.g., 0.0.0.0/0" {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="dstPort"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination Port</FormLabel>
                            <Input placeholder="e.g., 80, 443" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comment</FormLabel>
                            <Input placeholder="A brief description of the rule" {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Enabled</FormLabel>
                                <FormDescription>
                                    Enable or disable this firewall rule.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">{rule ? "Update Rule" : "Create Rule"}</Button>
                </div>
            </form>
        </Form>
    )
}
