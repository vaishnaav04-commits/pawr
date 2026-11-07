import { test } from "node:test";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
test("migration and cross-owner RLS checks run in PostgreSQL", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create schema auth; create schema storage;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
 alter table storage.objects enable row level security;
 create function storage.foldername(text) returns text[] language sql immutable as $$ select string_to_array($1,'/') $$;
 grant usage on schema storage to authenticated;grant select,insert,delete on storage.objects to authenticated;`);
    const migration = await readFile(
      new URL(
        "../supabase/migrations/202611070001_milestone_one.sql",
        import.meta.url,
      ),
      "utf8",
    );
    // PGlite provides gen_random_uuid natively; pgcrypto is a Supabase extension.
    await db.exec(
      migration.replace("create extension if not exists pgcrypto;", ""),
    );
    await db.exec(
      await readFile(new URL("./rls.sql", import.meta.url), "utf8"),
    );
  } finally {
    await db.close();
  }
});
