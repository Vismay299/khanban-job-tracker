-- Create the jobs table
create table public.jobs (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  status text not null,
  priority text,
  description text,
  location text,
  salary text,
  url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.jobs enable row level security;

-- Create Policy: Users can only see their own jobs
create policy "Users can view their own jobs"
on public.jobs for select
using (auth.uid() = user_id);

-- Create Policy: Users can insert their own jobs
create policy "Users can insert their own jobs"
on public.jobs for insert
with check (auth.uid() = user_id);

-- Create Policy: Users can update their own jobs
create policy "Users can update their own jobs"
on public.jobs for update
using (auth.uid() = user_id);

-- Create Policy: Users can delete their own jobs
create policy "Users can delete their own jobs"
on public.jobs for delete
using (auth.uid() = user_id);
