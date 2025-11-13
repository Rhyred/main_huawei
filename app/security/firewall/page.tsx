"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    PlusCircle,
    Pencil,
    Trash2,
    ArrowRight,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FirewallRuleForm } from "@/components/security/FirewallRuleForm"
import { FirewallActivityLog } from "@/components/security/FirewallActivityLog"
import { cn } from "@/lib/utils"
import { FirewallRule } from "@/lib/types"

export default function FirewallPage() {
    const [rules, setRules] = useState<FirewallRule[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedRule, setSelectedRule] = useState<FirewallRule | null>(null)
    const [logRefreshKey, setLogRefreshKey] = useState(0)

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/firewall');
            const data = await response.json();
            setRules(data);
        } catch (error) {
            console.error('Failed to fetch firewall rules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleRule = async (id: number) => {
        const ruleToUpdate = rules.find((rule) => rule.id === id);
        if (!ruleToUpdate) return;

        const updatedRule = { ...ruleToUpdate, enabled: !ruleToUpdate.enabled };

        try {
            await fetch(`/api/firewall/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRule),
            });
            fetchRules();
            setLogRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Failed to toggle firewall rule:', error);
        }
    };

    const handleOpenDialog = (rule: FirewallRule | null = null) => {
        setSelectedRule(rule)
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
        setSelectedRule(null)
    }

    const handleOpenAlert = (rule: FirewallRule) => {
        setSelectedRule(rule)
        setIsAlertOpen(true)
    }

    const handleCloseAlert = () => {
        setIsAlertOpen(false)
        setSelectedRule(null)
    }

    const handleSubmitRule = async (rule: FirewallRule) => {
        const method = selectedRule ? 'PUT' : 'POST';
        const url = selectedRule ? `/api/firewall/${selectedRule.id}` : '/api/firewall';

        try {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rule),
            });
            fetchRules();
            handleCloseDialog();
            setLogRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Failed to save firewall rule:', error);
        }
    };

    const handleDeleteRule = async () => {
        if (!selectedRule) return;

        try {
            await fetch(`/api/firewall/${selectedRule.id}`, {
                method: 'DELETE',
            });
            fetchRules();
            handleCloseAlert();
            setLogRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Failed to delete firewall rule:', error);
        }
    };

    const getActionBadge = (action: string) => {
        switch (action) {
            case "accept":
                return <Badge variant="secondary" className="bg-green-500/20 text-green-500">Accept</Badge>
            case "drop":
                return <Badge variant="destructive">Drop</Badge>
            case "reject":
                return <Badge variant="outline">Reject</Badge>
            default:
                return <Badge>{action}</Badge>
        }
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">Firewall Rules</h1>
                        <p className="text-sm text-gray-500 dark:text-neutral-400">Manage your network's firewall rules and policies.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={async () => {
                                await fetch('/api/firewall/seed', { method: 'POST' });
                                fetchRules();
                            }}
                            variant="outline"
                        >
                            Seed Database
                        </Button>
                        <Button onClick={() => handleOpenDialog()}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add New Rule
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rule Table</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Showing {rules.length} firewall rules. Rules are processed in order.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-20">Status</TableHead>
                                        <TableHead className="w-24">Chain</TableHead>
                                        <TableHead className="w-24">Action</TableHead>
                                        <TableHead>Rule Details</TableHead>
                                        <TableHead className="w-48">Comment</TableHead>
                                        <TableHead className="w-32 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center h-24">
                                                Loading rules...
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rules.map((rule) => (
                                            <TableRow key={rule.id} className={!rule.enabled ? "opacity-50" : ""}>
                                                <TableCell>
                                                    <div className="flex items-center justify-center">
                                                        <Switch
                                                            checked={rule.enabled}
                                                            onCheckedChange={() => handleToggleRule(rule.id)}
                                                            aria-label="Toggle rule"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">{rule.chain}</Badge>
                                                </TableCell>
                                                <TableCell>{getActionBadge(rule.action)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-mono text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                                {rule.srcAddress}
                                                            </span>
                                                            <span className="text-muted-foreground text-xs">Source</span>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-mono text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded">
                                                                {rule.dstAddress}
                                                            </span>
                                                            <span className="text-muted-foreground text-xs">Destination</span>
                                                        </div>
                                                        <div className="ml-2 pl-2 border-l">
                                                            <span className="font-semibold">{rule.protocol.toUpperCase()}</span>
                                                            {rule.dstPort && <span className="text-muted-foreground">:{rule.dstPort}</span>}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{rule.comment}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(rule)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleOpenAlert(rule)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Add/Edit Rule Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{selectedRule ? "Edit Firewall Rule" : "Add New Firewall Rule"}</DialogTitle>
                        </DialogHeader>
                        <FirewallRuleForm
                            rule={selectedRule}
                            onSubmit={handleSubmitRule}
                            onCancel={handleCloseDialog}
                        />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the firewall rule.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCloseAlert}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteRule}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Activity Log */}
                <FirewallActivityLog refreshKey={logRefreshKey} />
            </div>
        </DashboardLayout>
    )
}
