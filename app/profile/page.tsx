'use client'
import { Button } from "@/components/ui/button";
import {
    User, MapPin, CreditCard, Package, Heart, LogOut,
    ChevronRight, Mail, Phone, Edit2, Plus, Star
} from "lucide-react";
import { useState } from "react";
import Footer from "@/components/footer";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { useUser } from "../context/user-context";

type TabKey = "profile" | "addresses" | "wishlist" | "payments";

const ProfilePage = () => {
    const { profile, loading } = useUser();
    const [activeTab, setActiveTab] = useState<TabKey>("profile");

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if (!profile) return <div className="min-h-screen flex items-center justify-center">Please log in</div>

    const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
        { key: "profile", label: "My Profile", icon: User },
        { key: "addresses", label: "Addresses", icon: MapPin },
    ];

    return (
        <div className="min-h-screen max-w-7xl mx-auto bg-background">
            <main className="container-brand section-padding">
                {/* Header card */}
                <div className="bg-gradient-hero rounded-3xl p-8 mb-10 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-fresh flex items-center justify-center text-primary-foreground font-display text-2xl font-bold shadow-product">
                        {profile.full_name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="font-display text-2xl font-bold text-foreground">{profile.full_name || 'User'}</h1>
                        <p className="font-body text-sm text-muted-foreground">Member since {new Date(profile.created_at).toLocaleDateString()} · 🌿 Gold Tier</p>
                        <div className="flex items-center gap-4 mt-2 justify-center sm:justify-start">
                            <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>
                            {/* <span className="font-body text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> +91 98765 43210</span> */}
                        </div>
                    </div>
                    <div className="sm:ml-auto flex gap-3">
                        <Link href="/orders">
                            <Button variant="outline" className="rounded-full font-body text-sm gap-2">
                                <Package className="w-4 h-4" /> My Orders
                            </Button>
                        </Link>
                        <form action={logout}>
                            <Button variant="ghost" className="rounded-full font-body text-sm gap-2 text-secondary hover:text-secondary">
                                <LogOut className="w-4 h-4" /> Logout
                            </Button>
                        </form>
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
                                        { label: "Full Name", value: profile.full_name || 'N/A' },
                                        { label: "Email", value: profile.email || 'N/A' },
                                        // { label: "Phone", value: "+91 98765 43210" },
                                        // { label: "Date of Birth", value: "March 15, 1995" },
                                        { label: "Role", value: profile.role || 'User' },
                                        { label: "Loyalty Tier", value: "🌿 Gold Member" },
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
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-display text-xl font-bold text-foreground">Saved Addresses</h2>
                                    <Button variant="hero" size="sm" className="rounded-full font-body text-xs gap-1.5">
                                        <Plus className="w-3.5 h-3.5" /> Add New
                                    </Button>
                                </div>
                                {[
                                    { type: "Home", address: "34, Amayra-Greens, Mohali, Punjab - 140301", default: true },
                                ].map((addr) => (
                                    <div key={addr.type} className={`bg-card rounded-2xl shadow-card p-6 border-2 ${addr.default ? "border-primary" : "border-transparent"}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-body text-sm font-semibold text-foreground">{addr.type}</span>
                                                    {addr.default && (
                                                        <span className="bg-primary/10 text-primary font-body text-[10px] font-bold px-2 py-0.5 rounded-full">Default</span>
                                                    )}
                                                </div>
                                                <p className="font-body text-sm text-muted-foreground">{addr.address}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="font-body text-xs text-muted-foreground">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* {activeTab === "wishlist" && (
                            <div>
                                <h2 className="font-display text-xl font-bold text-foreground mb-6">My Wishlist</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                    {[
                                        { name: "Green Detox Elixir", price: "₹1,199", image: product1, rating: 4.8 },
                                        { name: "Acai Biotin Hair", price: "₹1,299", image: product4, rating: 4.8 },
                                    ].map((p) => (
                                        <div key={p.name} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
                                            <div className="relative aspect-square bg-muted overflow-hidden">
                                                <Image src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <button className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                                                    <Heart className="w-4 h-4 fill-secondary text-secondary" />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-display text-sm font-semibold text-foreground mb-1">{p.name}</h3>
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <Star className="w-3.5 h-3.5 fill-sunshine text-sunshine" />
                                                    <span className="font-body text-xs font-semibold">{p.rating}</span>
                                                </div>
                                                <p className="font-body text-base font-bold text-foreground mb-3">{p.price}</p>
                                                <Button variant="hero" size="sm" className="w-full rounded-full font-body text-xs">
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}


                    </div>
                </div>
            </main>

        </div>
    );
};

export default ProfilePage;
