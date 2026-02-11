import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark
            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                if (typeof window !== 'undefined') {
                    const root = window.document.documentElement;
                    root.classList.remove('light', 'dark');
                    root.classList.add(newTheme);
                }
                return { theme: newTheme };
            }),
            setTheme: (theme) => set(() => {
                if (typeof window !== 'undefined') {
                    const root = window.document.documentElement;
                    root.classList.remove('light', 'dark');
                    root.classList.add(theme);
                }
                return { theme };
            }),
        }),
        {
            name: 'job-tracker-theme',
            onRehydrateStorage: () => (state) => {
                if (state && typeof window !== 'undefined') {
                    const root = window.document.documentElement;
                    root.classList.remove('light', 'dark');
                    root.classList.add(state.theme);
                }
            }
        }
    )
);
