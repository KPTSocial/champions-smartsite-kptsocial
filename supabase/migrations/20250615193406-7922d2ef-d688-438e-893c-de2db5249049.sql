
-- 1. Create the guest_feedback table with required fields and defaults
create table if not exists public.guest_feedback (
    id uuid primary key default gen_random_uuid(),
    name text,
    email text,
    visit_date date not null,
    rating integer not null check (rating between 1 and 5),
    feedback text not null,
    consent_to_share boolean not null default false,
    ai_response text,
    status text not null default 'new' check (status in ('new', 'responded', 'flagged')),
    created_at timestamp with time zone not null default now()
);

-- 2. (Optional but recommended) Add an index for quick lookup/display
create index if not exists idx_guest_feedback_created_at on public.guest_feedback (created_at desc);

-- 3. (Optional) Enable Row Level Security and allow only service roles to update ai_response/status if managers want to moderate

-- 4. Comment: This table is ready for integration with the Guest Feedback form and AI review responder logic as planned.

