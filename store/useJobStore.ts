import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client';

export type JobStatus = 'Applied' | 'In Progress' | 'Accepted' | 'Rejected';
export type JobPriority = 'High' | 'Medium' | 'Low';

export interface Job {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  priority: JobPriority;
  description?: string;
  location?: string;
  salary?: string;
  url?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  user_id?: string;
}

interface JobState {
  jobs: Job[];
  loading: boolean;
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  moveJob: (id: string, newStatus: JobStatus) => Promise<void>;
}

const supabase = createClient();

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  loading: false,

  fetchJobs: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      set({ loading: false });
      return;
    }

    // Map database fields to app fields if necessary (snake_case to camelCase)
    // My SQL used snake_case for `created_at` etc.
    // My types use camelCase `createdAt`.
    // I need to map them.
    const mappedJobs: Job[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      company: item.company,
      status: item.status,
      priority: item.priority as JobPriority,
      description: item.description,
      location: item.location,
      salary: item.salary,
      url: item.url,
      notes: item.notes,
      createdAt: new Date(item.created_at).getTime(),
      updatedAt: new Date(item.updated_at).getTime(),
      user_id: item.user_id
    }));

    set({ jobs: mappedJobs, loading: false });
  },

  addJob: async (jobData) => {
    // Optimistic update
    const tempId = uuidv4();
    const now = Date.now();
    const newJob: Job = {
      ...jobData,
      id: tempId,
      createdAt: now,
      updatedAt: now,
      status: jobData.status,
      priority: jobData.priority,
    };

    set((state) => ({ jobs: [newJob, ...state.jobs] }));

    // DB Insert
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Should handle this better

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        id: tempId,
        user_id: user.id,
        title: jobData.title,
        company: jobData.company,
        status: jobData.status,
        priority: jobData.priority,
        description: jobData.description,
        location: jobData.location,
        salary: jobData.salary,
        url: jobData.url,
        notes: jobData.notes,
        created_at: new Date(now).toISOString(),
        updated_at: new Date(now).toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding job to DB:', error);
      // Revert optimistic update
      set((state) => ({ jobs: state.jobs.filter(j => j.id !== tempId) }));
    } else {
      // Update with confirm data if needed (e.g. real ID if I didn't set it, but I did)
    }
  },

  updateJob: async (id, updates) => {
    // Optimistic
    const oldJobs = get().jobs;
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates, updatedAt: Date.now() } : job
      ),
    }));

    // DB Update
    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.company) dbUpdates.company = updates.company;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.priority) dbUpdates.priority = updates.priority;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.salary !== undefined) dbUpdates.salary = updates.salary;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { error } = await supabase
      .from('jobs')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating job:', error);
      set({ jobs: oldJobs }); // Revert
    }
  },

  deleteJob: async (id) => {
    const oldJobs = get().jobs;
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    }));

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      set({ jobs: oldJobs });
    }
  },

  moveJob: async (id, newStatus) => {
    const oldJobs = get().jobs;
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, status: newStatus, updatedAt: Date.now() } : job
      ),
    }));

    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error moving job:', error);
      set({ jobs: oldJobs });
    }
  },
}));
