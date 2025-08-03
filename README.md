🎨 Exposio
A modern gallery and marketplace platform built with Angular and Supabase
Exposio is a Single Page Application (SPA) that combines an art gallery for creative expositions with a marketplace for buying and selling items. Users can showcase their work, browse collections, and interact with the community through likes, dislikes, and comments.
✨ Features
🌐 Public Features (No Authentication Required)

Browse all expositions in the gallery
View detailed exposition information with image galleries
Explore marketplace listings with search and filters
View item details with pricing and descriptions

🔐 Private Features (Authentication Required)

User Dashboard - Manage your personal content
Create Expositions - Upload and showcase your artistic work
Create Sale Ads - List items for sale with images and pricing
Interact with Content - Like, dislike, and comment on expositions and ads
Manage Your Content - Edit and delete your own expositions and sale ads

🛡️ Security Features

Row Level Security (RLS) with Supabase
JWT-based authentication
Protected routes with Angular Guards
Users can only modify their own content

🛠️ Tech Stack

Frontend: Angular 20+ with TypeScript
UI Framework: Angular Material + Bootstrap 5
Backend: Supabase (PostgreSQL + Auth + Storage)
State Management: RxJS Observables
Styling: Angular Material + Bootstrap utilities
Authentication: Supabase Auth with JWT

📁 Project Structure
src/app/
├── auth/                    # Authentication components
│   ├── login/
│   ├── register/
│   └── profile/
├── core/                    # Core services and guards
│   ├── guards/
│   │   └── auth.guard.ts
│   └── services/
│       ├── auth.service.ts
│       ├── supabase.service.ts
│       ├── exposition.service.ts
│       └── sale-ads.service.ts
├── features/                # Feature modules
│   ├── expositions/
│   │   ├── exposition-list/
│   │   ├── exposition-details/
│   │   └── exposition-form/
│   └── sale-ads/
│       ├── ad-list/
│       ├── ad-details/
│       └── ad-form/
├── models/                  # TypeScript interfaces
│   └── index.ts
├── shared/                  # Shared components
│   ├── components/
│   │   ├── navbar/
│   │   └── footer/
│   └── pipes/
└── dashboard/               # User dashboard
    └── user-dashboard/
🚀 Getting Started
Prerequisites

Node.js (v18 or higher)
Angular CLI (npm install -g @angular/cli)
Supabase account

Installation

Clone the repository
bashgit clone <repository-url>
cd exposio

Install dependencies
bashnpm install

Set up environment variables
bash# Copy environment templates
cp src/environments/environment.template.ts src/environments/environment.ts
cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts

Configure Supabase

Go to Supabase Dashboard
Create a new project or use existing one
Go to Settings → API
Copy your Project URL and anon/public API key
Update both environment files with your credentials


Set up database tables (Run in Supabase SQL Editor)
sql-- Create expositions table
create table public.expositions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  images text[],
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  likes int default 0,
  dislikes int default 0,
  comments jsonb[] default '{}'
);

-- Create sale_ads table
create table public.sale_ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  images text[],
  price numeric not null,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  likes int default 0,
  dislikes int default 0,
  comments jsonb[] default '{}'
);

-- Enable RLS
alter table expositions enable row level security;
alter table sale_ads enable row level security;

-- Create policies (repeat for both tables)
create policy "Allow public read" on expositions for select using (true);
create policy "Allow insert for authenticated users" on expositions for insert with check (auth.uid() = created_by);
create policy "Allow update own records" on expositions for update using (auth.uid() = created_by);
create policy "Allow delete own records" on expositions for delete using (auth.uid() = created_by);

Run the development server
bashng serve

Open your browser
Navigate to http://localhost:4200

📱 Usage
For Visitors (No Account Required)

Browse the gallery and marketplace from the homepage
Use search and filters to find specific content
View detailed information about expositions and items

For Registered Users

Sign Up/Login - Create an account or login
Create Content - Add new expositions or sale ads
Manage Content - Edit or delete your own items from the dashboard
Interact - Like, dislike, and comment on other users' content

🗃️ Database Schema
Expositions Table

id - UUID primary key
title - Exhibition title
description - Detailed description
images - Array of image URLs
created_by - User ID (foreign key)
created_at - Timestamp
likes/dislikes - Interaction counters
comments - JSONB array of comment objects

Sale Ads Table

Same as expositions plus:
price - Item price (numeric)

🔒 Security

Row Level Security (RLS) enabled on all tables
Authentication required for creating/modifying content
Authorization ensures users can only edit their own content
Input validation on both client and server side
Environment variables for sensitive configuration