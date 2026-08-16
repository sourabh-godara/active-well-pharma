"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
    {
        category: "Products & Ingredients",
        items: [
            {
                question: "Are your products formulated with plant-based ingredients?",
                answer: "Yes, many of our products utilize plant-based components. We prioritize high-quality, scientifically supported ingredients to support your overall wellness."
            },
            {
                question: "Do you use artificial colors or preservatives?",
                answer: "We strive to keep our formulas as clean as possible, avoiding unnecessary artificial colors and preservatives while maintaining product efficacy and safety."
            },
            {
                question: "How should I store my supplements?",
                answer: "Most of our supplements should be stored in a cool, dry place away from direct sunlight. Please check the label on your specific product for precise storage instructions."
            }
        ]
    },
    {
        category: "Shipping & Orders",
        items: [
            {
                question: "How long does shipping usually take?",
                answer: "Standard shipping within India typically takes 3-5 business days. Once your order has shipped, you will receive a tracking link via text."
            },
            {
                question: "Do you ship internationally?",
                answer: "Currently, we only ship within India. We hope to expand our shipping options in the future."
            },
            {
                question: "Can I modify or cancel my order after placing it?",
                answer: "We process orders quickly to ensure fast delivery. If you need to make changes or cancel, please contact our support team immediately at info@activewellpharma.com. Once an order has shipped, it cannot be modified."
            }
        ]
    },
    {
        category: "Returns & Refunds",
        items: [
            {
                question: "What is your return policy?",
                answer: "We offer a return policy for unopened items in their original packaging within a specific timeframe. Please refer to our Refund & Cancellation Policy page for detailed instructions."
            },
            {
                question: "What should I do if my item arrives damaged?",
                answer: "If your order arrives damaged, please reach out to us at info@activewellpharma.com within 48 hours of delivery with photos of the damaged item and packaging so we can assist you."
            }
        ]
    }
];

export function FAQList() {
    const [openIndex, setOpenIndex] = useState<string | null>("0-0");

    const toggleFAQ = (id: string) => {
        setOpenIndex((prev) => (prev === id ? null : id));
    };

    return (
        <div className="space-y-12">
            {FAQS.map((category, catIndex) => (
                <div key={category.category}>
                    <h2 className="text-2xl font-serif text-primary mb-6 border-b border-border pb-4">
                        {category.category}
                    </h2>
                    <div className="space-y-4">
                        {category.items.map((faq, itemIndex) => {
                            const id = `${catIndex}-${itemIndex}`;
                            const isOpen = openIndex === id;

                            return (
                                <div
                                    key={itemIndex}
                                    className={`border border-border rounded-2xl overflow-hidden transition-colors ${isOpen ? "bg-secondary/5 border-secondary/20" : "bg-white hover:border-primary/20"
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(id)}
                                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="font-semibold text-foreground md:text-lg">
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
                                                }`}
                                        />
                                    </button>
                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <p className="text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className="bg-muted/40 rounded-3xl p-8 text-center mt-16">
                <h3 className="text-xl font-semibold text-primary mb-3">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">Our support team is always ready to help.</p>
                <a
                    href="/contact-us"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                    Contact Us
                </a>
            </div>
        </div>
    );
}
