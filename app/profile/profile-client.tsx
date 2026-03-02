'use client'

import { Button } from "@/components/ui/button"
import { User, MapPin, Package, LogOut, Mail, Edit2 } from "lucide-react"
import { useState } from "react"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AddressesSection } from "@/components/addresses-section"
import type { Address } from "@/types/address"
import Link from "next/link"

type TabKey = "profile" | "addresses"

interface ProfileClientProps {
    profile: any
    addresses: Address[]
}

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "My Profile", icon: User },
    { key: "addresses", label: "Addresses", icon: MapPin },
]

export default function ProfileClient({ profile, addresses }: ProfileClientProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("profile")
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-background">
            <main className="container-brand section-padding">
                {/* Header card */}
                <div className="bg-gradient-hero rounded-3xl p-8 mb-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-fresh flex items-center justify-center text-primary-foreground font-display text-2xl font-bold shadow-product">
                        {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="font-display text-2xl font-bold text-foreground">{profile?.full_name || 'User'}</h1>
                        <p className="font-body text-sm text-muted-foreground">
                            Member since {new Date(profile?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start">
                            <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" /> {profile?.email}
                            </span>
                        </div>
                    </div>
                    <div className="sm:ml-auto flex gap-3">
                        <Link href="/orders">
                            <Button variant="outline" className="rounded-full font-body text-sm gap-2">
                                <Package className="w-4 h-4" /> My Orders
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="rounded-full font-body text-sm gap-2 text-secondary hover:text-secondary"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <nav className="bg-card rounded-2xl shadow-card p-4 space-y-1 sticky top-28">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all ${activeTab === tab.key
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {activeTab === "profile" && (
                            <div className="bg-card rounded-2xl shadow-card p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="font-display text-xl font-bold text-foreground">Personal Information</h2>
                                    <Button variant="outline" size="sm" className="rounded-full font-body text-xs gap-1.5">
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { label: "Full Name", value: profile?.full_name || 'N/A' },
                                        { label: "Email", value: profile?.email || 'N/A' },
                                        { label: "Role", value: profile?.role || 'User' },
                                    ].map((field) => (
                                        <div key={field.label}>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">{field.label}</p>
                                            <p className="font-body text-sm font-medium text-foreground">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <AddressesSection initialAddresses={addresses} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
