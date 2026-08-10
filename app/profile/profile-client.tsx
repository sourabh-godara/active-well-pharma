'use client'

import { Button } from "@/components/ui/button"
import { User, LogOut, Package, Shield, Lock, Trash2, Home, MapPin, MoreVertical, Edit2, Mail } from "lucide-react"
import { useState, useTransition } from "react"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AddressesSection } from "@/components/addresses-section"
import type { Address } from "@/types/address"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { updatePassword, deleteAccount } from "@/app/actions/profile"

type TabKey = "profile" | "password" | "delete"

interface ProfileClientProps {
    profile: any
    addresses: Address[]
}

export default function ProfileClient({ profile, addresses }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("profile")
    const router = useRouter()
    const supabase = createClient()
    const [isPending, startTransition] = useTransition()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const res = await updatePassword(formData)
            if (res.success) {
                toast.success('Password updated successfully.')
                e.currentTarget.reset()
            } else {
                toast.error(res.error || 'Failed to update password.')
            }
        })
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) return
        startTransition(async () => {
            const res = await deleteAccount()
            if (res.success) {
                toast.success('Account deleted.')
                router.push('/')
            } else {
                toast.error(res.error || 'Failed to delete account.')
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                
                {/* Header Banner */}
                <div className="bg-[#0f3d24] rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 relative overflow-hidden text-white shadow-md">
                    {/* Leaf background texture effect - abstract SVG */}
                    <svg className="absolute top-0 right-0 h-full opacity-10 pointer-events-none" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M400 0C400 0 200 50 150 200C100 350 0 400 0 400C0 400 200 350 250 200C300 50 400 0 400 0Z" fill="currentColor"/>
                        <path d="M350 0C350 0 150 100 100 250C50 400 -50 450 -50 450C-50 450 150 400 200 250C250 100 350 0 350 0Z" fill="currentColor"/>
                    </svg>

                    <div className="w-20 h-20 rounded-full bg-green-500/80 flex items-center justify-center font-display text-2xl font-bold shadow-lg z-10 shrink-0">
                        {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="text-center sm:text-left z-10 flex-1">
                        <h1 className="font-display text-2xl font-bold">{profile?.full_name || 'User'}</h1>
                        <p className="text-sm text-green-100/80 mt-1">
                            Member since {new Date(profile?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-sm text-green-100/90">
                            <Mail className="w-4 h-4" /> {profile?.email}
                        </div>
                    </div>
                    <div className="sm:ml-auto flex items-center gap-4 z-10">
                        <Link href="/orders">
                            <Button variant="secondary" className="rounded-full bg-white text-gray-900 hover:bg-gray-100 font-medium text-sm gap-2">
                                <Package className="w-4 h-4" /> My Orders
                            </Button>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-1.5 text-sm font-medium text-green-300 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                    activeTab === "profile"
                                        ? "bg-green-50 text-green-700 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <User className="w-4 h-4" />
                                Profile & Address
                            </button>

                            <div className="pt-4 pb-2 px-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Security</p>
                            </div>
                            <button
                                onClick={() => setActiveTab("password")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                    activeTab === "password"
                                        ? "bg-gray-100 text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                <Lock className="w-4 h-4" />
                                Change Password
                            </button>

                            <div className="pt-4 pb-2 px-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</p>
                            </div>
                            <button
                                onClick={() => setActiveTab("delete")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                    activeTab === "delete"
                                        ? "bg-red-50 text-red-700 shadow-sm"
                                        : "text-red-600 hover:bg-red-50"
                                }`}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </nav>

                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
                            <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-sm text-gray-900">Your data is safe with us</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    We use industry-standard security measures to protect your data.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-bold text-lg text-gray-900">Personal Information</h2>
                                        <Button variant="outline" size="sm" className="rounded-full h-8 text-xs gap-1.5 border-gray-200">
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">Full Name</label>
                                            <Input readOnly value={profile?.full_name || ''} className="bg-gray-50 border-gray-200 text-gray-700" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">Email Address</label>
                                            <Input readOnly value={profile?.email || ''} className="bg-gray-50 border-gray-200 text-gray-700" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">Member Since</label>
                                            <Input readOnly value={new Date(profile?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} className="bg-gray-50 border-gray-200 text-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                {/* Addresses */}
                                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                    <MapPin className="w-3.5 h-3.5 text-green-700" />
                                                </div>
                                                Address
                                            </h2>
                                            <p className="text-sm text-gray-500 mt-1 ml-8">Manage your default address for deliveries</p>
                                        </div>
                                    </div>
                                    <AddressesSection initialAddresses={addresses} />
                                </div>
                            </div>
                        )}

                        {activeTab === "password" && (
                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                                <h2 className="font-bold text-lg text-gray-900 mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">New Password</label>
                                        <Input name="newPassword" type="password" required minLength={6} placeholder="Enter new password" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                        <Input name="confirmPassword" type="password" required minLength={6} placeholder="Confirm new password" />
                                    </div>
                                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto mt-2">
                                        {isPending ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </form>
                            </div>
                        )}

                        {activeTab === "delete" && (
                            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-red-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg text-red-700 mb-1">Delete Account</h2>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <Button 
                                            variant="destructive" 
                                            onClick={handleDeleteAccount}
                                            disabled={isPending}
                                            className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:text-red-800"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            {isPending ? 'Deleting...' : 'Delete Account'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <p>Need help? Contact our support team at <span className="font-semibold text-green-700">support@activewellpharma.com</span></p>
                </div>
            </div>
        </div>
    )
}
