import React from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <aside className="w-64 bg-slate-900 text-white hidden md:block">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tight">FinCalc<span className="text-primary-400">Admin</span></h2>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <a href="/admin" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">Dashboard</a>
                    <a href="/admin/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">Users</a>
                    <a href="/admin/tools" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">Tools Management</a>
                    <a href="/admin/newsletter" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">Newsletter</a>
                    <a href="/admin/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-slate-800 hover:text-white">Settings</a>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
