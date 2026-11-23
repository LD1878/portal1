-- Per-user visa files. Rows are scoped by the verified session user id.
-- The desk stores what the applicant typed and the on-device check. It does
-- not store consular filings, and it never submits a file.

create table if not exists cases (
  id text primary key,
  user_id text not null,
  track text not null,
  route text not null,
  include_family boolean not null default false,
  family_count integer not null default 0,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_user_id_idx on cases (user_id);

create table if not exists case_answers (
  id text primary key,
  case_id text not null references cases (id) on delete cascade,
  user_id text not null,
  requirement_id text not null,
  text_value text not null default '',
  file_name text,
  verdict text,
  summary text,
  findings_json text not null default '[]',
  updated_at timestamptz not null default now(),
  unique (case_id, requirement_id)
);

create index if not exists case_answers_user_idx on case_answers (user_id);
