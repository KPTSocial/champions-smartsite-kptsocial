
-- Add new mandatory fields for first name, last name, and email
alter table public.photo_booth_uploads
  add column if not exists first_name text not null default '',
  add column if not exists last_name text not null default '',
  add column if not exists email text not null default '';

-- Make user_name nullable/optional (was required before)
alter table public.photo_booth_uploads
  alter column user_name drop not null;

-- Add AI caption request tracker
alter table public.photo_booth_uploads
  add column if not exists ai_caption_requested boolean not null default false;
