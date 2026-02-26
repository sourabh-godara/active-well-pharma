'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProductTabsProps {
    description: string | null
    ingredients?: string | null
    children?: React.ReactNode
}

export function ProductTabs({ description, ingredients, children }: ProductTabsProps) {
    return (
        <div className="mt-16 border-t border-border pt-8">
            <Tabs defaultValue="description">
                <TabsList className="h-auto w-full justify-start rounded-none border-b border-border bg-transparent p-0 gap-0">
                    {(['description', 'ingredients', 'reviews'] as const).map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="capitalize rounded-none border-b-[3px] border-transparent px-6 py-3 text-sm font-medium text-muted-foreground bg-transparent hover:text-foreground transition-colors data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="description" className="mt-8">
                    <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed">
                        <p>{description || 'No description available.'}</p>
                    </div>
                </TabsContent>

                <TabsContent value="ingredients" className="mt-8">
                    <div className="prose prose-sm max-w-none font-body text-muted-foreground leading-relaxed">
                        <p>{ingredients || 'All natural ingredients.'}</p>
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-8">
                    {children}
                </TabsContent>
            </Tabs>
        </div>
    )
}
