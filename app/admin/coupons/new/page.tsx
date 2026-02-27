'use client'

import { useActionState, useEffect } from 'react'
import { createCoupon } from '@/app/actions/apply-coupon'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full gap-2">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? 'Creating…' : 'Create Coupon'}
        </Button>
    )
}

const inputCls = 'h-9 text-sm'

export default function NewCouponPage() {
    const router = useRouter()
    const [state, action] = useActionState(
        async (_: any, formData: FormData) => createCoupon(formData),
        null
    )

    useEffect(() => {
        if (!state) return
        if (state.success) {
            toast.success('Coupon created!')
            router.push('/admin/coupons')
        } else {
            toast.error(state.error ?? 'Failed to create coupon')
        }
    }, [state, router])

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Coupon</h1>
                <p className="text-sm text-muted-foreground">Create a new discount code for your store</p>
            </div>

            <form action={action} className="space-y-6">
                {/* ── Section 1: Basic Info ───────────────────────── */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Coupon Details</CardTitle>
                        <CardDescription className="text-xs">Code and discount configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Code */}
                        <div>
                            <Label htmlFor="code" className="text-xs font-medium">
                                Coupon Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                name="code"
                                required
                                placeholder="e.g. SAVE20"
                                className={`${inputCls} mt-1 uppercase`}
                                style={{ textTransform: 'uppercase' }}
                                onInput={e => {
                                    const el = e.target as HTMLInputElement
                                    el.value = el.value.toUpperCase()
                                }}
                            />
                            <p className="text-[10px] text-muted-foreground mt-0.5">Auto-uppercased, must be unique</p>
                        </div>

                        {/* Discount Type + Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="discount_type" className="text-xs font-medium">
                                    Discount Type <span className="text-red-500">*</span>
                                </Label>
                                <Select name="discount_type" defaultValue="percentage" required>
                                    <SelectTrigger id="discount_type" className={`${inputCls} mt-1`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="discount_value" className="text-xs font-medium">
                                    Discount Value <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="discount_value"
                                    name="discount_value"
                                    type="number"
                                    required
                                    min={0.01}
                                    max={100000}
                                    step="0.01"
                                    placeholder="e.g. 10 or 200"
                                    className={`${inputCls} mt-1`}
                                />
                            </div>
                        </div>

                        {/* Min order + Max discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="min_order_amount" className="text-xs font-medium">Min Order (₹)</Label>
                                <Input
                                    id="min_order_amount"
                                    name="min_order_amount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="0"
                                    className={`${inputCls} mt-1`}
                                />
                            </div>
                            <div>
                                <Label htmlFor="max_discount_amount" className="text-xs font-medium">Max Discount (₹)</Label>
                                <Input
                                    id="max_discount_amount"
                                    name="max_discount_amount"
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Leave blank for no cap"
                                    className={`${inputCls} mt-1`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Section 2: Limits ─────────────────────────────── */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Usage Limits</CardTitle>
                        <CardDescription className="text-xs">Control how many times this coupon can be used</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="usage_limit" className="text-xs font-medium">Total Usage Limit</Label>
                                <Input
                                    id="usage_limit"
                                    name="usage_limit"
                                    type="number"
                                    min={1}
                                    placeholder="Unlimited"
                                    className={`${inputCls} mt-1`}
                                />
                                <p className="text-[10px] text-muted-foreground mt-0.5">Leave blank for unlimited</p>
                            </div>
                            <div>
                                <Label htmlFor="per_user_limit" className="text-xs font-medium">Per-User Limit</Label>
                                <Input
                                    id="per_user_limit"
                                    name="per_user_limit"
                                    type="number"
                                    min={1}
                                    placeholder="Unlimited"
                                    className={`${inputCls} mt-1`}
                                />
                                <p className="text-[10px] text-muted-foreground mt-0.5">Max uses per customer</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Section 3: Schedule + Status ─────────────────── */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Schedule & Status</CardTitle>
                        <CardDescription className="text-xs">When this coupon is valid</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="starts_at" className="text-xs font-medium">Valid From</Label>
                                <Input
                                    id="starts_at"
                                    name="starts_at"
                                    type="datetime-local"
                                    className={`${inputCls} mt-1`}
                                />
                            </div>
                            <div>
                                <Label htmlFor="expires_at" className="text-xs font-medium">Expires At</Label>
                                <Input
                                    id="expires_at"
                                    name="expires_at"
                                    type="datetime-local"
                                    className={`${inputCls} mt-1`}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is_active" className="text-sm font-medium">Active</Label>
                                <p className="text-[10px] text-muted-foreground">Enable this coupon immediately</p>
                            </div>
                            <Switch id="is_active" name="is_active" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push('/admin/coupons')}
                    >
                        Cancel
                    </Button>
                    <div className="flex-1">
                        <SubmitButton />
                    </div>
                </div>
            </form>
        </div>
    )
}
