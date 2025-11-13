"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Edit, Trash2, Users, FileText } from "lucide-react"
import { dummyPppoeProfiles, dummyPppoeSecrets } from "@/lib/dummy-data"
import { ProfileForm } from "@/components/pppoe/ProfileForm"
import { SecretForm } from "@/components/pppoe/SecretForm"
import { PppoeProfile, pppoeProfileSchema, PppoeSecret, pppoeSecretSchema } from "@/lib/types"
import * as z from "zod"

const profileFormSchema = pppoeProfileSchema.omit({ id: true });
const secretFormSchema = pppoeSecretSchema.omit({ id: true, lastLoggedIn: true });

export default function PPPoEConfigPage() {
    const [profiles, setProfiles] = useState<PppoeProfile[]>([])
    const [secrets, setSecrets] = useState<PppoeSecret[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // State for dialogs
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isSecretDialogOpen, setIsSecretDialogOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)

    // State for selected items
    const [selectedProfile, setSelectedProfile] = useState<PppoeProfile | null>(null)
    const [selectedSecret, setSelectedSecret] = useState<PppoeSecret | null>(null)
    const [itemToDelete, setItemToDelete] = useState<{ type: 'profile' | 'secret', id: number } | null>(null)

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setProfiles(dummyPppoeProfiles)
            setSecrets(dummyPppoeSecrets)
            setIsLoading(false)
        }, 500)
    }, [])

    // Profile Handlers
    const handleProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
        const profile: PppoeProfile = { id: selectedProfile?.id || Date.now(), ...values }
        if (selectedProfile) {
            setProfiles(profiles.map(p => p.id === profile.id ? profile : p))
        } else {
            setProfiles([...profiles, profile])
        }
        setIsProfileDialogOpen(false)
    }

    // Secret Handlers
    const handleSecretSubmit = (values: z.infer<typeof secretFormSchema>) => {
        const secret: PppoeSecret = {
            id: selectedSecret?.id || Date.now(),
            lastLoggedIn: selectedSecret?.lastLoggedIn || 'Never',
            password: values.password || selectedSecret?.password, // Keep old password if new one is blank
            ...values,
        }
        if (selectedSecret) {
            setSecrets(secrets.map(s => s.id === secret.id ? secret : s))
        } else {
            setSecrets([...secrets, secret])
        }
        setIsSecretDialogOpen(false)
    }

    // Delete Handlers
    const handleDelete = () => {
        if (itemToDelete?.type === 'profile') {
            setProfiles(profiles.filter(p => p.id !== itemToDelete.id))
        } else if (itemToDelete?.type === 'secret') {
            setSecrets(secrets.filter(s => s.id !== itemToDelete.id))
        }
        setIsAlertOpen(false)
        setItemToDelete(null)
    }

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">PPPoE Configuration</h1>
                    <p className="text-sm text-muted-foreground">Manage PPPoE server profiles and user secrets.</p>
                </div>

                <Tabs defaultValue="profiles">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profiles">
                            <FileText className="w-4 h-4 mr-2" /> Profiles
                        </TabsTrigger>
                        <TabsTrigger value="secrets">
                            <Users className="w-4 h-4 mr-2" /> Secrets
                        </TabsTrigger>
                    </TabsList>

                    {/* Profiles Tab */}
                    <TabsContent value="profiles">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>PPPoE Profiles</CardTitle>
                                    <Button onClick={() => { setSelectedProfile(null); setIsProfileDialogOpen(true); }}>
                                        <PlusCircle className="w-4 h-4 mr-2" /> Add Profile
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Rate Limit</TableHead>
                                                <TableHead>Comment</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {profiles.map(profile => (
                                                <TableRow key={profile.id}>
                                                    <TableCell className="font-medium">{profile.name}</TableCell>
                                                    <TableCell><Badge variant="secondary">{profile.rateLimit}</Badge></TableCell>
                                                    <TableCell className="text-muted-foreground">{profile.comment}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedProfile(profile); setIsProfileDialogOpen(true); }}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setItemToDelete({ type: 'profile', id: profile.id }); setIsAlertOpen(true); }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Secrets Tab */}
                    <TabsContent value="secrets">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>PPPoE Secrets</CardTitle>
                                    <Button onClick={() => { setSelectedSecret(null); setIsSecretDialogOpen(true); }}>
                                        <PlusCircle className="w-4 h-4 mr-2" /> Add Secret
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Profile</TableHead>
                                                <TableHead>Last Logged In</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {secrets.map(secret => (
                                                <TableRow key={secret.id} className={secret.disabled ? "text-muted-foreground" : ""}>
                                                    <TableCell className="font-medium">{secret.username}</TableCell>
                                                    <TableCell>{secret.profile}</TableCell>
                                                    <TableCell>{secret.lastLoggedIn}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={secret.disabled ? "outline" : "default"}>
                                                            {secret.disabled ? "Disabled" : "Enabled"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedSecret(secret); setIsSecretDialogOpen(true); }}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setItemToDelete({ type: 'secret', id: secret.id }); setIsAlertOpen(true); }}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Dialogs */}
                <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedProfile ? "Edit Profile" : "Add New Profile"}</DialogTitle>
                        </DialogHeader>
                        <ProfileForm onSubmit={handleProfileSubmit} onCancel={() => setIsProfileDialogOpen(false)} profile={selectedProfile} />
                    </DialogContent>
                </Dialog>

                <Dialog open={isSecretDialogOpen} onOpenChange={setIsSecretDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedSecret ? "Edit Secret" : "Add New Secret"}</DialogTitle>
                        </DialogHeader>
                        <SecretForm onSubmit={handleSecretSubmit} onCancel={() => setIsSecretDialogOpen(false)} secret={selectedSecret} />
                    </DialogContent>
                </Dialog>

                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the item.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
}
