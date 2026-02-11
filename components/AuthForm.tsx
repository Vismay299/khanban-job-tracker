'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (view === 'sign-in') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.refresh()
                router.push('/')
            } else {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                if (data.user && data.user.identities && data.user.identities.length === 0) {
                    setError('Email already registered. Please sign in.')
                } else {
                    setMessage('Check your email for the confirmation link.')
                }
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                    JobTracker
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {view === 'sign-in' ? 'Welcome back' : 'Create an account'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-800 dark:text-slate-200"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-800 dark:text-slate-200"
                        placeholder="••••••••"
                        minLength={6}
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20 dark:shadow-violet-500/20 active:scale-95 flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : view === 'sign-in' ? (
                        'Sign In'
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                    {view === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
                </span>{' '}
                <button
                    onClick={() => {
                        setView(view === 'sign-in' ? 'sign-up' : 'sign-in');
                        setError(null);
                        setMessage(null);
                    }}
                    className="text-indigo-600 dark:text-violet-400 font-medium hover:underline"
                >
                    {view === 'sign-in' ? 'Sign up' : 'Sign in'}
                </button>
            </div>
        </div>
    )
}
