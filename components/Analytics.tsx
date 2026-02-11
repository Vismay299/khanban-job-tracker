import { Job, JobStatus } from '../store/useJobStore';
import { Briefcase, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';

interface AnalyticsProps {
    jobs: Job[];
}

export function Analytics({ jobs }: AnalyticsProps) {
    const totalJobs = jobs.length;
    const acceptedJobs = jobs.filter((j) => j.status === 'Accepted').length;
    const inProgressJobs = jobs.filter((j) => j.status === 'In Progress').length;
    const appliedJobs = jobs.filter((j) => j.status === 'Applied').length;
    const rejectedJobs = jobs.filter((j) => j.status === 'Rejected').length;

    const acceptanceRate = totalJobs > 0 ? ((acceptedJobs / totalJobs) * 100).toFixed(0) : 0;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

            {/* Total Jobs */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-1 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Briefcase size={20} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalJobs}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Total Applications</p>
            </div>

            {/* In Progress */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-1 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                        <Clock size={20} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{inProgressJobs}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">In Progress</p>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-1 backdrop-blur-sm shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={20} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{acceptanceRate}%</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Acceptance Rate</p>
            </div>

            {/* Status Distribution Bar */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between backdrop-blur-sm col-span-2 md:col-span-1 shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-xs text-slate-500 font-medium tracking-wider">STATUS SPLIT</p>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mt-2">
                    <div
                        className="bg-slate-400 dark:bg-slate-500"
                        style={{ width: `${(appliedJobs / totalJobs) * 100}%` }}
                        title="Applied"
                    />
                    <div
                        className="bg-blue-500 dark:bg-blue-500"
                        style={{ width: `${(inProgressJobs / totalJobs) * 100}%` }}
                        title="In Progress"
                    />
                    <div
                        className="bg-emerald-500"
                        style={{ width: `${(acceptedJobs / totalJobs) * 100}%` }}
                        title="Accepted"
                    />
                    <div
                        className="bg-rose-500"
                        style={{ width: `${(rejectedJobs / totalJobs) * 100}%` }}
                        title="Rejected"
                    />
                </div>
            </div>

        </div>
    );
}
