'use client'
import { useState } from "react";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";

const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Skin", href: "#" },
    { label: "Hair", href: "#" },
];

export const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { items } = useCart()
    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            {/* Top banner */}
            <div className="bg-gradient-fresh text-primary-foreground text-center text-xs sm:text-sm py-2 font-body font-medium tracking-wide">
                🌿 Free shipping on orders above ₹599 | Use code GLOW20 for 20% off
            </div>

            <nav className="container-brand flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                {/* Logo */}
                <a href="/" className="font-display text-xl sm:text-2xl font-bold text-primary tracking-tight">
                    ActiveWell<span className="text-secondary"> Pharma</span>
                </a>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Right icons */}
                <div className="flex items-center gap-3">
                    <button className="p-2 text-foreground/70 hover:text-primary transition-colors" aria-label="Search">
                        <Search className="w-5 h-5" />
                    </button>
                    <UserNav />
                    <Link href="/cart" className="p-2 text-foreground/70 hover:text-primary transition-colors relative" aria-label="Cart">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-0.5 bg-secondary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                {cartCount > 99 ? '99+' : cartCount}
                            </span>
                        )}
                    </Link>
                    <button
                        className="md:hidden p-2 text-foreground/70"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-background border-t border-border animate-fade-up">
                    <ul className="flex flex-col py-4 px-6 gap-4">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="font-body text-base font-medium text-foreground/80 hover:text-primary transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
};
