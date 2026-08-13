-- ============================================================================
-- Alma Team Portal — Supabase schema (multi-tenant)
-- Run this in the Supabase SQL editor once you create your project.
-- It sets up workspaces (tenants), memberships, collateral, and messages,
-- with row-level security so each workspace only sees its own data.
-- ============================================================================

-- WORKSPACES (tenants) --------------------------------------------------------
create table if not exists workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now()
);

-- MEMBERSHIPS (which user belongs to which workspace, and their role) ---------
create table if not exists memberships (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  display_name  text not null,
  role          text not null default 'member',   -- 'admin' | 'member'
  created_at    timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- BROADCAST (the pinned message from the founder to the team) -----------------
create table if not exists broadcasts (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces (id) on delete cascade,
  title         text not null,
  body          text not null,
  author_name   text not null,
  updated_at    timestamptz not null default now()
);

-- COLLATERAL (the library items) ---------------------------------------------
create table if not exists collateral (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces (id) on delete cascade,
  title         text not null,
  kind          text not null,          -- 'Explainer' | 'Plan' | 'Report' ...
  description   text,
  url           text,                   -- null = catalogued but not yet linked
  status        text not null default 'live',  -- 'live' | 'pdf' | 'draft' | 'progress'
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- MESSAGES (the team message board) ------------------------------------------
create table if not exists messages (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces (id) on delete cascade,
  user_id       uuid references auth.users (id) on delete set null,
  author_name   text not null,
  body          text not null,
  created_at    timestamptz not null default now()
);

-- ROW-LEVEL SECURITY ----------------------------------------------------------
alter table workspaces  enable row level security;
alter table memberships enable row level security;
alter table broadcasts  enable row level security;
alter table collateral  enable row level security;
alter table messages    enable row level security;

-- Helper: is the current user a member of a given workspace?
create or replace function is_member(ws uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from memberships m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

-- Helper: is the current user an admin of a given workspace?
create or replace function is_admin(ws uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from memberships m
    where m.workspace_id = ws and m.user_id = auth.uid() and m.role = 'admin'
  );
$$;

-- Members can see workspaces they belong to.
create policy "members read workspaces" on workspaces
  for select using (is_member(id));
create policy "any authed user creates a workspace" on workspaces
  for insert with check (auth.uid() = created_by);

-- Memberships: you can see the roster of your workspaces; you manage your own row.
create policy "members read roster" on memberships
  for select using (is_member(workspace_id));
create policy "user inserts own membership" on memberships
  for insert with check (user_id = auth.uid());

-- Broadcasts / collateral: members read, admins write.
create policy "members read broadcasts" on broadcasts
  for select using (is_member(workspace_id));
create policy "admins write broadcasts" on broadcasts
  for all using (is_admin(workspace_id)) with check (is_admin(workspace_id));

create policy "members read collateral" on collateral
  for select using (is_member(workspace_id));
create policy "admins write collateral" on collateral
  for all using (is_admin(workspace_id)) with check (is_admin(workspace_id));

-- Messages: members read and post; you can delete your own.
create policy "members read messages" on messages
  for select using (is_member(workspace_id));
create policy "members post messages" on messages
  for insert with check (is_member(workspace_id) and user_id = auth.uid());
create policy "authors delete own messages" on messages
  for delete using (user_id = auth.uid());

-- RPC: join a workspace by its slug/code (security definer so a non-member can
-- resolve the workspace and add themselves without a broad read policy).
create or replace function join_workspace(p_slug text, p_display_name text)
returns workspaces language plpgsql security definer as $$
declare ws workspaces;
begin
  select * into ws from workspaces where slug = p_slug;
  if ws.id is null then raise exception 'No workspace with that code'; end if;
  insert into memberships (workspace_id, user_id, display_name, role)
  values (ws.id, auth.uid(), p_display_name, 'member')
  on conflict (workspace_id, user_id) do nothing;
  return ws;
end; $$;
