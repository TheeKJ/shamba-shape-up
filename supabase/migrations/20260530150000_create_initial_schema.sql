-- Initial SHAMBA schema generated from lib/data.ts and types/index.ts.

create type public.farm_type as enum ('crops', 'livestock', 'aquaculture', 'cash_crops');
create type public.farm_risk_level as enum ('low', 'medium', 'high');
create type public.farm_status as enum ('funding', 'active', 'harvesting', 'completed');
create type public.farm_verification_status as enum ('unverified', 'pending', 'verified', 'flagged');
create type public.farm_update_type as enum ('progress', 'receipt', 'weather', 'verification');
create type public.chama_member_role as enum ('admin', 'member');
create type public.worker_report_status as enum ('passed', 'flagged');
create type public.credit_user_role as enum ('farmer', 'investor');
create type public.credit_score_impact as enum ('positive', 'neutral', 'negative');
create type public.notification_type as enum ('info', 'success', 'alert', 'payout');
create type public.activity_user_role as enum ('farmer', 'investor', 'worker', 'admin');

create table public.farms (
  id text primary key,
  name text not null,
  farmer_id text not null,
  farmer_name text not null,
  location text not null,
  country text not null default 'Kenya',
  type public.farm_type not null,
  crop_type text not null,
  size_acres numeric(12, 2) not null check (size_acres >= 0),
  target_capital integer not null check (target_capital >= 0),
  funded_capital integer not null default 0 check (funded_capital >= 0),
  unit_price integer not null check (unit_price > 0),
  total_units integer not null check (total_units >= 0),
  funded_units integer not null default 0 check (funded_units >= 0),
  yield_history text not null,
  farmer_credit_score integer not null check (farmer_credit_score between 0 and 100),
  risk_level public.farm_risk_level not null,
  expected_roi numeric(5, 2) not null check (expected_roi >= 0),
  duration_months integer not null check (duration_months > 0),
  status public.farm_status not null,
  description text not null,
  image_url text not null,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  worker_assigned text,
  verification_status public.farm_verification_status not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint farms_funded_capital_not_over_target check (funded_capital <= target_capital),
  constraint farms_funded_units_not_over_total check (funded_units <= total_units)
);

create table public.farm_updates (
  id text primary key,
  farm_id text not null references public.farms(id) on delete cascade,
  timestamp timestamptz not null,
  type public.farm_update_type not null,
  title text not null,
  description text not null,
  image_url text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  worker_id text,
  created_at timestamptz not null default now()
);

create table public.chamas (
  id text primary key,
  name text not null,
  creator_id text not null,
  creator_name text not null,
  description text not null,
  total_balance integer not null default 0 check (total_balance >= 0),
  active_investments_count integer not null default 0 check (active_investments_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chama_members (
  chama_id text not null references public.chamas(id) on delete cascade,
  user_id text not null,
  name text not null,
  contribution integer not null default 0 check (contribution >= 0),
  role public.chama_member_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (chama_id, user_id)
);

create table public.worker_reports (
  id text primary key,
  farm_id text not null references public.farms(id) on delete cascade,
  farm_name text not null,
  worker_id text not null,
  worker_name text not null,
  visit_date date not null,
  status public.worker_report_status not null,
  worker_notes text not null,
  rating integer not null check (rating between 1 and 5),
  geo_tagged_photo_url text,
  anomaly_detected boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.credit_score_profiles (
  user_id text primary key,
  user_role public.credit_user_role not null,
  score integer not null check (score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_score_breakdown (
  id bigserial primary key,
  user_id text not null references public.credit_score_profiles(user_id) on delete cascade,
  label text not null,
  value text not null,
  impact public.credit_score_impact not null
);

create table public.credit_score_history (
  id bigserial primary key,
  user_id text not null references public.credit_score_profiles(user_id) on delete cascade,
  date date not null,
  score integer not null check (score between 0 and 100),
  reason text not null
);

create table public.notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  message text not null,
  type public.notification_type not null,
  date timestamptz not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id text primary key,
  user_id text not null,
  user_role public.activity_user_role not null,
  user_name text not null,
  action text not null,
  details text not null,
  timestamp timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.platform_stats (
  id boolean primary key default true,
  total_capital_invested integer not null default 0 check (total_capital_invested >= 0),
  active_farms_count integer not null default 0 check (active_farms_count >= 0),
  average_roi numeric(5, 2) not null default 0 check (average_roi >= 0),
  payouts_completed integer not null default 0 check (payouts_completed >= 0),
  default_rate numeric(5, 2) not null default 0 check (default_rate >= 0),
  updated_at timestamptz not null default now(),
  constraint platform_stats_singleton check (id)
);

create index farms_farmer_id_idx on public.farms(farmer_id);
create index farms_status_idx on public.farms(status);
create index farm_updates_farm_id_timestamp_idx on public.farm_updates(farm_id, timestamp desc);
create index chamas_creator_id_idx on public.chamas(creator_id);
create index worker_reports_farm_id_idx on public.worker_reports(farm_id);
create index worker_reports_worker_id_idx on public.worker_reports(worker_id);
create index notifications_user_id_date_idx on public.notifications(user_id, date desc);
create index activity_logs_user_id_timestamp_idx on public.activity_logs(user_id, timestamp desc);
create index activity_logs_timestamp_idx on public.activity_logs(timestamp desc);
