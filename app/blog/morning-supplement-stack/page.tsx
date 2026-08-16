import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "The Morning Supplement Stack for All-Day Energy and Focus | ActiveWell Pharma",
    description:
        "A practical guide to building a simple morning nutrition routine for steady energy and focus without relying on an overwhelming supplement stack.",
    keywords: [
        "morning supplement stack",
        "energy supplements",
        "focus supplements",
        "morning wellness routine",
        "daily supplements",
        "nutrition for energy",
        "healthy morning routine",
    ],
    openGraph: {
        title: "The Morning Supplement Stack for All-Day Energy and Focus",
        description:
            "Learn how to build a simple, practical morning nutrition routine for steady energy and focus.",
        type: "article",
    },
};

const foundations = [
    {
        title: "Hydration",
        text: "Start the day with fluids. Good hydration is a simple first step toward feeling refreshed and supporting normal body function.",
        icon: "💧",
    },
    {
        title: "Protein",
        text: "A protein-rich breakfast can make your morning meal more satisfying and provides amino acids needed for normal body functions.",
        icon: "◉",
    },
    {
        title: "Whole-food nutrients",
        text: "Fruits, vegetables, whole grains, nuts, seeds, and legumes provide vitamins, minerals, fiber, and other beneficial compounds.",
        icon: "🌿",
    },
    {
        title: "Consistent routine",
        text: "Regular sleep, meals, hydration, and movement often matter more for daily energy than adding a long list of supplements.",
        icon: "☀️",
    },
];

const nutrients = [
    {
        title: "Vitamin B12",
        text: "Vitamin B12 supports normal energy-yielding metabolism, red blood cell formation, and nervous system function. People following vegetarian or vegan diets may need particular attention to reliable B12 sources.",
    },
    {
        title: "Vitamin D",
        text: "Vitamin D supports normal bones, muscles, and immune function. Whether supplementation is useful depends on factors such as diet, sun exposure, and individual nutritional status.",
    },
    {
        title: "Magnesium",
        text: "Magnesium contributes to normal energy metabolism and normal muscle and nervous system function. Food sources include nuts, seeds, legumes, and whole grains.",
    },
    {
        title: "Omega-3 fatty acids",
        text: "Omega-3 fatty acids are important components of a balanced diet. Fatty fish provide EPA and DHA, while flaxseed, chia seeds, and walnuts provide ALA.",
    },
];

export default function MorningSupplementStackArticle() {
    return (
        <main className="min-h-screen bg-background">
            <article>
                <header className="border-b border-border">
                    <div className="container-brand mx-auto max-w-4xl px-6 py-16 md:py-24">
                        <Link
                            href="/"
                            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to articles
                        </Link>

                        <div className="mb-6 flex flex-wrap items-center gap-4">
                            <span className="rounded-full bg-secondary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                                Wellness
                            </span>

                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                6 min read
                            </span>
                        </div>

                        <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight text-primary md:text-5xl lg:text-6xl">
                            The Morning Supplement Stack for All-Day Energy and
                            Focus
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                            Starting your day well does not have to mean taking
                            a handful of supplements. A thoughtful combination
                            of hydration, nutritious food, healthy habits, and
                            targeted nutrients can create a simple foundation
                            for steady energy and focus.
                        </p>
                    </div>
                </header>

                <div className="container-brand mx-auto max-w-5xl px-6 py-14 md:py-20">
                    <div className="mx-auto max-w-3xl">
                        <div className="space-y-16">
                            <div className="rounded-3xl border border-border bg-secondary/5 p-7 md:p-10">
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-secondary" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                                        A Smarter Morning Routine
                                    </span>
                                </div>

                                <p className="m-0 text-xl leading-9 text-foreground md:text-2xl md:leading-10">
                                    There is no magic supplement stack that can
                                    replace sleep, nutritious food, hydration,
                                    and regular movement. But when your diet
                                    has specific nutritional gaps, the right
                                    nutrients can complement a healthy routine.
                                </p>

                                <p className="mt-5 mb-0 text-base leading-7 text-muted-foreground">
                                    The goal is not to take more. It is to build
                                    a routine that is simple, sustainable, and
                                    appropriate for your individual needs.
                                </p>
                            </div>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">01</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Start with the basics
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Before thinking about supplements,
                                        build the foundation. Your energy
                                        throughout the day is influenced by
                                        sleep quality, food intake, hydration,
                                        physical activity, stress, and many
                                        other factors.
                                    </p>

                                    <p>
                                        A morning routine can be remarkably
                                        simple: drink some water, eat a
                                        balanced meal when appropriate, get
                                        some natural light, move your body, and
                                        then consider whether you actually need
                                        targeted supplementation.
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {foundations.map((item) => (
                                        <div
                                            key={item.title}
                                            className="rounded-2xl border border-border bg-background p-6"
                                        >
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-xl">
                                                {item.icon}
                                            </div>

                                            <h3 className="mb-2 text-lg font-semibold text-primary">
                                                {item.title}
                                            </h3>

                                            <p className="m-0 text-sm leading-6 text-muted-foreground">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="relative overflow-hidden rounded-3xl bg-primary px-7 py-9 md:px-12 md:py-12">
                                <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
                                <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

                                <div className="relative">
                                    <span className="mb-4 block text-4xl font-serif text-secondary">
                                        “
                                    </span>

                                    <p className="m-0 max-w-2xl font-serif text-2xl leading-9 text-white md:text-3xl md:leading-10">
                                        The best morning routine is one you can
                                        follow consistently—not the one with
                                        the longest supplement list.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">02</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Where supplements can fit in
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Supplements can be useful when they
                                        help fill a known nutritional gap or
                                        provide a nutrient that is difficult to
                                        obtain in adequate amounts from your
                                        usual diet.
                                    </p>

                                    <p>
                                        However, supplements should complement
                                        food rather than replace it. A
                                        nutritional supplement cannot recreate
                                        everything you get from a varied diet.
                                    </p>

                                    <p>
                                        Your ideal routine may contain no
                                        supplements, one targeted supplement,
                                        or several nutrients depending on your
                                        diet, lifestyle, age, and individual
                                        requirements.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">03</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Nutrients commonly considered in a morning
                                    routine
                                </h2>

                                <div className="space-y-4">
                                    {nutrients.map((item, index) => (
                                        <div
                                            key={item.title}
                                            className="flex gap-5 rounded-2xl border border-border bg-background p-6 md:p-7"
                                        >
                                            <span className="shrink-0 text-sm font-bold text-secondary">
                                                0{index + 1}
                                            </span>

                                            <div>
                                                <h3 className="mb-2 text-xl font-semibold text-primary">
                                                    {item.title}
                                                </h3>

                                                <p className="m-0 text-[15px] leading-7 text-muted-foreground">
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">04</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    What about caffeine and focus?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Coffee and tea are common parts of
                                        morning routines because they contain
                                        caffeine, which can temporarily
                                        increase alertness and reduce the
                                        perception of fatigue.
                                    </p>

                                    <p>
                                        Caffeine affects people differently.
                                        Too much, particularly later in the
                                        day, can interfere with sleep—which can
                                        undermine the energy and focus you are
                                        trying to improve.
                                    </p>

                                    <p>
                                        If you use caffeine, consider your
                                        total daily intake and your individual
                                        sensitivity. Water, a nutritious meal,
                                        and good sleep should remain the
                                        foundation.
                                    </p>
                                </div>

                                <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-6 md:p-8">
                                    <h3 className="mb-3 text-xl font-semibold text-primary">
                                        A useful rule
                                    </h3>

                                    <p className="m-0 text-base leading-7 text-muted-foreground">
                                        If a morning supplement routine is
                                        becoming complicated enough that you
                                        cannot maintain it consistently, it may
                                        be time to simplify it.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">05</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Build your simple morning stack
                                </h2>

                                <p className="text-[17px] leading-8 text-muted-foreground">
                                    Instead of copying someone else&apos;s
                                    supplement routine, use a simple framework
                                    and adapt it to your needs.
                                </p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    {[
                                        ["01", "Foundation", "Water + a balanced breakfast or nutritious first meal."],
                                        ["02", "Targeted support", "Add only nutrients that make sense for your diet or individual needs."],
                                        ["03", "Daily habits", "Prioritize sleep, movement, daylight, and stress management."],
                                    ].map(([number, title, text]) => (
                                        <div
                                            key={title}
                                            className="rounded-2xl border border-border bg-background p-6"
                                        >
                                            <span className="mb-5 block text-sm font-bold text-secondary">
                                                {number}
                                            </span>

                                            <h3 className="mb-2 text-lg font-semibold text-primary">
                                                {title}
                                            </h3>

                                            <p className="m-0 text-sm leading-6 text-muted-foreground">
                                                {text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">06</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    When you should talk to a professional
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        If you have persistent fatigue,
                                        difficulty concentrating, unexplained
                                        changes in weight, weakness, or other
                                        ongoing symptoms, it is better to
                                        investigate the underlying cause than
                                        to keep adding supplements.
                                    </p>

                                    <p>
                                        A qualified healthcare professional can
                                        review your diet, medications,
                                        lifestyle, and relevant medical
                                        history and determine whether testing
                                        or nutritional support is appropriate.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">07</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    The takeaway
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        A good morning supplement routine does
                                        not need to be complicated. Start with
                                        hydration, nutritious food, adequate
                                        sleep, movement, and a consistent daily
                                        rhythm.
                                    </p>

                                    <p>
                                        Supplements can have a place when they
                                        address a genuine nutritional need, but
                                        more is not automatically better.
                                        Choosing targeted support based on
                                        your individual circumstances is a
                                        more sensible approach than following
                                        a one-size-fits-all stack.
                                    </p>

                                    <p>
                                        Think of supplements as supporting
                                        players—not the foundation of your
                                        energy and focus.
                                    </p>
                                </div>
                            </section>

                            <aside className="rounded-2xl border border-border bg-muted/30 p-6">
                                <p className="m-0 text-xs leading-6 text-muted-foreground">
                                    <strong className="text-foreground">
                                        Disclaimer:
                                    </strong>{" "}
                                    This article is for general educational
                                    purposes only and is not intended to
                                    diagnose, treat, cure, or prevent any
                                    disease. Nutritional needs vary between
                                    individuals. Consult a qualified healthcare
                                    professional before starting a new
                                    supplement, especially if you take
                                    medication or have an underlying health
                                    condition.
                                </p>
                            </aside>
                        </div>
                    </div>
                </div>

                <footer className="border-t border-border">
                    <div className="container-brand mx-auto max-w-4xl px-6 py-12">
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 font-medium text-primary"
                        >
                            Explore more articles
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </footer>
            </article>
        </main>
    );
}