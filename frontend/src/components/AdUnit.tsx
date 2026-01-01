'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FALLBACK_ADS, AffiliateAd } from '@/config/ads';
import Image from 'next/image';

interface AdUnitProps {
    slot: string;
    className?: string;
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
    showLabel?: boolean;
}

const AdUnit: React.FC<AdUnitProps> = ({ slot, className, format = 'auto', showLabel = true }) => {
    const { isPremium } = useAuth();
    const [adLoaded, setAdLoaded] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    // Placeholder for actual AdSense loading logic
    useEffect(() => {
        // In a real implementation, we would check if the ad script loaded or if the ad slot was filled.
        // For now, we simulate a "no-fill" scenario for demonstration or allow specific slots to fallback.
        const timer = setTimeout(() => {
            // Simulate network check - if fails, show fallback
            // For this demo, sidebar slots default to fallback
            if (slot.includes('sidebar') || slot.includes('affiliate')) {
                setShowFallback(true);
            } else {
                setAdLoaded(true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [slot]);

    // 1. Premium User Check
    if (isPremium) return null;

    // 2. Render Affiliate Fallback
    if (showFallback) {
        const fallbackAd = slot.includes('sidebar') ? FALLBACK_ADS.SIDEBAR : FALLBACK_ADS.DEFAULT;
        return (
            <div className={`ad-container my-6 flex flex-col items-center justify-center ${className}`}>
                {showLabel && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sponsored</span>}
                <a href={fallbackAd.link} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    {/* Use Next.js Image for optimization, fallback to img if external domain not configured */}
                    <img src={fallbackAd.imageUrl} alt={fallbackAd.title} className="max-w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Visit Site</span>
                    </div>
                </a>
            </div>
        )
    }

    // 3. Render Google AdSense Unit (Placeholder for now)
    return (
        <div className={`ad-container my-8 flex flex-col items-center justify-center min-h-[100px] ${className}`}>
            {showLabel && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Advertisement</span>}

            {/* Actual Google Ad Code would go here */}
            {/* <ins className="adsbygoogle" ... /> */}

            {/* Visual Placeholder for Developer/Preview */}
            <div className={`w-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-4 text-center ${format === 'vertical' ? 'h-[600px] w-[300px]' : 'h-[90px] md:h-[250px]'}`}>
                <span className="text-slate-400 text-xs font-mono mb-2">Google AdSlot: {slot}</span>
                <span className="text-slate-500 text-sm font-medium">Responsive Display Ad</span>
            </div>
        </div>
    );
};

export default AdUnit;
