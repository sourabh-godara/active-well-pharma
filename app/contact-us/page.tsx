import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
    title: "Contact Us | ActiveWell Pharma",
    description: "Get in touch with ActiveWell Pharma. We're here to answer your questions and listen to your feedback.",
};

export default function ContactUsPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary/20">
            {/* ── 1. Hero Section ────────────────────────────── */}
            <section className="relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
                <div className="container-brand mx-auto px-6 flex flex-col items-center text-center pt-32 pb-24 lg:pt-40 lg:pb-32 z-10 relative">
                    <span className="inline-block font-body text-xs font-medium text-green-300/80 tracking-[0.2em] uppercase mb-6 animate-fade-up">
                        Let's Talk
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] text-balance max-w-3xl tracking-tight">
                        We're here to help you <span className="text-green-300 italic">live well.</span>
                    </h1>
                    <p
                        className="font-body text-lg text-white/70 max-w-xl mt-8 leading-relaxed font-light animate-fade-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Whether you have a question about our products, an order, or just want to say hello, we'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* ── 2. Contact Content ─────────────────────────── */}
            <section className="bg-background py-20 lg:py-32">
                <div className="container-brand mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                        {/* Left: Contact Info */}
                        <div className="lg:col-span-5 space-y-12">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-serif text-foreground leading-[1.15] tracking-tight mb-4">
                                    Get in Touch
                                </h2>
                                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                                    Our team is dedicated to providing you with the best possible support. Reach out to us through any of the channels below.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {/* Address */}
                                <div className="flex items-start gap-5">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground tracking-wide uppercase mb-1">
                                            Visit Us
                                        </h3>
                                        <address className="not-italic text-muted-foreground leading-relaxed">
                                            ActiveWell Pharma Private Limited<br />
                                            Saili Kullian, Near Kabir Mandir<br />
                                            Pathankot, Punjab 145001<br />
                                            India
                                        </address>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-5">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground tracking-wide uppercase mb-1">
                                            Call Us
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            <a href="tel:+918988166661" className="hover:text-primary transition-colors">
                                                +91-8988166661
                                            </a>
                                        </p>
                                        <p className="text-sm text-muted-foreground/70 mt-1">
                                            Mon - Sat, 9:00 AM - 6:00 PM
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-5">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground tracking-wide uppercase mb-1">
                                            Email Us
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            <a href="mailto:info@activewellpharma.com" className="hover:text-primary transition-colors">
                                                info@activewellpharma.com
                                            </a>
                                        </p>
                                        <p className="text-sm text-muted-foreground/70 mt-1">
                                            We aim to reply within 24 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact Form */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-border">
                                <ContactForm />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
