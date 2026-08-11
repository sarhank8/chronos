# FutureMe

Write letters to your future self — now with profiles, follow requests, private
accounts, DMs, and a letters feed you can share (or keep sealed).

This project was built with [Lovable](https://lovable.dev).

## Setting up the backend (Supabase)

The UI is wired up to Supabase for auth, profiles, follows, letters, and
messages. To turn it on:

1. **Connect Supabase.** In the Lovable editor, click the Supabase button in
   the top bar and connect/create a project. (Or create one yourself at
   [supabase.com](https://supabase.com) and add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` to a `.env` file for local dev.)
2. **Run the schema.** Open the SQL editor in your Supabase project and run
   `supabase/migrations/0001_init.sql`. This creates the `profiles`,
   `follows`, `letters`, and `messages` tables, row-level security policies
   that enforce the private-account/private-letter rules, and a trigger that
   auto-creates a profile row on signup.
3. **Enable email auth.** In Supabase → Authentication → Providers, make sure
   Email is enabled. (For quick local testing you can also turn off "Confirm
   email" under Authentication → Settings.)
4. **Realtime for DMs.** The migration adds the `messages` table to the
   `supabase_realtime` publication so the chat view updates live. If you ran
   the SQL and messages still don't show up live, check Database → Replication
   in the Supabase dashboard and make sure `messages` is toggled on.

### What's in the schema

- **profiles** — one row per user, with `is_private` controlling account
  privacy. Basic profile info (name, avatar, privacy flag) is publicly
  readable so people can find and request to follow an account; letter
  content is locked down separately.
- **follows** — `status` is `pending` or `accepted`. Following a public
  account accepts instantly; following a private account creates a request
  the owner approves from Settings.
- **letters** — each letter has its own `is_private` flag (only the author
  can read it) independent of the account-level privacy, plus an optional
  `deliver_at` date — letters scheduled for the future stay hidden from
  everyone but the author until that date passes.
- **messages** — plain 1:1 direct messages between two users, realtime via
  Supabase's Postgres change feed.

### New pages

`/signup`, `/login`, `/letters` (feed + compose), `/people` (search + follow),
`/profile/$username`, `/settings` (edit profile, privacy toggle, follow
requests), `/messages` and `/messages/$username` (DMs).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/73f88563-2372-490e-a896-ad091ae4fc60).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
