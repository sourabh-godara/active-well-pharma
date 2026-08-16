import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "Biotin vs. Collagen: Which Should You Take for Hair Growth? | ActiveWell Pharma",
    description:
        "Biotin and collagen are popular supplements for hair health, but they work differently. Learn what the evidence says and how nutrition can support healthy hair.",
    keywords: [
        "biotin vs collagen",
        "biotin for hair growth",
        "collagen for hair",
        "hair health",
        "hair growth supplements",
        "biotin benefits",
        "collagen benefits",
    ],
    openGraph: {
        title: "Biotin vs. Collagen: Which Should You Take for Hair Growth?",
        description:
            "Understand the differences between biotin and collagen and learn how nutrition can support healthy-looking hair.",
        type: "article",
    },
};

const nutrients = [
    {
        title: "Protein",
        text: "Hair is primarily made from keratin, a protein. Adequate dietary protein supports normal tissue maintenance.",
        icon: "✦",
    },
    {
        title: "Iron & Zinc",
        text: "Both are important nutrients, and inadequate intake can be associated with hair problems.",
        icon: "◈",
    },
    {
        title: "Biotin",
        text: "Important for normal metabolism, with supplementation generally most relevant when intake or status is inadequate.",
        icon: "B",
    },
    {
        title: "Balanced diet",
        text: "Fruits, vegetables, whole grains, legumes, nuts, seeds, and protein provide a broad range of nutrients.",
        icon: "🌱",
    },
];

export default function BiotinVsCollagenArticle() {
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
                            <span className="rounded-full bg-coral/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-coral">
                                Hair Care
                            </span>

                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                4 min read
                            </span>
                        </div>

                        <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight text-primary md:text-5xl lg:text-6xl">
                            Biotin vs. Collagen: Which Should You Take for Hair
                            Growth?
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                            Both are popular for hair health—but they work
                            differently. Understanding their roles can help you
                            make more informed choices about nutrition and
                            healthy-looking hair.
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
                                        The Science of Healthy Hair
                                    </span>
                                </div>

                                <p className="m-0 text-xl leading-9 text-foreground md:text-2xl md:leading-10">
                                    When hair starts looking thinner, weaker, or
                                    more brittle, supplements can seem like an
                                    easy solution. Biotin and collagen are two
                                    of the most popular nutrients associated
                                    with hair health, but they are not
                                    interchangeable.
                                </p>

                                <p className="mt-5 mb-0 text-base leading-7 text-muted-foreground">
                                    The right approach depends on your
                                    nutritional needs, the possible cause of
                                    your hair concerns, and what the available
                                    evidence actually tells us.
                                </p>
                            </div>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">01</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    What does biotin do?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Biotin, also known as vitamin B7, is a
                                        water-soluble B vitamin that helps the
                                        body process carbohydrates, fats, and
                                        proteins.
                                    </p>

                                    <p>
                                        It is often associated with healthy
                                        hair, skin, and nails because severe
                                        biotin deficiency can cause hair
                                        thinning or hair loss. However,
                                        deficiency is uncommon in otherwise
                                        healthy people, and there is limited
                                        evidence that taking additional
                                        biotin improves hair growth when
                                        someone is not deficient.
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-border bg-background p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                                            🥚
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-primary">
                                            Food sources
                                        </h3>
                                        <p className="m-0 text-sm leading-6 text-muted-foreground">
                                            Eggs, nuts, seeds, salmon, sweet
                                            potatoes, legumes, and some
                                            vegetables.
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-xl text-secondary">
                                            ✓
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-primary">
                                            The important distinction
                                        </h3>
                                        <p className="m-0 text-sm leading-6 text-muted-foreground">
                                            Biotin is essential, but more is not
                                            necessarily better. High-dose
                                            supplementation can also interfere
                                            with certain laboratory tests.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="relative overflow-hidden rounded-3xl bg-primary px-7 py-9 md:px-12 md:py-12">
                                <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
                                <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

                                <div className="relative">
                                    <span className="mb-4 block text-4xl font-serif text-secondary">“</span>
                                    <p className="m-0 max-w-2xl font-serif text-2xl leading-9 text-white md:text-3xl md:leading-10">
                                        The goal isn&apos;t simply to take more
                                        supplements—it is to give your body
                                        the nutrients it actually needs.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">02</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    What does collagen do?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Collagen is the body&apos;s major
                                        structural protein and is found in
                                        tissues including skin, bones, tendons,
                                        and connective tissue.
                                    </p>
                                    <p>
                                        When people talk about collagen
                                        supplements for hair, it is important
                                        to understand that collagen is not
                                        simply converted directly into new
                                        strands of hair.
                                    </p>
                                    <p>
                                        Collagen supplements provide
                                        collagen-derived peptides and amino
                                        acids that the body can use as part of
                                        its normal protein metabolism.
                                    </p>
                                    <p>
                                        Research into oral collagen has mainly
                                        focused on areas such as skin health,
                                        while evidence specifically
                                        demonstrating meaningful hair-growth
                                        benefits remains limited.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">03</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Biotin vs. collagen at a glance
                                </h2>

                                <div className="overflow-hidden rounded-3xl border border-border">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[640px] border-collapse text-left">
                                            <thead>
                                                <tr className="bg-primary text-white">
                                                    <th className="px-5 py-4 text-sm font-semibold">&nbsp;</th>
                                                    <th className="px-5 py-4 text-sm font-semibold">Biotin</th>
                                                    <th className="px-5 py-4 text-sm font-semibold">Collagen</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {[
                                                    ["What is it?", "Vitamin B7", "Structural protein"],
                                                    ["Main role", "Helps metabolize nutrients", "Provides amino acids and peptides"],
                                                    ["Hair evidence", "Strongest when deficiency exists", "Evidence is still limited"],
                                                    ["Best approach", "Correct deficiency if present", "Consider as part of overall nutrition"],
                                                ].map(([label, biotin, collagen]) => (
                                                    <tr key={label}>
                                                        <td className="bg-muted/30 px-5 py-4 text-sm font-semibold text-primary">
                                                            {label}
                                                        </td>
                                                        <td className="px-5 py-4 text-sm text-muted-foreground">{biotin}</td>
                                                        <td className="px-5 py-4 text-sm text-muted-foreground">{collagen}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">04</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Which one is better for hair growth?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        There is no simple winner. If someone
                                        has a genuine biotin deficiency,
                                        correcting that deficiency can help
                                        address associated hair problems. But
                                        for people who already get enough
                                        biotin, additional supplementation is
                                        not automatically going to produce
                                        more hair growth.
                                    </p>
                                    <p>
                                        Collagen has attracted considerable
                                        interest, but research specifically
                                        demonstrating that collagen
                                        supplements cause meaningful hair
                                        growth is still developing.
                                    </p>
                                </div>

                                <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-6 md:p-8">
                                    <p className="m-0 text-lg font-medium leading-8 text-primary">
                                        Instead of asking{" "}
                                        <span className="text-secondary">
                                            &quot;Which supplement grows hair
                                            faster?&quot;
                                        </span>{" "}
                                        a better question is:
                                    </p>
                                    <p className="mt-4 mb-0 font-serif text-2xl leading-9 text-primary">
                                        &quot;What does my body actually need?&quot;
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">05</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Hair health is bigger than one nutrient
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Hair growth depends on much more than
                                        biotin or collagen. Inadequate intake
                                        of nutrients such as protein, iron,
                                        zinc, or biotin can contribute to
                                        noticeable hair problems.
                                    </p>
                                    <p>
                                        Other factors can include hormonal
                                        changes, thyroid conditions, genetics,
                                        stress, medications, and certain
                                        medical conditions. This is why taking
                                        a supplement without understanding the
                                        underlying cause may not solve the
                                        problem.
                                    </p>
                                </div>

                                <div className="mt-8 rounded-3xl bg-muted/40 p-6 md:p-8">
                                    <h3 className="mb-6 text-xl font-semibold text-primary">
                                        Nutrients worth paying attention to
                                    </h3>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {nutrients.map((item) => (
                                            <div
                                                key={item.title}
                                                className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5"
                                            >
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 font-semibold text-secondary">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h4 className="mb-1 text-base font-semibold text-primary">
                                                        {item.title}
                                                    </h4>
                                                    <p className="m-0 text-sm leading-6 text-muted-foreground">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">06</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    What should you actually take?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        For a healthy person without a
                                        diagnosed deficiency, there is no
                                        universal recommendation to take
                                        high-dose biotin simply for hair
                                        growth. A food-first approach is
                                        generally a sensible foundation.
                                    </p>
                                    <p>
                                        If you are experiencing persistent or
                                        significant hair loss, identifying the
                                        cause is more useful than simply adding
                                        another supplement.
                                    </p>
                                    <p>
                                        A dermatologist or qualified healthcare
                                        professional can help determine whether
                                        nutritional deficiency, genetics,
                                        hormones, medications, or another
                                        condition may be contributing to the
                                        problem.
                                    </p>
                                </div>

                                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                    {[
                                        "Start with a nutrient-rich diet",
                                        "Avoid unnecessary high-dose supplements",
                                        "Investigate persistent hair loss",
                                    ].map((item, index) => (
                                        <div
                                            key={item}
                                            className="rounded-2xl border border-border bg-background p-5"
                                        >
                                            <span className="mb-4 block text-sm font-bold text-secondary">
                                                0{index + 1}
                                            </span>
                                            <p className="m-0 text-sm font-medium leading-6 text-primary">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
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
                                        Biotin and collagen serve very
                                        different roles. Biotin is an essential
                                        vitamin involved in normal metabolism,
                                        while collagen provides peptides and
                                        amino acids used in normal protein
                                        metabolism.
                                    </p>
                                    <p>
                                        If a nutrient deficiency is present,
                                        correcting it can be important for
                                        overall health and hair. But there is
                                        no single supplement that works for
                                        every cause of hair loss.
                                    </p>
                                    <p>
                                        A balanced diet, healthy lifestyle
                                        habits, and professional guidance when
                                        needed are a stronger foundation for
                                        maintaining healthy-looking hair.
                                    </p>
                                </div>
                            </section>

                            <aside className="rounded-2xl border border-border bg-muted/30 p-6">
                                <p className="m-0 text-xs leading-6 text-muted-foreground">
                                    <strong className="text-foreground">Disclaimer:</strong>{" "}
                                    This article is for general educational
                                    purposes only and is not intended to
                                    diagnose, treat, cure, or prevent any
                                    disease. Nutritional needs vary between
                                    individuals. Consult a qualified healthcare
                                    professional for personalized advice.
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