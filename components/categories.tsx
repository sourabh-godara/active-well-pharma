import { Sparkles, Leaf, Heart, Sun } from "lucide-react";

const categories = [
    {
        icon: Sparkles,
        title: "Skin Care",
        description: "Glow-boosting formulas",
        bgClass: "bg-peach",
        iconColor: "bg-coral",
    },
    {
        icon: Leaf,
        title: "Hair Care",
        description: "Plant-powered strength",
        bgClass: "bg-mint",
        iconColor: "text-primary",
    },
    {
        icon: Heart,
        title: "Wellness",
        description: "Inside-out health",
        bgClass: "bg-lavender",
        iconColor: "text-secondary",
    },
    {
        icon: Sun,
        title: "Weight Care",
        description: "Natural metabolism boost",
        bgClass: "bg-sunshine/30",
        iconColor: "text-accent",
    },
];

const Categories = () => {
    return (
        <section className="section-padding bg-background">
            <div className="container-brand">
                <div className="text-center mb-14">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        Shop by <span className="text-gradient-coral">Concern</span>
                    </h2>
                    <p className="font-body text-muted-foreground max-w-lg mx-auto">
                        Find the perfect plant-based solution for your unique needs
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <a
                            key={cat.title}
                            href="#"
                            className="group flex flex-col items-center p-8 rounded-2xl transition-all duration-300 hover:shadow-hover hover:-translate-y-2 cursor-pointer"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className={`w-20 h-20 ${cat.bgClass} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                <cat.icon className={`w-9 h-9 ${cat.iconColor}`} />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground mb-1">{cat.title}</h3>
                            <p className="font-body text-sm text-muted-foreground">{cat.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
