-- Create a development account using the app first; never seed auth.users or passwords.
-- Adds fictional pets to demo+pawr@example.com only. Safe to rerun.
do $$declare owner uuid;begin
 select id into owner from auth.users where email='demo+pawr@example.com';
 if owner is null then raise notice 'Create demo+pawr@example.com via signup before seeding.';return;end if;
 insert into public.pets(id,owner_id,name,species,breed,date_of_birth,sex,temperament,city,vaccination_status,neutered)
 values ('a1111111-1111-4111-8111-111111111111',owner,'Milo','dog','Golden Retriever','2024-06-12','male','Everyone’s best friend. Loves long walks and tennis balls.','Bengaluru','up_to_date',true),
 ('a2222222-2222-4222-8222-222222222222',owner,'Olive','cat','Domestic Shorthair','2025-04-08','female','Small cat, big personality. Expert sunny-spot finder.','Bengaluru','unknown',true)
 on conflict(id) do nothing;
end;$$;
