'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    ArrowLeft, Share2, Save, Download,
    Info, HelpCircle, History,
    ChevronRight, TrendingUp, PieChart as PieChartIcon,
    Calculator
} from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { WifiOff } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TOOL_CONFIGS } from '@/lib/calculators/registry';
import AdUnit from './AdUnit';
import { AD_SLOTS } from '@/config/ads';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ToolInterfaceProps {
    tool: any;
}

const ToolInterface: React.FC<ToolInterfaceProps> = ({
    tool
}) => {
    const config = TOOL_CONFIGS[tool.id];
    const [result, setResult] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'calculator' | 'guide' | 'history'>('calculator');

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(config.inputSchema),
        defaultValues: config.defaultValues
    });

    const watchedInputs = watch();
    const watchedInputsStr = JSON.stringify(watchedInputs);

    useEffect(() => {
        if (!config) return;
        try {
            const res = config.calculationLogic(watchedInputs);
            setResult(res);
        } catch (e) {
            // Silently fail if inputs are invalid
        }
    }, [watchedInputsStr, config]);

    const handleSave = () => {
        if (!result) return;
        const newEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleString(),
            inputs: { ...watchedInputs },
            result: { ...result }
        };
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem(`history_${tool.id}`, JSON.stringify(updatedHistory));
    };

    useEffect(() => {
        const saved = localStorage.getItem(`history_${tool.id}`);
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, [tool.id]);

    const handleRestore = (item: any) => {
        Object.entries(item.inputs).forEach(([key, value]) => {
            setValue(key, value as any);
        });
        setActiveTab('calculator');
    };

    const shareLink = () => {
        const params = new URLSearchParams();
        Object.entries(watchedInputs).forEach(([key, value]) => params.append(key, String(value)));
        const url = `${window.location.origin}/tools/${tool.slug}?${params.toString()}`;
        navigator.clipboard.writeText(url);
        alert('Shareable link copied to clipboard!');
    };

    const { settings, loading: settingsLoading } = useSettings();

    if (!config) return <div>Tool configuration not found.</div>;
    if (settingsLoading) return <div className="p-10 text-center animate-pulse">Loading Tool...</div>;

    // Check if tool is disabled
    if (settings.maintenanceMode || settings.disabledTools?.includes(tool.id)) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center glass-card">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <WifiOff className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Temporarily Unavailable</h2>
                <p className="text-slate-500 max-w-md">
                    {settings.maintenanceMode
                        ? "We are currently performing scheduled maintenance. Please check back soon."
                        : "This tool is currently disabled for updates. Please try again later."}
                </p>
                <Link href="/" className="mt-8 px-6 py-3 bg-primary text-white rounded-full font-bold hover:shadow-lg transition-all">
                    Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <Link href="/" className="flex items-center text-secondary text-sm hover:text-primary transition-colors mb-2">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tools
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{tool.name}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={shareLink} className="p-2.5 rounded-xl border border-border hover:bg-input transition-colors flex items-center gap-2 text-sm font-medium">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button onClick={handleSave} className="p-2.5 rounded-xl border border-border hover:bg-input transition-colors flex items-center gap-2 text-sm font-medium">
                        <Save className="w-4 h-4" /> Save
                    </button>
                </div>
            </div>

            <div className="flex border-b border-border mb-8 overflow-x-auto scrollbar-hide">
                {['calculator', 'guide', 'history'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn("px-6 py-3 text-sm font-bold capitalize transition-all border-b-2", activeTab === tab ? "border-primary text-primary" : "border-transparent text-secondary")}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'calculator' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5 space-y-6">
                        {/* Ad above Inputs */}
                        <AdUnit slot={AD_SLOTS.TOOL_HEADER} className="w-full" showLabel={true} />

                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-primary" /> Input Details
                            </h2>
                            <form className="space-y-6">
                                {config.inputFields.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-bold text-secondary">{field.label}</label>
                                            <span className="text-xs bg-input px-2 py-1 rounded font-mono">{field.unit}</span>
                                        </div>
                                        <input
                                            type={field.type}
                                            step={field.step}
                                            {...register(field.name, { valueAsNumber: field.type === 'number' })}
                                            className="input-field"
                                        />
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-xs">{errors[field.name]?.message as string}</p>
                                        )}
                                        {field.type === 'select' && (
                                            <select
                                                {...register(field.name)}
                                                className="input-field mb-2"
                                            >
                                                {field.options?.map((opt: any) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {field.type === 'number' && field.max && (
                                            <input
                                                type="range"
                                                min={field.min}
                                                max={field.max}
                                                step={field.step}
                                                value={watchedInputs[field.name] || field.min}
                                                onChange={(e) => setValue(field.name, parseFloat(e.target.value))}
                                                className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                            />
                                        )}
                                    </div>
                                ))}
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="glass-card p-8 border-primary/20">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" /> Calculation Summary
                            </h2>

                            {result && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-secondary text-sm font-medium mb-1">{config.resultMeta.primaryLabel}</p>
                                            <p className="text-3xl font-black text-primary">
                                                {config.resultMeta.primaryField === 'bmi'
                                                    ? formatNumber(result[config.resultMeta.primaryField])
                                                    : formatCurrency(result[config.resultMeta.primaryField])}
                                            </p>
                                        </div>
                                        <div className="h-px bg-border"></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {config.resultMeta.secondaryFields.map(field => (
                                                <div key={field.name}>
                                                    <p className="text-secondary text-xs font-bold mb-1">{field.label}</p>
                                                    <p className="font-bold">
                                                        {typeof result[field.name] === 'number'
                                                            ? formatCurrency(result[field.name])
                                                            : result[field.name]}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {config.resultMeta.chartDataFields.length > 0 && (
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-48 h-48 relative">
                                                <Pie
                                                    data={{
                                                        labels: config.resultMeta.chartLabels,
                                                        datasets: [{
                                                            data: config.resultMeta.chartDataFields.map(f => result[f] ?? watchedInputs[f] ?? 0),
                                                            backgroundColor: ['#2563eb', '#f59e0b', '#10b981', '#ef4444'],
                                                            borderColor: ['transparent', 'transparent'],
                                                        }]
                                                    }}
                                                    options={{ plugins: { legend: { display: false } } }}
                                                />
                                            </div>
                                            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-bold">
                                                {config.resultMeta.chartLabels.map((label, i) => (
                                                    <div key={label} className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#2563eb', '#f59e0b', '#10b981', '#ef4444'][i] }}></div> {label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Ad In-Content / Below Summary */}
                        <AdUnit slot={AD_SLOTS.TOOL_IN_CONTENT} className="w-full" showLabel={true} />

                        {/* Amortization Table Logic */}
                        {(result?.amortizationSchedule || result?.amortization) && ['loan-emi', 'education-loan', 'auto-loan'].includes(tool.id) && (
                            <div className="glass-card p-6 overflow-hidden">
                                <h3 className="text-lg font-bold mb-4">Payment Schedule</h3>
                                <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                                    <table className="w-full text-left text-sm relative">
                                        <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-border z-10">
                                            <tr>
                                                <th className="py-3 font-bold">Month</th>
                                                <th className="py-3 font-bold">Principal</th>
                                                <th className="py-3 font-bold">Interest</th>
                                                <th className="py-3 font-bold">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Show first 60 months (5 years) to avoid massive rendering, create pagination if really needed later */}
                                            {(result.amortizationSchedule || result.amortization || []).slice(0, 60).map((row: any, i: number) => (
                                                <tr key={i} className="border-b border-border/50 hover:bg-input/30 transition-colors">
                                                    <td className="py-3 text-secondary">{row.month || i + 1}</td>
                                                    <td className="py-3">{formatCurrency(row.principalPaid)}</td>
                                                    <td className="py-3">{formatCurrency(row.interestPaid)}</td>
                                                    <td className="py-3">{formatCurrency(row.remainingBalance ?? row.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {(result.amortizationSchedule || result.amortization || []).length > 60 && (
                                        <p className="text-center text-xs text-secondary mt-4">Showing first 60 months only.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'guide' && (
                <div className="max-w-4xl mx-auto space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">What is {tool.name}?</h2>
                        <p className="text-secondary leading-relaxed">{tool.description}</p>
                    </section>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="max-w-4xl mx-auto">
                    {history.length > 0 ? (
                        <div className="space-y-4">
                            {history.map((item) => (
                                <div key={item.id} className="glass-card p-6 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-secondary mb-1">{item.date}</p>
                                        <p className="font-bold">Result: {formatCurrency(item.result[config.resultMeta.primaryField] || 0)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRestore(item)}
                                        className="text-primary font-bold text-sm hover:underline"
                                    >
                                        Restore
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-secondary">No history yet.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ToolInterface;
