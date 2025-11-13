"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Route, routeSchema } from "@/lib/types"

const formSchema = routeSchema.pick({
    destination: true,
    gateway: true,
    interface: true,
    metric: true,
})

interface RouteFormProps {
    route?: Route | null
    onSubmit: (values: z.infer<typeof formSchema>) => void
    onCancel: () => void
}

export function RouteForm({ route, onSubmit, onCancel }: RouteFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            destination: route?.destination || "",
            gateway: route?.gateway || "",
            interface: route?.interface || "",
            metric: route?.metric || 1,
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 10.0.2.0/24" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gateway"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gateway</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 192.168.1.1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="interface"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interface</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., GigabitEthernet0/0/1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="metric"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metric</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 10" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">{route ? "Update Route" : "Add Route"}</Button>
                </div>
            </form>
        </Form>
    )
}
