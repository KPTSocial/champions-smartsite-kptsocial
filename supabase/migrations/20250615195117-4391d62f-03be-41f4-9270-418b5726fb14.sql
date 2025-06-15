
-- Table to track referrals and reward points
create table public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid not null,
  referred_email text not null,
  joined boolean default false,
  points_awarded integer default 0,
  referral_code text,
  created_at timestamp with time zone default now(),
  constraint one_reward_per_email unique (referred_email)
);

-- Row level security: Referrer can see their own sent referrals
alter table public.referrals enable row level security;
create policy "Referrer can view their referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id);

create policy "Referrer can insert referrals" 
  on public.referrals for insert
  with check (auth.uid() = referrer_id);

create policy "Referrer can update their referrals"
  on public.referrals for update
  using (auth.uid() = referrer_id);

-- Table for Mug Club membership
create table public.mug_club_members (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  joined_date date not null default (now()::date),
  active boolean default true,
  engraved_name text not null,
  renewal_date date,
  created_at timestamp with time zone default now()
);

alter table public.mug_club_members enable row level security;
create policy "Members can view their mug club info"
  on public.mug_club_members for select
  using (auth.uid() = user_id);

create policy "Members can update their own mug membership"
  on public.mug_club_members for update
  using (auth.uid() = user_id);

create policy "Allow mug club member insert for self"
  on public.mug_club_members for insert
  with check (auth.uid() = user_id);

-- Table for Whiskey Room membership
create table public.whiskey_room_members (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  joined_date date not null default (now()::date),
  active boolean default true,
  personalized_locker text,
  created_at timestamp with time zone default now()
);

alter table public.whiskey_room_members enable row level security;
create policy "Members can view their whiskey room info"
  on public.whiskey_room_members for select
  using (auth.uid() = user_id);

create policy "Members can update their whiskey room membership"
  on public.whiskey_room_members for update
  using (auth.uid() = user_id);

create policy "Allow whiskey member insert for self"
  on public.whiskey_room_members for insert
  with check (auth.uid() = user_id);

-- Optional: Table to track user profiles and codes (if not already present)
create table if not exists public.user_profiles (
  id uuid not null primary key,
  user_email text,
  referral_code text unique,
  created_at timestamp with time zone default now()
);

alter table public.user_profiles enable row level security;
create policy "User can access their profile"
  on public.user_profiles for select
  using (auth.uid() = id);
create policy "User can update their profile"
  on public.user_profiles for update
  using (auth.uid() = id);
create policy "User can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Table to track loyalty points history (earn/spend events)
create table public.loyalty_points (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  points integer not null,
  reason text,
  source_referral_id uuid,
  created_at timestamp with time zone default now()
);

alter table public.loyalty_points enable row level security;
create policy "User can see their own points"
  on public.loyalty_points for select
  using (auth.uid() = user_id);
create policy "User can insert their own points"
  on public.loyalty_points for insert
  with check (auth.uid() = user_id);

