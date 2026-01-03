'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Layout, TrendingUp, DollarSign, Activity, Settings,
    Mail, Menu, Download, AlertCircle, Link2, FileText,
    Plus, Trash2, Edit2, Save, X, Eye, EyeOff, Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLS } from '@/constants/tools';

// --- Types ---
type Tab = 'dashboard' | 'cms' | 'ads' | 'tools' | 'users' | 'newsletter' | 'settings';

// --- Main Component ---
const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const supabase = createClient();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    // Initial Auth Check
    useEffect(() => {
        const checkAdmin = async () => {
            if (authLoading) return;
            if (!user) {
                setIsAdmin(false);
                return;
            }
            // Simple mock admin check for now - replace with real logic/RLS check
            // For verified admin access, we should check a specific claim or table
            // For now, we'll allow access but API calls will fail if RLS triggers
            setIsAdmin(true);
        };
        checkAdmin();
    }, [user, authLoading]);

    if (authLoading) return <LoadingScreen />;
    if (isAdmin === false) return <AccessDenied />;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isMobileMenuOpen ? 0 : 0 }}
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl md:shadow-none md:relative transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform duration-300 ease-in-out`}
            >
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
                        <Layout className="w-8 h-8 text-blue-600" /> Admin
                    </h1>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    <NavButton tab="dashboard" icon={Layout} label="Dashboard" active={activeTab} setTab={setActiveTab} />
                    <NavButton tab="cms" icon={FileText} label="CMS Content" active={activeTab} setTab={setActiveTab} />
                    <NavButton tab="ads" icon={DollarSign} label="Ad Manager" active={activeTab} setTab={setActiveTab} />
                    <NavButton tab="tools" icon={Activity} label="Tools" active={activeTab} setTab={setActiveTab} />
                    <NavButton tab="users" icon={Users} label="Users" active={activeTab} setTab={setActiveTab} />
                    <NavButton tab="newsletter" icon={Mail} label="Newsletter" active={activeTab} setTab={setActiveTab} />
                    <NavButton tab="settings" icon={Settings} label="Settings" active={activeTab} setTab={setActiveTab} />
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500">Super Admin</p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50/50 dark:bg-slate-950">
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-600">
                            <Menu size={20} />
                        </button>
                        <h2 className="text-xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                            <Mail size={20} className="text-slate-500" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        </button>
                    </div>
                </header>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'dashboard' && <DashboardView supabase={supabase} />}
                            {activeTab === 'cms' && <CMSView supabase={supabase} />}
                            {activeTab === 'ads' && <AdsView supabase={supabase} />}
                            {activeTab === 'tools' && <ToolsView supabase={supabase} />}
                            {activeTab === 'users' && <UsersView supabase={supabase} />}
                            {activeTab === 'newsletter' && <NewsletterView supabase={supabase} />}
                            {activeTab === 'settings' && <SettingsView supabase={supabase} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// --- Sub-Components ---

const NavButton = ({ tab, icon: Icon, label, active, setTab }: any) => (
    <button
        onClick={() => setTab(tab)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${active === tab
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const DashboardView = ({ supabase }: any) => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const loadStats = async () => {
            const res = await fetch('/api/admin/stats');
            if (res.ok) setStats(await res.json());
        };
        loadStats();
    }, []);

    if (!stats) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.totalUsers || 0} icon={Users} color="bg-blue-500" />
                <StatCard title="Revenue" value={`₹${stats.revenue || 0}`} icon={DollarSign} color="bg-green-500" />
                <StatCard title="Subscribers" value={stats.totalSubscribers || 0} icon={Mail} color="bg-yellow-500" />
                <StatCard title="Active Tools" value={stats.activeTools || 0} icon={Activity} color="bg-purple-500" />
            </div>
            {/* Add Charts here later */}
        </div>
    );
};

const CMSView = ({ supabase }: any) => {
    const [content, setContent] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/cms').then(r => r.json()).then(d => { setContent(d); setLoading(false); });
    }, []);

    const handleSave = async (key: string, value: string) => {
        setContent({ ...content, [key]: value });
        await fetch('/api/admin/cms', {
            method: 'POST',
            body: JSON.stringify({ key, value, section: 'home' })
        });
        // Show heading feedback toast here
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-3xl space-y-6">
            <h3 className="text-xl font-bold mb-4">Homepage Content</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <CMSInput label="Hero Title" id="home_hero_title" value={content.home_hero_title} onSave={handleSave} placeholder="Professional Financial Tools" />
                <CMSInput label="Hero Subtitle" id="home_hero_subtitle" value={content.home_hero_subtitle} onSave={handleSave} placeholder="Calculators for everyone..." />
                <CMSInput label="CTA Button Text" id="home_cta_text" value={content.home_cta_text} onSave={handleSave} placeholder="Get Started Free" />
            </div>

            <h3 className="text-xl font-bold mb-4 pt-6">Legal Pages</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <CMSInput label="Privacy Policy Last Updated" id="legal_privacy_date" value={content.legal_privacy_date} onSave={handleSave} placeholder="January 1, 2026" />
                <CMSInput label="Contact Email" id="contact_email" value={content.contact_email} onSave={handleSave} placeholder="support@fincalchub.com" />
            </div>
        </div>
    );
};

const CMSInput = ({ label, id, value, onSave, placeholder }: any) => {
    const [localValue, setLocalValue] = useState(value || '');
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <div className="flex gap-2">
                <input
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    placeholder={placeholder}
                />
                <button
                    onClick={() => onSave(id, localValue)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Save size={18} />
                </button>
            </div>
        </div>
    );
};

const AdsView = ({ supabase }: any) => {
    const [ads, setAds] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newAd, setNewAd] = useState({ name: '', imageUrl: '', linkUrl: '', slot: 'sidebar' });

    const loadAds = async () => {
        const res = await fetch('/api/admin/ads');
        if (res.ok) setAds(await res.json());
    };

    useEffect(() => { loadAds(); }, []);

    const handleCreate = async () => {
        await fetch('/api/admin/ads', { method: 'POST', body: JSON.stringify(newAd) });
        setShowForm(false);
        loadAds();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this ad?')) return;
        await fetch(`/api/admin/ads?id=${id}`, { method: 'DELETE' });
        loadAds();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Ad Campaigns (Self-Serve)</h3>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    <Plus size={18} /> New Campaign
                </button>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input placeholder="Campaign Name" className="border p-2 rounded" value={newAd.name} onChange={e => setNewAd({ ...newAd, name: e.target.value })} />
                        <input placeholder="Image URL" className="border p-2 rounded" value={newAd.imageUrl} onChange={e => setNewAd({ ...newAd, imageUrl: e.target.value })} />
                        <input placeholder="Target Link" className="border p-2 rounded" value={newAd.linkUrl} onChange={e => setNewAd({ ...newAd, linkUrl: e.target.value })} />
                        <select className="border p-2 rounded" value={newAd.slot} onChange={e => setNewAd({ ...newAd, slot: e.target.value })}>
                            <option value="sidebar">Sidebar</option>
                            <option value="header">Header</option>
                            <option value="footer">Footer</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                        <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Save Campaign</button>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                    <motion.div layout key={ad.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative group">
                        <div className="h-32 bg-slate-100 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ad.image_url} alt={ad.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDelete(ad.id)} className="p-1 bg-red-600 text-white rounded hover:bg-red-700"><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold mb-1">{ad.name}</h4>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span className="uppercase font-bold tracking-wider">{ad.slot}</span>
                                <span>{ad.clicks} Clicks</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {ads.length === 0 && <p className="text-slate-500 text-center col-span-3 py-10">No active campaigns.</p>}
            </div>
        </div>
    );
};

const ToolsView = ({ supabase }: any) => {
    const [configs, setConfigs] = useState<any>({});

    useEffect(() => {
        fetch('/api/admin/tools').then(r => r.json()).then(setConfigs);
    }, []);

    const toggleTool = async (toolId: string) => {
        const current = configs[toolId] || { id: toolId, is_active: true }; // Default to active if not in DB
        const newStatus = !current.is_active; // Invert status (fixing database vs default mismatch logic)

        // Optimistic update
        setConfigs({ ...configs, [toolId]: { ...current, is_active: newStatus } });

        await fetch('/api/admin/tools', {
            method: 'POST',
            body: JSON.stringify({ id: toolId, isActive: newStatus })
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Tool Management</h3>
            <div className="space-y-4">
                {TOOLS.map(tool => {
                    const config = configs[tool.id];
                    // If config missing, assume active (default for new tools)
                    const isActive = config ? config.is_active : true;

                    return (
                        <div key={tool.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${!isActive && 'text-slate-400 line-through'}`}>{tool.name}</h4>
                                    <p className="text-xs text-slate-500 uppercase">{tool.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleTool(tool.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                >
                                    {isActive ? 'Active' : 'Disabled'}
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><Edit2 size={16} /></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const UsersView = ({ supabase }: any) => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/admin/users').then(r => r.json()).then(setUsers);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">User Database</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input className="pl-9 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-sm" placeholder="Search users..." />
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.map((u, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-bold">{u.full_name || 'Anonymous'}</div>
                                    <div className="text-xs text-slate-500">{u.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {u.is_premium ?
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">Premium</span> :
                                        <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">Free</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const NewsletterView = ({ supabase }: any) => {
    const [subs, setSubs] = useState<any[]>([]);
    useEffect(() => { fetch('/api/admin/subscribers').then(r => r.json()).then(setSubs); }, []);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Newsletter Subscribers</h3>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <p className="mb-4 text-slate-500">Total Subscribers: <span className="font-bold text-slate-900 dark:text-white">{subs.length}</span></p>
                <div className="max-h-96 overflow-y-auto">
                    {subs.map((s, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded">
                            <span>{s.email}</span>
                            <span className="text-xs text-slate-400">{new Date(s.subscribed_at).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SettingsView = ({ supabase }: any) => {
    const [settings, setSettings] = useState<any>({});
    useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(setSettings); }, []);

    const toggle = async (key: string) => {
        const newVal = !settings[key];
        setSettings({ ...settings, [key]: newVal });
        await fetch('/api/admin/settings', {
            method: 'PUT',
            body: JSON.stringify({ [key]: newVal })
        });
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <SettingToggle
                label="Maintenance Mode"
                desc="Disable public access to the site immediately."
                active={settings.maintenance_mode}
                onToggle={() => toggle('maintenanceMode')}
                danger
            />
            <SettingToggle
                label="Enable Global Ads"
                desc="Show advertisements to free tier users."
                active={settings.ads_enabled}
                onToggle={() => toggle('adsEnabled')}
            />
        </div>
    );
};

const SettingToggle = ({ label, desc, active, onToggle, danger }: any) => (
    <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
            <h4 className={`font-bold ${danger ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>{label}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
        <button
            onClick={onToggle}
            className={`w-14 h-8 rounded-full relative transition-colors ${active ? (danger ? 'bg-red-500' : 'bg-green-500') : 'bg-slate-200'}`}
        >
            <motion.div
                layout
                className={`w-6 h-6 bg-white rounded-full absolute top-1 ${active ? 'right-1' : 'left-1'}`}
            />
        </button>
    </div>
);

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`${color} p-3 rounded-xl text-white shadow-lg shadow-blue-500/20`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

const AccessDenied = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-6">You must be logged in as an Administrator to view this page.</p>
            <a href="/login?redirect=/sys-admin-control-v1" className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                Go to Login
            </a>
        </div>
    </div>
);

const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-slate-300 border-t-transparent rounded-full"></div>
    </div>
);

export default AdminDashboard;
