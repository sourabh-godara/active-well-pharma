import { Droplets, FlaskConical, Recycle, Award } from "lucide-react";

const benefits = [
    {
        icon: Droplets,
        title: "100% Plant-Based",
        description: "Every ingredient sourced from nature's finest superfoods",
    },
    {
        icon: FlaskConical,
        title: "Clinically Proven",
        description: "Backed by science with visible results in 4-6 weeks",
    },
    {
        icon: Recycle,
        title: "Eco-Friendly",
        description: "Sustainable packaging that loves the planet as much as you",
    },
    {
        icon: Award,
        title: "Award Winning",
        description: "Recognized by top beauty & wellness publications",
    },
];

const Benefits = () => {
    return (
        <section className="section-padding bg-background">
            <div className="container-brand">
                <div className="text-center mb-14">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        Why Choose <span className="text-gradient-coral">PlixLife</span>?
                    </h2>
                    <p className="font-body text-muted-foreground max-w-lg mx-auto">
                        We're on a mission to make clean beauty accessible to everyone
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((item, i) => (
                        <div
                            key={item.title}
                            className="text-center p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors duration-300"
                        >
                            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-fresh flex items-center justify-center">
                                <item.icon className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Benefits;
