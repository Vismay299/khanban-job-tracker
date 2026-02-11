'use client';

import { LayoutDashboard, Kanban, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    activeView: 'dashboard' | 'tasks' | 'settings';
    onNavigate: (view: 'dashboard' | 'tasks' | 'settings') => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen shrink-0 relative z-20 hidden md:flex transition-colors duration-300">
            {/* Logo */}
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    JobTracker
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <div
                    onClick={() => onNavigate('dashboard')}
                    className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer font-medium",
                        activeView === 'dashboard'
                            ? "text-indigo-600 dark:text-violet-400 bg-indigo-50 dark:bg-violet-500/10 border border-indigo-200 dark:border-violet-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </div>

                <div
                    onClick={() => onNavigate('tasks')}
                    className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer font-medium",
                        activeView === 'tasks'
                            ? "text-indigo-600 dark:text-violet-400 bg-indigo-50 dark:bg-violet-500/10 border border-indigo-200 dark:border-violet-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    <Kanban size={20} />
                    <span>Tasks</span>
                </div>

                <div
                    onClick={() => onNavigate('settings')}
                    className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer font-medium",
                        activeView === 'settings'
                            ? "text-indigo-600 dark:text-violet-400 bg-indigo-50 dark:bg-violet-500/10 border border-indigo-200 dark:border-violet-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
            </nav>

            {/* Sign Out */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
