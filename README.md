# Pawr

**One App. Every Paw. Everything.**

Milestone 1 of the Pawr pet lifestyle application, built with Next.js App Router, strict TypeScript, Tailwind CSS, a shadcn-style Radix/CVA Button, Lucide, Supabase, Zod and React Hook Form.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm ci
cp .env.example .env.local
# Fill in the three variables below, then:
npm run dev
```

Open http://localhost:3000. `/demo` is a read-only fictional preview and works without Supabase. It never saves data or pretends to authenticate. Unconfigured authenticated routes redirect to login with setup guidance.

| Variable | Purpose |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Public publishable key (legacy anon key also works) |
| NEXT_PUBLIC_SITE_URL | Application origin, e.g. http://localhost:3000 or deployed HTTPS URL |

Do not use a service-role key in these variables. No service-role key is needed by this app.

## Supabase setup

1. Create a Supabase project. Enable email/password authentication; retain email confirmation for production.
2. Run `supabase/migrations/202611070001_milestone_one.sql` in the SQL editor on a fresh project, or apply it with the Supabase CLI against your linked project (`supabase db push`). This creates tables, grants, indexes, constraints, the signup trigger, RLS and two private storage buckets.
3. In Authentication → URL configuration set Site URL to the application origin. Allow `http://localhost:3000/auth/callback`, `http://localhost:3000/auth/callback?next=/update-password`, and their production equivalents. Configure production SMTP before launch.
4. Copy the URL and public publishable key into `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the actual origin. Restart the app.
5. Sign up, confirm email, and log in. Set your owner name during signup; edit name and city under Your profile. Add a pet, edit it, upload a photo or private health document, and try deletion.

### Development seed

Create `demo+pawr@example.com` through signup with a password you choose privately. On a development project, confirm the account through Supabase Auth administration (or use an email address you control and change the seed's email selector). Run `supabase/seed.sql` in the SQL editor. It creates fictional Milo and Olive profiles and is idempotent. No account passwords or auth tokens are checked in. The public `/demo` contains separate, explicitly fictional photo examples; it does not expose this account.

## Implemented

- Responsive landing page, About page, cream/sage design system, keyboard skip link, mobile workspace navigation.
- Signup, login, logout, email confirmation callback, reset email and password update.
- Verified server sessions and cookie refresh; protected workspace.
- Owner onboarding through signup and editable owner profile.
- Dashboard with a live owner-only pet list and honest empty states.
- Pet create/read/update/delete: species, breed, birth date, sex, weight, temperament, city, vaccinations, neutering, future discovery preference and matching mode.
- Private photo/medical uploads (5 MB limits, MIME allowlists); short-lived signed read links.
- Server-side validation and authorization, RLS, owner roles, separately controlled verification status, loading/error states, save feedback and deletion confirmation.

### Data model and authorization

Milestone 1 includes `profiles`, `user_roles`, `pets`, `pet_photos`, `pet_health_records`, and `pet_verifications`. Owner ID is always derived from the authenticated session. RLS also checks ownership for direct API requests. Profiles and related files remain owner-only even if discovery is opted in. Users cannot grant themselves roles or verification status. Later provider/admin features must implement trusted authorization before exposing privileged operations. Breeding mode is intentionally unavailable.

Uploaded files remain private after a pet is deleted; metadata cascades away, and read policies no longer permit access. Schedule storage cleanup before production to remove these orphaned objects and support complete data erasure. File contents are not malware-scanned in this milestone.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Validation tests exercise invalid dates/weights, disabled breeding, and stripping of injected owner identity. `tests/rls.sql` is an integration script to run in a fresh development Supabase SQL editor after migration; it rolls back its fixtures. Do not run it in production. Browser/auth integration needs a configured Supabase project. This repository does not claim those remote flows have passed without one.

## Deployment

Deploy this repository to Vercel with the Next.js framework preset. Set the three environment variables, update Supabase redirect URLs, and rebuild after changing public variables. The app uses server actions, cookies and private signed URLs; do not export it as static HTML. Native Sites hosting expects static assets or a Cloudflare Worker, so this requested Next.js server application is prepared for Vercel rather than silently replaced with another framework.

## Scope and next review

This milestone does **not** implement matchmaking, chat, services/bookings, checkout, adoption, community, provider/admin dashboards, or AI recommendations. Their visual tiles are labeled future milestones. Future tables and policies should be added alongside their real features, rather than provisioning unused or unreviewed surfaces. No real payment or health compatibility claims are made. Review Milestone 1 before starting Milestone 2.

Production readiness still requires running migration/RLS tests in Supabase, testing email and file flows with two real test accounts, storage lifecycle cleanup, abuse protections, and deployment configuration. Bundled illustrative photos are documented in `public/images/ATTRIBUTION.md`; no real user credentials or medical records are seeded.

### Browser and database checks

`npm test` includes a real PostgreSQL-engine test using PGlite with lightweight Supabase auth/storage schema stubs. It applies the migration (omitting only the unsupported pgcrypto extension; UUID generation is built in) and executes `tests/rls.sql`. This checks SQL syntax, owner access, cross-owner isolation and role escalation; it does not replace live Supabase testing.

With the app running and Supabase variables unset, run `npx playwright install chromium`, then `npx playwright test`. In environments with preinstalled Chromium use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test`. Browser tests cover mobile overflow, navigation, protected route redirects, and honest unconfigured signup errors.
