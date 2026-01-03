import React from 'react';
import { notFound } from 'next/navigation';
import { TOOLS } from '@/constants/tools';
import ToolInterface from '@/components/ToolInterface';
import AdUnit from '@/components/AdUnit';
import { AD_SLOTS } from '@/config/ads';

import { TOOL_CONTENT_REGISTRY } from '@/content/content-registry';

export async function generateStaticParams() {
    return TOOLS.map((tool) => ({
        slug: tool.slug,
    }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tool = TOOLS.find((t) => t.slug === slug);

    if (!tool) {
        notFound();
    }

    const ContentComponent = TOOL_CONTENT_REGISTRY[slug];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <ToolInterface tool={tool} />

                    {/* SEO Content / Guide */}
                    {ContentComponent && <ContentComponent />}

                    <div className="mt-12">
                        <AdUnit slot={AD_SLOTS.TOOL_FOOTER} className="w-full" />
                    </div>
                </div>

                {/* Sidebar - Desktop Only */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Recommended</h4>
                            <AdUnit slot={AD_SLOTS.TOOL_SIDEBAR} format="vertical" className="w-full min-h-[600px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
