'use client';

import { Sidebar } from './Sidebar';
import { Settings } from './Settings';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useMemo, useEffect } from 'react';
import { Column } from './Column';
import { JobCard } from './JobCard';
import { useJobStore, Job, JobStatus } from '../store/useJobStore';
import { createPortal } from 'react-dom';
import { JobModal } from './JobModal'; // We'll create this next
import { Analytics } from './Analytics';
import { Plus, Loader2 } from 'lucide-react';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export function Board() {
    const { jobs, moveJob, deleteJob, fetchJobs, loading } = useJobStore();
    const [activeJob, setActiveJob] = useState<Job | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'settings'>('tasks');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchJobs();
    }, [fetchJobs]);

    const columns: { id: JobStatus; title: string }[] = [
        { id: 'Applied', title: 'Applied' },
        { id: 'In Progress', title: 'In Progress' },
        { id: 'Accepted', title: 'Accepted' },
        { id: 'Rejected', title: 'Rejected' },
    ];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const jobsByColumn = useMemo(() => {
        const grouped: Record<JobStatus, Job[]> = {
            'Applied': [],
            'In Progress': [],
            'Accepted': [],
            'Rejected': []
        };
        jobs.forEach((job) => {
            if (grouped[job.status]) {
                grouped[job.status].push(job);
            }
        });
        return grouped;
    }, [jobs]);


    // DND Handlers
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const job = jobs.find((j) => j.id === active.id);
        if (job) setActiveJob(job);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Just visual, we handle logic in DragEnd usually or here if we need real-time sorting across columns
        // For simple kanban, DragEnd is often enough if we just re-assign status
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveJob(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeJob = jobs.find((j) => j.id === activeId);
        if (!activeJob) return;

        // Check if dropped on a column
        const isOverColumn = columns.some(col => col.id === overId);

        if (isOverColumn) {
            // Dropped directly on a column container
            if (activeJob.status !== overId) {
                moveJob(activeId, overId as JobStatus);
            }
        } else {
            // Dropped on another item
            const overJob = jobs.find((j) => j.id === overId);
            if (overJob && activeJob.status !== overJob.status) {
                moveJob(activeId, overJob.status);
            }
        }

        setActiveJob(null);
    };

    if (!isMounted) return null; // Avoid hydration mismatch

    return (
        <div className="h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
            <Sidebar activeView={currentView} onNavigate={setCurrentView} />

            <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
                {/* Top Bar - Only show on Tasks view or maybe all? Let's show on all but customize title? Or just Tasks */}
                {currentView === 'tasks' && (
                    <header className="px-8 py-6 flex justify-between items-center shrink-0">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                Kanban Board
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedJob(null); // Clear selected job for "Add New"
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-violet-600 dark:hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 dark:shadow-violet-500/20 active:scale-95"
                        >
                            <Plus size={18} />
                            New Task
                        </button>
                    </header>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto relative">
                    {loading && jobs.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-50">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-violet-500" />
                        </div>
                    )}

                    {/* DASHBOARD VIEW */}
                    {currentView === 'dashboard' && (
                        <div className="p-8 animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Dashboard</h2>
                            <Analytics jobs={jobs} />
                        </div>
                    )}

                    {/* SETTINGS VIEW */}
                    {currentView === 'settings' && <Settings />}

                    {/* TASKS / BOARD VIEW */}
                    {currentView === 'tasks' && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="h-full flex flex-col pb-4">
                                <div className="flex-1 items-start flex gap-6 px-8 min-w-full overflow-x-auto h-full">
                                    {columns.map((col) => (
                                        <div key={col.id} className="w-[350px] flex-shrink-0 h-full flex flex-col">
                                            <Column
                                                id={col.id}
                                                title={col.title}
                                                jobs={jobsByColumn[col.id]}
                                                onJobClick={(job) => {
                                                    setSelectedJob(job);
                                                    setIsModalOpen(true);
                                                }}
                                                onDeleteJob={deleteJob}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {createPortal(
                                <DragOverlay dropAnimation={dropAnimation}>
                                    {activeJob ? <JobCard job={activeJob} onClick={() => { }} onDelete={() => { }} /> : null}
                                </DragOverlay>,
                                document.body
                            )}
                        </DndContext>
                    )}
                </main>
            </div>

            <JobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jobToEdit={selectedJob}
            />
        </div>
    );
}
