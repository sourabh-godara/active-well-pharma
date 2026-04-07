import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Mail } from "lucide-react";
import Link from "next/link";

const SocialMedia = [
    { name: "Instagram", href: "https://www.instagram.com/activewellpharma/", icon: Instagram },
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Youtube", href: "#", icon: Youtube },
]
const Footer = () => {
    return (
        <footer className="bg-foreground text-background">
            {/* Newsletter CTA */}
            <div className="section-padding pb-0">
                <div className="container-brand">
                    <div className="bg-gradient-fresh rounded-3xl p-8 md:p-12 text-center mb-16">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
                            Get 15% Off Your First Order
                        </h2>
                        <p className="font-body text-primary-foreground/80 mb-6 max-w-md mx-auto">
                            Subscribe for exclusive deals, new launches, and wellness tips
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-5 py-3 rounded-full bg-background text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <Button size="lg" className="rounded-full px-8">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer links */}
            <div className="container-brand px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2">
                            {["Skin Care", "Hair Care", "Wellness", "Combos", "New Arrivals"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="font-body text-sm text-background/60 hover:text-background transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">About</h3>
                        <ul className="space-y-2">
                            {["Our Story", "Ingredients", "Sustainability", "Blog", "Press"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="font-body text-sm text-background/60 hover:text-background transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {["FAQs", "Shipping", "Returns", "Contact Us", "Track Order"].map((link) => (
                                <li key={link}>
                                    <a href="#" className="font-body text-sm text-background/60 hover:text-background transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-semibold mb-4">Connect</h3>
                        <div className="flex gap-3 mb-6">
                            {SocialMedia.map((item, i) => (
                                <Link key={i} target="_blank" href={item.href} className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                                    <item.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                        <h3 className="font-display text-lg font-semibold mb-4 text-background/90">Address</h3>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-background/60 shrink-0 mt-0.5" />
                            <address className="font-body text-sm text-background/60 not-italic leading-relaxed">
                                <strong>Activewell Pharma</strong><br />
                                Saili Kullian, Near Kabir Mandir<br />
                                Pathankot, Tehsil Distt. Pathankot<br />
                                Punjab 145001, India
                            </address>
                        </div>
                    </div>
                </div>

                <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <a href="/" className="font-display text-2xl font-bold">
                        ActiveWell<span className="text-secondary">Pharma</span>
                    </a>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                        <a href="mailto:info@activewellpharma.com" className="flex items-center gap-2 font-body text-sm text-background/60 hover:text-background transition-colors">
                            <Mail className="w-4 h-4" />
                            info@activewellpharma.com
                        </a>
                        <p className="font-body text-xs text-background/40">
                            © 2026 ActiveWell Pharma. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
