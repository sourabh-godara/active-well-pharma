import type { Metadata } from "next";
import { FAQList } from "./faq-list";

export const metadata: Metadata = {
    title: "Frequently Asked Questions | ActiveWell Pharma",
    description: "Find answers to common questions about our products, shipping, returns, and more.",
};

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <section className="bg-primary pt-32 pb-24 md:pt-40 md:pb-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
                <div className="container-brand mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
                        Have a question? We're here to help. Browse our most common questions below or reach out to our team if you need more information.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 md:py-32 px-6">
                <div className="container-brand mx-auto max-w-3xl">
                    <FAQList />
                </div>
            </section>
        </main>
    );
}
