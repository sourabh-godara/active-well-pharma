'use client'

import { useState, useEffect } from 'react'
import { getStoreSettings, updateStoreSettings, type StoreSettings } from '@/app/actions/admin/settings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [settings, setSettings] = useState<StoreSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        getStoreSettings().then(data => {
            setSettings(data)
            setLoading(false)
        }).catch(err => {
            toast.error('Failed to load settings')
            setLoading(false)
        })
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!settings) return

        setSaving(true)
        const result = await updateStoreSettings(settings)
        setSaving(false)

        if (result.success) {
            toast.success('Settings updated successfully')
        } else {
            toast.error(result.error || 'Failed to update settings')
        }
    }

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage global store configuration.
                </p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Charges</CardTitle>
                        <CardDescription>
                            Configure shipping cost and free shipping threshold.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="shipping_charge">Shipping Charge (₹)</Label>
                                <Input
                                    id="shipping_charge"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={settings?.shipping_charge ?? ''}
                                    onChange={(e) => setSettings(s => s ? { ...s, shipping_charge: Number(e.target.value) } : null)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (₹)</Label>
                                <Input
                                    id="free_shipping_threshold"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={settings?.free_shipping_threshold ?? ''}
                                    onChange={(e) => setSettings(s => s ? { ...s, free_shipping_threshold: Number(e.target.value) } : null)}
                                    required
                                />
                                <p className="text-sm text-muted-foreground">
                                    Orders with a merchandise subtotal above this amount (after discounts) will have shipping waived.
                                </p>
                            </div>
                            <Button type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
