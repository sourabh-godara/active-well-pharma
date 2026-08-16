import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
    title: "How Plant Collagen Supports Skin Elasticity as You Age | ActiveWell Pharma",
    description:
        "Learn how plant-based nutrients and collagen-supporting ingredients can help support skin elasticity, hydration, and overall skin health as you age.",
    keywords: [
        "plant collagen",
        "skin elasticity",
        "collagen support",
        "healthy aging",
        "skin health",
        "plant based skincare",
    ],
    openGraph: {
        title: "How Plant Collagen Supports Skin Elasticity as You Age",
        description:
            "Discover how plant-based nutrients can support your body's natural collagen production and help maintain healthy-looking skin.",
        type: "article",
    },
};

export default function PlantCollagenArticle() {
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
                                Skin Health
                            </span>

                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                5 min read
                            </span>
                        </div>

                        <h1 className="max-w-4xl font-serif text-4xl font-semibold leading-tight text-primary md:text-5xl lg:text-6xl">
                            How Plant Collagen Supports Skin Elasticity as You Age
                        </h1>

                        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                            Collagen production naturally changes as we age. Here&apos;s how
                            plant-based nutrients and collagen precursors can support your
                            skin&apos;s natural structure without animal-derived ingredients.
                        </p>
                    </div>
                </header>

                <div className="container-brand mx-auto max-w-5xl px-6 py-14 md:py-20">
                    {/* Article introduction */}
                    <div className="mx-auto max-w-3xl">
                        <div className="mb-12 rounded-3xl border border-border bg-secondary/5 p-7 md:p-10">
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-secondary" />
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                                    The Science of Healthy Skin
                                </span>
                            </div>

                            <p className="m-0 text-xl leading-9 text-foreground md:text-2xl md:leading-10">
                                Healthy, resilient skin depends on many factors. Collagen plays
                                an important role in maintaining skin structure and elasticity,
                                but its natural production gradually changes as we age.
                            </p>

                            <p className="mt-5 mb-0 text-base leading-7 text-muted-foreground">
                                Understanding how nutrition, lifestyle, and collagen-supporting
                                nutrients work together can help you make informed choices for
                                long-term skin health.
                            </p>
                        </div>
                    </div>

                    {/* Main article */}
                    <div className="mx-auto max-w-3xl">
                        <div className="space-y-16">
                            {/* Section 01 */}
                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">01</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    What is collagen?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Collagen is a structural protein found throughout the
                                        body. In the skin, it provides much of the framework
                                        that helps keep skin firm, smooth, and resilient.
                                    </p>

                                    <p>
                                        Our bodies naturally produce collagen using amino
                                        acids, vitamins, minerals, and other nutrients.
                                        Supporting adequate nutrition can therefore play an
                                        important role in maintaining normal collagen
                                        production.
                                    </p>
                                </div>
                            </section>

                            {/* Pull quote */}
                            <section className="relative overflow-hidden rounded-3xl bg-primary px-7 py-9 md:px-12 md:py-12">
                                <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
                                <div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />

                                <div className="relative">
                                    <span className="mb-4 block text-4xl font-serif text-secondary">
                                        “
                                    </span>

                                    <p className="m-0 max-w-2xl font-serif text-2xl leading-9 text-white md:text-3xl md:leading-10">
                                        Supporting your body&apos;s natural processes starts
                                        with giving it the nutrients it needs.
                                    </p>
                                </div>
                            </section>

                            {/* Section 02 */}
                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">02</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Why does collagen production decline with age?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Collagen production gradually decreases as part of the
                                        natural aging process. Environmental factors such as
                                        prolonged sun exposure, smoking, poor nutrition, and
                                        oxidative stress may also affect the appearance and
                                        health of the skin.
                                    </p>

                                    <p>
                                        This is why a balanced diet and healthy lifestyle are
                                        important foundations for maintaining healthy-looking
                                        skin over time.
                                    </p>
                                </div>
                            </section>

                            {/* Section 03 */}
                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">03</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Can plants provide collagen?
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Plants do not naturally contain the same collagen
                                        protein found in animal connective tissue. However,
                                        many plant foods provide nutrients that the body uses
                                        to support its own collagen production.
                                    </p>

                                    <p>
                                        This distinction is important. Rather than supplying
                                        animal collagen directly, plant-based nutrition can
                                        provide the building blocks and supporting nutrients
                                        involved in the body&apos;s natural processes.
                                    </p>
                                </div>

                                <div className="mt-8 flex items-start gap-4 rounded-2xl border border-secondary/20 bg-secondary/5 p-5">
                                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                        ✓
                                    </div>

                                    <div>
                                        <h3 className="mb-1 text-base font-semibold text-primary">
                                            Plant-based support
                                        </h3>

                                        <p className="m-0 text-sm leading-6 text-muted-foreground">
                                            Plants don&apos;t provide collagen itself, but
                                            they can provide nutrients involved in your
                                            body&apos;s natural collagen-building processes.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 04 */}
                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">04</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Key nutrients that support collagen production
                                </h2>

                                <p className="mb-8 text-[17px] leading-8 text-muted-foreground">
                                    Several nutrients contribute to the normal processes
                                    involved in collagen formation and maintaining healthy
                                    skin.
                                </p>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {/* Vitamin C */}
                                    <div className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                                            🍊
                                        </div>

                                        <h3 className="mb-3 text-lg font-semibold text-primary">
                                            Vitamin C
                                        </h3>

                                        <p className="m-0 text-sm leading-6 text-muted-foreground">
                                            An essential nutrient involved in normal collagen
                                            formation. Common sources include citrus fruits,
                                            berries, peppers, tomatoes, and leafy greens.
                                        </p>
                                    </div>

                                    {/* Zinc */}
                                    <div className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-xl">
                                            🌱
                                        </div>

                                        <h3 className="mb-3 text-lg font-semibold text-primary">
                                            Zinc
                                        </h3>

                                        <p className="m-0 text-sm leading-6 text-muted-foreground">
                                            Zinc contributes to normal skin health and several
                                            biological processes involved in maintaining
                                            healthy tissues.
                                        </p>
                                    </div>

                                    {/* Protein */}
                                    <div className="group rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                                            ✦
                                        </div>

                                        <h3 className="mb-3 text-lg font-semibold text-primary">
                                            Protein
                                        </h3>

                                        <p className="m-0 text-sm leading-6 text-muted-foreground">
                                            Protein provides amino acids needed for normal
                                            tissue maintenance and protein synthesis.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 05 */}
                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">05</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    Supporting skin elasticity naturally
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        Nutrition is only one part of maintaining healthy skin.
                                        A consistent skincare routine, adequate hydration,
                                        regular physical activity, sufficient sleep, and
                                        protection from excessive UV exposure can all contribute
                                        to healthier-looking skin.
                                    </p>

                                    <p>
                                        A diet rich in colorful fruits and vegetables can also
                                        provide antioxidants and other micronutrients that
                                        support overall wellness.
                                    </p>
                                </div>

                                {/* Lifestyle checklist */}
                                <div className="mt-8 rounded-3xl bg-muted/40 p-6 md:p-8">
                                    <h3 className="mb-6 text-xl font-semibold text-primary">
                                        Simple habits for healthier-looking skin
                                    </h3>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {[
                                            "Eat a varied, nutrient-rich diet",
                                            "Include plenty of fruits and vegetables",
                                            "Consume adequate protein",
                                            "Stay adequately hydrated",
                                            "Protect your skin from excessive UV exposure",
                                            "Maintain consistent sleep and exercise habits",
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                                                    ✓
                                                </span>

                                                <span className="text-sm leading-6 text-muted-foreground">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Section 06 */}
                            <section>
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm font-bold text-secondary">06</span>
                                    <div className="h-px flex-1 bg-border" />
                                </div>

                                <h2 className="mb-5 text-3xl font-semibold tracking-tight text-primary md:text-4xl">
                                    The takeaway
                                </h2>

                                <div className="space-y-5 text-[17px] leading-8 text-muted-foreground">
                                    <p>
                                        While plants do not provide collagen in the same way
                                        that animal-derived collagen products do, plant-based
                                        foods can provide important nutrients involved in the
                                        body&apos;s natural collagen production and skin
                                        maintenance processes.
                                    </p>

                                    <p>
                                        Building a nutrient-rich diet and maintaining healthy
                                        lifestyle habits can help support your skin as it
                                        changes naturally with age.
                                    </p>
                                </div>
                            </section>

                            {/* Disclaimer */}
                            <aside className="rounded-2xl border border-border bg-muted/30 p-6">
                                <p className="m-0 text-xs leading-6 text-muted-foreground">
                                    <strong className="text-foreground">Disclaimer:</strong>{" "}
                                    This article is for general educational purposes only and
                                    is not intended to diagnose, treat, cure, or prevent any
                                    disease. Nutritional needs vary between individuals.
                                    Consult a qualified healthcare professional for personalized
                                    advice.
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