import { Settings as SettingsIcon, Moon, Bell, Shield, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { clsx } from 'clsx';

export function Settings() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-300">
            <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100">Settings</h2>

            <div className="space-y-6">
                {/* Appearance Section */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 backdrop-blur-sm transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 dark:bg-violet-500/10 rounded-lg text-indigo-500 dark:text-violet-400">
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Appearance</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium">Dark Mode</p>
                            <p className="text-sm text-slate-500">Enable dark theme for the application</p>
                        </div>
                        <div
                            onClick={toggleTheme}
                            className={clsx(
                                "h-6 w-11 rounded-full relative cursor-pointer transition-colors duration-200",
                                theme === 'dark' ? "bg-violet-600" : "bg-slate-300"
                            )}
                        >
                            <div className={clsx(
                                "absolute top-1 h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-200",
                                theme === 'dark' ? "left-[22px]" : "left-1"
                            )}></div>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 backdrop-blur-sm transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 dark:text-blue-400">
                            <Bell size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-700 dark:text-slate-300 font-medium">Email Notifications</p>
                            <div className="h-6 w-11 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 h-4 w-4 bg-white dark:bg-slate-400 rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 backdrop-blur-sm transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 dark:text-emerald-400">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">About</h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">JobTracker v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
