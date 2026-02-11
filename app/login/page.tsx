import AuthForm from '@/components/AuthForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
            <AuthForm />
        </div>
    )
}
