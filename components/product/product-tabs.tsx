'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ProductTabsProps {
    description: string
    ingredients?: string
    children?: React.ReactNode // For Reviews
}

export function ProductTabs({ description, ingredients, children }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description')

    return (
        <div className="mt-16">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('description')}
                        className={cn(
                            activeTab === 'description'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                        )}
                    >
                        Description
                    </button>
                    <button
                        onClick={() => setActiveTab('ingredients')}
                        className={cn(
                            activeTab === 'ingredients'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                        )}
                    >
                        Ingredients
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={cn(
                            activeTab === 'reviews'
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                        )}
                    >
                        Reviews
                    </button>
                </nav>
            </div>
            <div className="mt-8">
                {activeTab === 'description' && (
                    <div className="prose prose-sm max-w-none text-gray-500">
                        <p>{description}</p>
                    </div>
                )}
                {activeTab === 'ingredients' && (
                    <div className="prose prose-sm max-w-none text-gray-500">
                        <p>{ingredients || "All natural ingredients."}</p>
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div>
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}
