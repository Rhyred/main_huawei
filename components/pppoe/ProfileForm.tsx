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
import { PppoeProfile, pppoeProfileSchema } from "@/lib/types"

const formSchema = pppoeProfileSchema.omit({ id: true });

interface ProfileFormProps {
    profile?: PppoeProfile | null
    onSubmit: (values: z.infer<typeof formSchema>) => void
    onCancel: () => void
}

export function ProfileForm({ profile, onSubmit, onCancel }: ProfileFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: profile?.name || "",
            localAddress: profile?.localAddress || "",
            remoteAddressPool: profile?.remoteAddressPool || "",
            rateLimit: profile?.rateLimit || "",
            comment: profile?.comment || "",
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Profile-5Mbps" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="localAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Local Address</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 192.168.88.1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="remoteAddressPool"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Remote Address Pool</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., pppoe-pool" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rateLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Rate Limit (Upload/Download)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 5M/5M" {...field} />
                            </FormControl>
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
                            <FormControl>
                                <Input placeholder="A brief description of the profile" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">{profile ? "Update Profile" : "Create Profile"}</Button>
                </div>
            </form>
        </Form>
    )
}
