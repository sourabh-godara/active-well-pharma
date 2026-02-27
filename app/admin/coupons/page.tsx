import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CouponActions } from './coupon-actions'

export const metadata = {
    title: 'Coupons | Admin',
}

export default async function AdminCouponsPage() {
    const supabase = createAdminClient()
    const { data: coupons } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Coupons</h1>
                    <p className="text-sm text-muted-foreground">Manage discount codes for the store</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/admin/coupons/new">
                        <Plus className="h-4 w-4" />
                        New Coupon
                    </Link>
                </Button>
            </div>

            {/* Table */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                        All Coupons ({coupons?.length ?? 0})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Per User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!coupons || coupons.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                                        No coupons yet.{' '}
                                        <Link href="/admin/coupons/new" className="text-indigo-600 hover:underline">
                                            Create one →
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coupons.map(coupon => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="pl-6 font-mono font-semibold text-sm">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-xs capitalize">
                                                {coupon.discount_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {coupon.discount_type === 'percentage'
                                                ? `${coupon.discount_value}%`
                                                : `₹${Number(coupon.discount_value).toLocaleString('en-IN')}`
                                            }
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {coupon.used_count}
                                            {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ' / ∞'}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {coupon.per_user_limit ?? '∞'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={coupon.is_active
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}
                                            >
                                                {coupon.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {coupon.expires_at
                                                ? new Date(coupon.expires_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })
                                                : '—'
                                            }
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <CouponActions
                                                id={coupon.id}
                                                isActive={coupon.is_active}
                                                code={coupon.code}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
