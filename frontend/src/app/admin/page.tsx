'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Layout, TrendingUp, DollarSign, Activity, Settings, Mail, Wrench, Menu, Download, AlertCircle, Link2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { TOOLS } from '@/constants/tools';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter(); // Import useRouter
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Data States
    const [stats, setStats] = useState({ totalUsers: 0, totalSubscribers: 0, revenue: 0, activeTools: 0 });
    const [users, setUsers] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState([]);
    const [settings, setSettings] = useState<any>({
        maintenanceMode: false,
        adsEnabled: true,
        disabledTools: [],
        adSlots: { homeHeader: true, homeInFeed: true, homeFooter: true, toolSidebar: true }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch Data
    const fetchData = async () => {
        if (!user) return;
        setError('');
        try {
            const token = await user.getIdToken();
            const headers = { 'Authorization': `Bearer ${token}` };
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const [statsRes, usersRes, subRes, settingsRes] = await Promise.all([
                fetch(`${baseUrl}/api/admin/stats`, { headers }),
                fetch(`${baseUrl}/api/admin/users`, { headers }),
                fetch(`${baseUrl}/api/admin/subscribers`, { headers }),
                fetch(`${baseUrl}/api/admin/settings`, { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (subRes.ok) setSubscribers(await subRes.json());
            if (settingsRes.ok) setSettings(await settingsRes.json());

            setLoading(false);
        } catch (error) {
            console.error("Admin Fetch Error", error);
            setError('Failed to load data. Is the backend running?');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            // Redirect or show access denied
            // For now just stop loading so we don't hang, maybe show a login link
            setLoading(false);
            return;
        }
        fetchData();
    }, [user, authLoading]);

    // Actions
    const handleUpdateUser = async (userId: string, updates: any) => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            fetchData(); // Refresh
        } catch (e) { console.error(e); }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        if (!user) return;
        try {
            const token = await user.getIdToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleUpdateSettings = async (updates: any) => {
        // Optimistic update
        setSettings({ ...settings, ...updates });

        if (!user) return;
        try {
            const token = await user.getIdToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/settings`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
        } catch (e) { console.error(e); }
    };

    const toggleTool = (toolId: string) => {
        const currentDisabled = settings.disabledTools || [];
        const isDisabled = currentDisabled.includes(toolId);
        let newDisabled;
        if (isDisabled) {
            newDisabled = currentDisabled.filter((id: string) => id !== toolId);
        } else {
            newDisabled = [...currentDisabled, toolId];
        }
        handleUpdateSettings({ disabledTools: newDisabled });
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'tools', label: 'Tools Management', icon: Activity },
        { id: 'newsletter', label: 'Newsletter', icon: Mail },
        { id: 'affiliate', label: 'Affiliate', icon: Link2 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        if (loading) return (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p>Loading Admin Data...</p>
            </div>
        );

        if (!user && !authLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-20 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-6">You must be logged in to access the Admin Panel.</p>
                    <button onClick={() => router.push('/login')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Go to Login</button>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold">Error Loading Data</h3>
                        <p className="text-sm">{error}</p>
                        <button onClick={fetchData} className="mt-2 text-xs font-bold underline hover:no-underline">Retry</button>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" />
                            <StatCard title="Revenue" value={`₹${stats.revenue}`} icon={DollarSign} color="bg-green-500" />
                            <StatCard title="Subscribers" value={stats.totalSubscribers} icon={Mail} color="bg-yellow-500" />
                            <StatCard title="Active Tools" value={TOOLS.length - (settings.disabledTools?.length || 0)} icon={Activity} color="bg-purple-500" />
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">User Management</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {users.map((u: any, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">...{u._id?.slice(-6)}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleUpdateUser(u._id, { isPremium: !u.isPremium })}
                                                    className={`px-2 py-1 rounded text-xs font-bold cursor-pointer hover:opacity-80 ${u.isPremium ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}
                                                >
                                                    {u.isPremium ? 'Premium' : 'Free'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 font-bold text-xs">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">No users found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'tools':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Tools Management</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {TOOLS.map((tool) => {
                                const isDisabled = settings.disabledTools?.includes(tool.id);
                                return (
                                    <div key={tool.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${isDisabled ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'}`}>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tool.name}</h4>
                                            <span className="text-xs text-slate-500 uppercase">{tool.category}</span>
                                        </div>
                                        <button
                                            onClick={() => toggleTool(tool.id)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isDisabled ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-600'}`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-slate-400' : 'bg-green-500'}`}></span>
                                            {isDisabled ? 'Disabled' : 'Active'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            case 'newsletter':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Newsletter Subscribers</h2>
                            <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {subscribers.map((sub: any, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{sub.email}</td>
                                            <td className="px-6 py-4"><span className="text-green-600 font-bold text-xs uppercase">{sub.status}</span></td>
                                            <td className="px-6 py-4 text-slate-500">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {subscribers.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-slate-400">No subscribers yet</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'affiliate':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Affiliate Manager</h2>
                            <button
                                onClick={() => {
                                    const newAd = { id: Date.now().toString(), name: 'New Ad', imageUrl: 'https://via.placeholder.com/300x250', linkUrl: '#', active: false };
                                    handleUpdateSettings({ affiliateAds: [...(settings.affiliateAds || []), newAd] });
                                }}
                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                            >
                                <DollarSign className="w-4 h-4" /> Add Affiliate Ad
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(settings.affiliateAds || []).map((ad: any, index: number) => (
                                <div key={ad.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-800 dark:text-white">Ad #{index + 1}</h4>
                                        <button
                                            onClick={() => {
                                                const newAds = settings.affiliateAds.filter((a: any) => a.id !== ad.id);
                                                handleUpdateSettings({ affiliateAds: newAds });
                                            }}
                                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Provider Name</label>
                                            <input
                                                type="text"
                                                value={ad.name}
                                                onChange={(e) => {
                                                    const newAds = [...settings.affiliateAds];
                                                    newAds[index].name = e.target.value;
                                                    handleUpdateSettings({ affiliateAds: newAds });
                                                }}
                                                className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Image URL (Banner)</label>
                                            <input
                                                type="text"
                                                value={ad.imageUrl}
                                                onChange={(e) => {
                                                    const newAds = [...settings.affiliateAds];
                                                    newAds[index].imageUrl = e.target.value;
                                                    handleUpdateSettings({ affiliateAds: newAds });
                                                }}
                                                className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Target Link</label>
                                            <input
                                                type="text"
                                                value={ad.linkUrl}
                                                onChange={(e) => {
                                                    const newAds = [...settings.affiliateAds];
                                                    newAds[index].linkUrl = e.target.value;
                                                    handleUpdateSettings({ affiliateAds: newAds });
                                                }}
                                                className="w-full p-2 text-sm border rounded bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                checked={ad.active}
                                                onChange={(e) => {
                                                    const newAds = [...settings.affiliateAds];
                                                    newAds[index].active = e.target.checked;
                                                    handleUpdateSettings({ affiliateAds: newAds });
                                                }}
                                                className="w-4 h-4 text-primary rounded"
                                            />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(settings.affiliateAds || []).length === 0 && (
                                <div className="col-span-full p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                    No affiliate ads configured. Add one to start.
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="animate-fade-in max-w-2xl space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Global Settings</h2>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Maintenance Mode</h4>
                                        <p className="text-sm text-slate-500">Disable site access for users.</p>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateSettings({ maintenanceMode: !settings.maintenanceMode })}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-primary' : 'bg-slate-200'}`}
                                    >
                                        <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`}></span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Enable Ads Globally</h4>
                                        <p className="text-sm text-slate-500">Show ads to free users globally.</p>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateSettings({ adsEnabled: !settings.adsEnabled })}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${settings.adsEnabled ? 'bg-primary' : 'bg-slate-200'}`}
                                    >
                                        <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${settings.adsEnabled ? 'right-1' : 'left-1'}`}></span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Ad Configuration</h2>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Google Publisher ID</label>
                                    <input
                                        type="text"
                                        value={settings.googlePublisherId || ''}
                                        onChange={(e) => handleUpdateSettings({ googlePublisherId: e.target.value })}
                                        placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none hover:border-primary focus:border-primary transition-colors"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Ad Slots Re-Config</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.keys(settings.adSlots || {}).map(slot => (
                                            <div key={slot} className="flex items-center justify-between text-sm">
                                                <span className="capitalize text-slate-600 dark:text-slate-400">{slot.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                <button
                                                    onClick={() => handleUpdateSettings({ adSlots: { ...settings.adSlots, [slot]: !settings.adSlots[slot] } })}
                                                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.adSlots?.[slot] ? 'bg-green-500' : 'bg-slate-200'}`}
                                                >
                                                    <span className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${settings.adSlots?.[slot] ? 'right-1' : 'left-1'}`}></span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // ... rest of component logic (return wrapper)
    // IMPORTANT: I will reuse the wrapper from the original file to ensure no breaking layout changes.
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                <div className="p-6">
                    <h1 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Layout className="w-6 h-6 text-primary" /> Admin
                    </h1>
                </div>
                <nav className="px-4 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <button className="md:hidden mb-6 p-2 bg-white rounded-lg shadow-sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu className="w-6 h-6" />
                </button>
                {renderContent()}
            </main>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`${color} p-2 rounded-lg text-white`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </div>
);

export default AdminDashboard;
