import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
    Sparkles,
    Globe2,
    ShieldCheck,
    FlaskConical,
    Truck,
    GraduationCap,
    Award,
} from "lucide-react";

const leadership = [
    {
        name: "Chand Kapila",
        role: "Founder & CEO",
        initials: "CK",
        bio: "A registered pharmacist with over 8 years of diverse experience, Chand is the visionary behind ActiveWell. His background includes 5 years in pharmaceutical marketing and 3 years in international operations at Heathrow Airport, London — a blend that gives him a global perspective on quality and a deep understanding of Indian consumer needs.",
    },
    {
        name: "Tanvi",
        role: "Co-Director",
        initials: "T",
        bio: "Tanvi holds a Master's in Pharmacy Practice and is GPAT qualified, bringing 3 years of invaluable experience from the UK pharmaceutical sector. Her expertise in international brand management, regulatory compliance, and pharmacy operations keeps ActiveWell aligned with the most stringent global standards.",
    },
    {
        name: "Harjit Singh",
        role: "National Sales Head & Quality Control Specialist",
        initials: "HS",
        bio: "With an M.Pharm in Pharmaceutics and GPAT qualification, Harjit is the guardian of our product excellence. He leads our R&D initiatives and enforces rigorous quality control protocols, ensuring every product is optimized for performance, purity, and consistency.",
    },
];

const visionPillars = [
    {
        icon: FlaskConical,
        title: "Innovation",
        description: "Continuously expanding our product portfolio with cutting-edge, research-backed nutraceuticals.",
    },
    {
        icon: Truck,
        title: "Accessibility",
        description: "Building a robust distribution network to make our products easily available across the nation.",
    },
    {
        icon: GraduationCap,
        title: "Education",
        description: "Empowering consumers with knowledge about preventive health and holistic wellness.",
    },
    {
        icon: Globe2,
        title: "Global Standards",
        description: "Maintaining our commitment to international quality benchmarks as we grow.",
    },
];

const About = () => {
    return (
        <main className="min-h-screen bg-background selection:bg-primary/20">
            {/* Page header */}
            <section className="relative bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
                <div className="container-brand mx-auto px-6 flex flex-col items-center text-center pt-32 pb-24 lg:pt-48 lg:pb-36 z-10 relative">
                    <span className="inline-block font-body text-xs font-medium text-green-300/80 tracking-[0.2em] uppercase mb-8 animate-fade-up">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05] text-balance max-w-4xl tracking-tight">
                        Where Wellness is Our{" "}
                        <span className="text-green-300 italic">Active Mission</span>
                    </h1>
                    <p
                        className="font-body text-lg md:text-xl text-white/70 max-w-2xl mt-10 leading-relaxed font-light animate-fade-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Bridging ancient holistic wisdom and modern scientific innovation —
                        based in Pathankot, Punjab, built for the whole of India.
                    </p>
                </div>
            </section>

            {/* Mission statement */}
            <section className="bg-background py-24 lg:py-40">
                <div className="container-brand mx-auto px-6 grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    <div className="lg:col-span-5">
                        <span className="inline-block font-body text-xs font-medium text-muted-foreground tracking-[0.2em] uppercase mb-8">
                            Our Mission
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight text-balance">
                            Redefining wellness,{" "}
                            <span className="text-primary italic">rooted in trust.</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-7 lg:pt-12">
                        <div className="max-w-2xl">
                            <p className="font-body text-xl md:text-2xl text-foreground/90 leading-relaxed font-light">
                                At ActiveWell Pharma, we are on a mission to redefine wellness in
                                India by bridging the gap between ancient holistic wisdom and
                                modern scientific innovation. Based in Pathankot, Punjab, we
                                develop and deliver high-quality, evidence-based nutraceutical
                                products designed to meet the evolving health needs of Indian
                                consumers.
                            </p>
                            <p className="font-body text-lg text-muted-foreground leading-relaxed mt-8 font-light">
                                Our foundation is built on a commitment to{" "}
                                <strong className="text-foreground font-medium">
                                    safety, efficacy, and transparency
                                </strong>
                                . We believe that true wellness is accessible, and we are
                                dedicated to making it a reality through rigorously tested,
                                scientifically formulated supplements.
                            </p>

                            <div className="flex flex-wrap items-center gap-8 mt-16 pt-12 border-t border-border/50">
                                {["100% Plant-Based", "Clinically Tested", "FSSAI Certified"].map(
                                    (badge) => (
                                        <div
                                            key={badge}
                                            className="flex items-center gap-3"
                                        >
                                            <ShieldCheck className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
                                            <span className="text-sm text-muted-foreground font-medium tracking-wide">
                                                {badge}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="bg-[#FAFAFA] py-24 lg:py-40 border-y border-border/40">
                <div className="container-brand mx-auto px-6">
                    <div className="max-w-3xl mx-auto mb-20 md:text-center">
                        <span className="inline-block font-body text-xs font-medium text-muted-foreground tracking-[0.2em] uppercase mb-8">
                            Leadership
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight">
                            A Fusion of{" "}
                            <span className="text-primary italic">Global Expertise</span> &amp; Local Insight
                        </h2>
                        <p className="font-body text-lg text-muted-foreground mt-8 font-light leading-relaxed max-w-2xl mx-auto">
                            Our strength lies in a leadership team whose combined experience
                            keeps us at global standards while staying deeply connected to
                            our local market.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {leadership.map((person, i) => (
                            <div
                                key={person.name}
                                className="group flex flex-col bg-white rounded-2xl p-8 lg:p-10 border border-black/[0.03] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_40px_-4px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 animate-fade-up"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            >
                                <div className="w-20 h-20 rounded-full bg-muted/30 text-muted-foreground/50 font-serif text-2xl flex items-center justify-center mb-10 group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-500">
                                    {person.initials}
                                </div>
                                <h3 className="font-serif text-2xl lg:text-3xl text-foreground mb-3 tracking-tight">
                                    {person.name}
                                </h3>
                                <p className="font-body text-xs font-medium text-primary tracking-[0.15em] uppercase mb-6">
                                    {person.role}
                                </p>
                                <p className="font-body text-base text-muted-foreground leading-relaxed font-light">
                                    {person.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Future vision */}
            <section className="bg-background py-24 lg:py-40">
                <div className="container-brand mx-auto px-6">
                    <div className="max-w-2xl mb-20 lg:mb-32">
                        <span className="inline-block font-body text-xs font-medium text-muted-foreground tracking-[0.2em] uppercase mb-8">
                            Looking Ahead
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1] tracking-tight">
                            Our Future <span className="text-primary italic">Vision</span>
                        </h2>
                        <p className="font-body text-lg text-muted-foreground mt-8 font-light leading-relaxed">
                            We are not just a company; we are a movement towards a healthier
                            India.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 lg:gap-x-24 lg:gap-y-20">
                        {visionPillars.map(({ icon: Icon, title, description }, i) => (
                            <div
                                key={title}
                                className="group flex flex-col border-t border-border/40 pt-10 animate-fade-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <Icon className="w-8 h-8 text-primary/80 mb-8" strokeWidth={1.5} />
                                <h3 className="font-serif text-2xl lg:text-3xl text-foreground mb-4 tracking-tight">
                                    {title}
                                </h3>
                                <p className="font-body text-lg text-muted-foreground leading-relaxed font-light max-w-lg">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="bg-primary py-32 lg:py-48 flex flex-col items-center justify-center text-center">
                <div className="container-brand mx-auto px-6 max-w-4xl flex flex-col items-center">
                    <Award className="w-10 h-10 text-green-300/80 mb-10" strokeWidth={1} />
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] tracking-tight text-balance mb-14">
                        Welcome to ActiveWell Pharma —{" "}
                        <span className="text-white/70 italic font-light">
                            where your wellness is our active mission.
                        </span>
                    </h2>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-sm px-10 py-7 rounded-full bg-transparent border-white/20 text-white hover:bg-white hover:text-primary transition-all duration-300 font-medium tracking-[0.1em] uppercase"
                    >
                        Shop Bestsellers
                    </Button>
                </div>
            </section>


            <Footer />
        </main>
    );
};

export default About;