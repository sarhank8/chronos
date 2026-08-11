-- Future Me — social layer schema
-- Run this once in your Supabase project's SQL editor (or via `supabase db push`).

-- ============================================================================
-- PROFILES
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  bio text,
  avatar_url text,
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

alter table public.profiles enable row level security;

-- Anyone can see basic profile info (name/avatar/privacy flag) — this is what
-- lets people find an account and decide whether to request to follow it.
-- Letter content itself is locked down separately below.
create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)), '[^a-z0-9_]', '', 'g'));
  if length(base_username) < 3 then
    base_username := base_username || substr(replace(new.id::text, '-', ''), 1, 6);
  end if;
  base_username := substr(base_username, 1, 20);
  final_username := base_username;

  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := substr(base_username, 1, 20 - length(suffix::text) - 1) || '_' || suffix;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (new.id, final_username, coalesce(new.raw_user_meta_data ->> 'display_name', base_username));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- FOLLOWS
-- ============================================================================
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'accepted' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  unique (follower_id, following_id),
  constraint no_self_follow check (follower_id <> following_id)
);

alter table public.follows enable row level security;

-- Accepted follows are public (needed for follower/following counts + lists).
-- Pending requests are only visible to the two people involved.
create policy "accepted follows are publicly readable"
  on public.follows for select
  using (status = 'accepted' or auth.uid() = follower_id or auth.uid() = following_id);

create policy "users can send follow requests"
  on public.follows for insert
  with check (auth.uid() = follower_id);

-- Either side can change status: the target approves/declines a request,
-- the requester can leave it as-is.
create policy "target can approve or requester can update their request"
  on public.follows for update
  using (auth.uid() = follower_id or auth.uid() = following_id);

create policy "either side can remove the relationship"
  on public.follows for delete
  using (auth.uid() = follower_id or auth.uid() = following_id);

-- When following a public account, skip the request step and accept instantly.
create or replace function public.handle_new_follow()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target_is_private boolean;
begin
  select is_private into target_is_private from public.profiles where id = new.following_id;
  if coalesce(target_is_private, false) = false then
    new.status := 'accepted';
  else
    new.status := 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists on_follow_insert on public.follows;
create trigger on_follow_insert
  before insert on public.follows
  for each row execute function public.handle_new_follow();

-- Helper used by RLS policies below (security definer avoids RLS recursion).
create or replace function public.is_accepted_follower(target_id uuid, viewer_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.follows
    where following_id = target_id
      and follower_id = viewer_id
      and status = 'accepted'
  );
$$;

-- ============================================================================
-- LETTERS
-- ============================================================================
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default '',
  content text not null,
  is_private boolean not null default true,
  deliver_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.letters enable row level security;

-- A letter is visible to: its author; anyone, if it's marked shareable AND
-- the author's account is public; or accepted followers, if it's shareable
-- but the author's account is private. Fully private letters are author-only.
create policy "letters are visible per privacy rules"
  on public.letters for select
  using (
    auth.uid() = author_id
    or (
      is_private = false
      and (deliver_at is null or deliver_at <= now())
      and (
        exists (select 1 from public.profiles p where p.id = author_id and p.is_private = false)
        or public.is_accepted_follower(author_id, auth.uid())
      )
    )
  );

create policy "users can write their own letters"
  on public.letters for insert
  with check (auth.uid() = author_id);

create policy "users can edit their own letters"
  on public.letters for update
  using (auth.uid() = author_id);

create policy "users can delete their own letters"
  on public.letters for delete
  using (auth.uid() = author_id);

-- ============================================================================
-- MESSAGES
-- ============================================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  constraint no_self_message check (sender_id <> recipient_id)
);

alter table public.messages enable row level security;

create policy "participants can read their messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "users can send messages as themselves"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "recipient can mark messages read"
  on public.messages for update
  using (auth.uid() = recipient_id or auth.uid() = sender_id);

-- Helpful indexes
create index if not exists follows_follower_idx on public.follows (follower_id);
create index if not exists follows_following_idx on public.follows (following_id);
create index if not exists letters_author_idx on public.letters (author_id, created_at desc);
create index if not exists messages_conversation_idx on public.messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);

-- Realtime for messages (so DM view can subscribe to new rows).
alter publication supabase_realtime add table public.messages;
