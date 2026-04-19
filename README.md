# Flowboard

A Kanban-style task management board built with React and Supabase.
Live demo: https://task-board-assessment-challenge-opal.vercel.app/

## Features

- Drag and drop tasks between columns
- Guest accounts — no sign up required
- Real-time updates across browser tabs
- Create tasks with title, description, priority and due date
- Delete tasks
- Data persists in Supabase with Row Level Security

## Tech Stack

- React — frontend UI
- Vite — local development and build tool
- Supabase — database, authentication, and real-time subscriptions
- Vercel — deployment

## Database Schema
```sql
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'todo',
  priority    text not null default 'normal',
  due_date    date,
  assignee_id uuid,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);
```

## Running Locally

1. Clone the repo
   git clone https://github.com/YOUR_USERNAME/Task-board-Assessment-Challenge.git

2. Install dependencies
   npm install

3. Create a .env file in the root with your Supabase credentials
   VITE_SUPABASE_API_URL=your_supabase_url
   VITE_SUPABASE_API_KEY=your_supabase_anon_key

4. Start the dev server
   npm run dev

5. Open http://localhost:5173

## How It Works

- On first load the app signs in the user anonymously via Supabase Auth
- Every task is tied to that guest user via user_id
- Row Level Security ensures users can only see and edit their own tasks
- Real-time subscriptions keep the board in sync across browser tabs
- Drag and drop uses the HTML5 drag API — no extra libraries needed