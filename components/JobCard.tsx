
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Job } from '../store/useJobStore';
import { GripVertical, Trash2, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface JobCardProps {
    job: Job;
    onClick: (job: Job) => void;
    onDelete: (id: string) => void;
}

export function JobCard({ job, onClick, onDelete }: JobCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: job.id, data: { ...job } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={twMerge(
                clsx(
                    'relative group bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50 hover:shadow-md hover:border-indigo-300 dark:hover:border-slate-600 transition-all duration-200 cursor-grab active:cursor-grabbing',
                    isDragging && 'opacity-50 ring-2 ring-indigo-500 rotate-2 scale-105 z-50 shadow-xl'
                )
            )}
            onClick={() => onClick(job)}
        >
            {/* Priority Badge */}
            <div className="mb-3">
                <span className={clsx(
                    "text-[10px] uppercase font-bold px-2 py-1 rounded-md border",
                    job.priority === 'High' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                        job.priority === 'Medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                )}>
                    {job.priority || 'Medium'}
                </span>
            </div>

            <div className="flex justify-between items-start mb-2 group-hover:translate-x-1 transition-transform">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">
                    {job.title}
                </h3>
                <div
                    className="text-slate-400 dark:text-slate-500 p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical size={16} />
                </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">{job.company}</p>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <Calendar size={12} />
                    <span className="text-xs">
                        {new Date(job.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job.id);
                    }}
                    className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-1"
                    title="Delete job"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
