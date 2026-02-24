import { Star } from "lucide-react";

const Testimonials = () => {
    const reviews = [
        { name: "Priya S.", text: "My skin has never looked better! The Green Detox Elixir is a game changer.", rating: 5, product: "Green Detox Elixir" },
        { name: "Ananya R.", text: "I love that everything is plant-based. The Berry Collagen made my skin plump in just 3 weeks!", rating: 5, product: "Berry Collagen Boost" },
        { name: "Meera K.", text: "Finally found supplements that actually work. My hair fall reduced by 60%!", rating: 5, product: "Acai Biotin Hair" },
    ];

    return (
        <section className="section-padding bg-gradient-hero">
            <div className="container-brand">
                <div className="text-center mb-14">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        Real People, <span className="text-gradient-fresh">Real Results</span>
                    </h2>
                    <p className="font-body text-muted-foreground">Join our community of 10L+ glowing customers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-hover transition-shadow duration-300">
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: review.rating }).map((_, j) => (
                                    <Star key={j} color='orange' fill='orange' className="w-3.5 h-3.5 text-sunshine" />
                                ))}
                            </div>
                            <p className="font-body text-foreground/80 mb-6 leading-relaxed">"{review.text}"</p>
                            <div className="border-t border-border pt-4">
                                <p className="font-body font-semibold text-foreground text-sm">{review.name}</p>
                                <p className="font-body text-xs text-muted-foreground">Verified Buyer · {review.product}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
