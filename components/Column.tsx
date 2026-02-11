import { useDroppable } from '@dnd-kit/core';
import { Job, JobStatus } from '../store/useJobStore';
import { JobCard } from './JobCard';
import { clsx } from 'clsx';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
    id: JobStatus;
    title: string;
    jobs: Job[];
    onJobClick: (job: Job) => void;
    onDeleteJob: (id: string) => void;
}

export function Column({ id, title, jobs, onJobClick, onDeleteJob }: ColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800/60 w-full min-w-0 backdrop-blur-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-bold text-slate-700 dark:text-slate-200">{title}</h2>
                <span className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {jobs.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={clsx(
                    'flex-1 flex flex-col gap-3 transition-colors duration-200 rounded-xl',
                    isOver ? 'bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-200 dark:ring-indigo-500/30 ring-inset' : ''
                )}
            >
                <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onClick={onJobClick}
                            onDelete={onDeleteJob}
                        />
                    ))}
                </SortableContext>
                {jobs.length === 0 && (
                    <div className="h-[200px] border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2">
                        <span className="text-sm font-medium">No tasks yet</span>
                        <span className="text-xs text-slate-500 dark:text-slate-700">Drop tasks here</span>
                    </div>
                )}
            </div>
        </div>
    );
}
