import { Sparkles, Leaf, Heart, Sun } from "lucide-react";

const categories = [
    {
        icon: Sparkles,
        title: "Skin Care",
        description: "Glow-boosting formulas",
        tileBg: "bg-[#fde8e2]",       // soft peach
        iconColor: "text-[#e8614a]",   // coral/red
    },
    {
        icon: Leaf,
        title: "Hair Care",
        description: "Plant-powered strength",
        tileBg: "bg-[#d8f0e8]",        // soft mint
        iconColor: "text-[#3aab76]",   // green
    },
    {
        icon: Heart,
        title: "Wellness",
        description: "Inside-out health",
        tileBg: "bg-[#ecdff9]",        // soft lavender
        iconColor: "text-[#a259e6]",   // purple
    },
    {
        icon: Sun,
        title: "Weight Care",
        description: "Natural metabolism boost",
        tileBg: "bg-[#fef5d4]",        // soft yellow
        iconColor: "text-[#d4a017]",   // golden
    },
];

const Categories = () => {
    return (
        <section className="py-28 px-8 bg-white">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Shop by{" "}
                        <span className="text-[#e8614a]">Concern</span>
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Find the perfect plant-based solution for your unique needs
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <a
                            key={cat.title}
                            href="#"
                            className="group flex flex-col items-center text-center py-6 px-4 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-md cursor-pointer"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Icon tile */}
                            <div
                                className={`w-20 h-20 ${cat.tileBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                            >
                                <cat.icon className={`w-9 h-9 ${cat.iconColor}`} strokeWidth={1.8} />
                            </div>

                            {/* Title */}
                            <h3 className="font-display text-base font-mono font-semibold text-gray-900 mb-1">
                                {cat.title}
                            </h3>

                            {/* Subtitle */}
                            <p className="text-gray-500 text-xs sm:text-sm">
                                {cat.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
