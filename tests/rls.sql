-- Run in a DEVELOPMENT Supabase SQL editor after migration. Fixtures roll back.
begin;
insert into auth.users(id,email,raw_user_meta_data) values
 ('b1111111-1111-4111-8111-111111111111','rls-a@example.invalid','{"full_name":"RLS A"}'),
 ('b2222222-2222-4222-8222-222222222222','rls-b@example.invalid','{"full_name":"RLS B"}');
insert into public.pets(id,owner_id,name,species) values
 ('c1111111-1111-4111-8111-111111111111','b1111111-1111-4111-8111-111111111111','Private pet','dog');
set local role authenticated;
select set_config('request.jwt.claim.sub','b2222222-2222-4222-8222-222222222222',true);
do $$begin
 if exists(select 1 from public.pets where id='c1111111-1111-4111-8111-111111111111') then raise exception 'Cross-owner read leaked';end if;
 update public.pets set name='Attacker' where id='c1111111-1111-4111-8111-111111111111';
 if found then raise exception 'Cross-owner update allowed';end if;
 begin
 insert into public.pets(owner_id,name,species) values('b1111111-1111-4111-8111-111111111111','Forged owner','dog');
 raise exception 'Forged owner insert allowed';
 exception when insufficient_privilege then null;end;
 begin
 insert into public.user_roles(user_id,role) values('b2222222-2222-4222-8222-222222222222','administrator');
 raise exception 'Role escalation allowed';
 exception when insufficient_privilege then null;end;
end;$$;
select set_config('request.jwt.claim.sub','b1111111-1111-4111-8111-111111111111',true);
do $$begin
 if not exists(select 1 from public.pets where id='c1111111-1111-4111-8111-111111111111') then raise exception 'Owner cannot read';end if;
 update public.pets set name='Owner edit' where id='c1111111-1111-4111-8111-111111111111';
 if not found then raise exception 'Owner cannot edit';end if;
end;$$;
rollback;
