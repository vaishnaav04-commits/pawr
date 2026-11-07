-- Milestone 1 only. Future marketplace/community schemas follow in later migrations.
create extension if not exists pgcrypto;
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '' check(length(full_name)<=100),
 city text check(length(city)<=100),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create type public.app_role as enum ('pet_owner','veterinarian','grooming_provider','store_seller','shelter','verified_breeder','administrator');
create table public.user_roles (
 user_id uuid not null references public.profiles(id) on delete cascade,
 role public.app_role not null default 'pet_owner',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), primary key(user_id,role)
);
create table public.pets (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
 name text not null check(length(trim(name)) between 1 and 80),
 species text not null check(species in ('dog','cat','rabbit','bird','other')),
 breed text check(length(breed)<=100), date_of_birth date check(date_of_birth<=current_date),
 sex text not null default 'unknown' check(sex in ('male','female','unknown')),
 weight_kg numeric(7,2) check(weight_kg>0 and weight_kg<=1000),
 temperament text check(length(temperament)<=300), city text check(length(city)<=100),
 vaccination_status text not null default 'unknown' check(vaccination_status in ('unknown','up_to_date','due')),
 neutered boolean not null default false, visible boolean not null default false,
 matching_mode text not null default 'playdate' check(matching_mode in ('playdate','companionship')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index pets_owner_idx on public.pets(owner_id);
create table public.pet_photos (
 id uuid primary key default gen_random_uuid(),pet_id uuid not null references public.pets(id) on delete cascade,
 storage_path text not null unique, created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index pet_photos_pet_idx on public.pet_photos(pet_id);
create table public.pet_health_records (
 id uuid primary key default gen_random_uuid(),pet_id uuid not null references public.pets(id) on delete cascade,
 title text not null check(length(title) between 1 and 200),storage_path text not null unique,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index pet_health_pet_idx on public.pet_health_records(pet_id);
create table public.pet_verifications (
 pet_id uuid primary key references public.pets(id) on delete cascade,
 status text not null default 'pending' check(status in ('pending','verified','rejected')),
 reviewed_by uuid references public.profiles(id) on delete set null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create function public.touch_updated_at() returns trigger language plpgsql set search_path='' as $$begin new.updated_at=now();return new;end;$$;
do $$declare t text;begin foreach t in array array['profiles','user_roles','pets','pet_photos','pet_health_records','pet_verifications'] loop execute format('create trigger touch_updated_at before update on public.%I for each row execute function public.touch_updated_at()',t);end loop;end;$$;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name) values(new.id,left(coalesce(new.raw_user_meta_data->>'full_name',''),100));
 insert into public.user_roles(user_id,role) values(new.id,'pet_owner');
 return new;
end;$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
-- Roles and verification have no client write policy, including for self-proclaimed admins.
-- Trusted provisioning is performed via SQL until the admin milestone is implemented.
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.pets enable row level security;
alter table public.pet_photos enable row level security;
alter table public.pet_health_records enable row level security;
alter table public.pet_verifications enable row level security;
create policy profile_read on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy profile_update on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy roles_read on public.user_roles for select to authenticated using(user_id=(select auth.uid()));
create policy pets_owner on public.pets for all to authenticated using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
create policy photos_owner on public.pet_photos for all to authenticated using(exists(select 1 from public.pets p where p.id=pet_id and p.owner_id=(select auth.uid()))) with check(exists(select 1 from public.pets p where p.id=pet_id and p.owner_id=(select auth.uid())) and split_part(storage_path,'/',1)=(select auth.uid())::text and split_part(storage_path,'/',2)=pet_id::text);
create policy health_owner on public.pet_health_records for all to authenticated using(exists(select 1 from public.pets p where p.id=pet_id and p.owner_id=(select auth.uid()))) with check(exists(select 1 from public.pets p where p.id=pet_id and p.owner_id=(select auth.uid())) and split_part(storage_path,'/',1)=(select auth.uid())::text and split_part(storage_path,'/',2)=pet_id::text);
create policy verification_read on public.pet_verifications for select to authenticated using(exists(select 1 from public.pets p where p.id=pet_id and p.owner_id=(select auth.uid())));
grant usage on schema public to authenticated;
grant select,update on public.profiles to authenticated;
grant select on public.user_roles,public.pet_verifications to authenticated;
grant select,insert,update,delete on public.pets,public.pet_photos,public.pet_health_records to authenticated;
revoke all on public.profiles,public.user_roles,public.pets,public.pet_photos,public.pet_health_records,public.pet_verifications from anon;
revoke insert,update,delete on public.user_roles,public.pet_verifications from authenticated;
revoke all on function public.handle_new_user() from public;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('pet-photos','pet-photos',false,5242880,array['image/jpeg','image/png','image/webp']),
 ('pet-medical','pet-medical',false,5242880,array['application/pdf','image/jpeg','image/png']);
create policy owner_file_read on storage.objects for select to authenticated using(bucket_id in ('pet-photos','pet-medical') and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.pets p where p.id::text=(storage.foldername(name))[2] and p.owner_id=(select auth.uid())));
create policy owner_file_insert on storage.objects for insert to authenticated with check(bucket_id in ('pet-photos','pet-medical') and (storage.foldername(name))[1]=(select auth.uid())::text and exists(select 1 from public.pets p where p.id::text=(storage.foldername(name))[2] and p.owner_id=(select auth.uid())));
create policy owner_file_delete on storage.objects for delete to authenticated using(bucket_id in ('pet-photos','pet-medical') and (storage.foldername(name))[1]=(select auth.uid())::text);
