import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-hero">
            <div className="container-brand section-padding flex flex-col lg:flex-row items-center gap-12">
                {/* Text content */}
                <div className="flex-1 text-center lg:text-left z-10">
                    <span className="inline-block font-body text-sm font-semibold text-secondary tracking-widest uppercase mb-4 animate-fade-up">
                        Plant-Based Beauty
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        Glow From
                        <br />
                        <span className="text-gradient-fresh">Within</span> ✨
                    </h1>
                    <p className="font-body text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                        Discover plant-powered supplements for radiant skin, luscious hair, and total wellness. 100% natural, 100% effective.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.3s" }}>
                        <Button variant="hero" size="lg" className="text-base px-8 py-6">
                            Shop Bestsellers
                        </Button>
                        <Button variant="coral" size="lg" className="text-base px-8 py-6">
                            Take the Quiz
                        </Button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start animate-fade-up" style={{ animationDelay: "0.4s" }}>
                        {["100% Vegan", "Clinically Tested", "No Chemicals"].map((badge) => (
                            <span key={badge} className="font-body text-xs font-medium text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
                                ✅ {badge}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hero image */}
                <div className="flex-1 relative animate-scale-in">
                    <div className="relative rounded-3xl overflow-hidden shadow-hover">
                        <Image
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"
                            alt="Colorful superfoods and wellness products"
                            className="object-cover w-"
                            fill

                            loading="eager"
                        />
                    </div>
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-sunshine/40 rounded-full blur-2xl animate-float" />
                    <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
                </div>
            </div>
        </section>
    );
};

export default Hero;
