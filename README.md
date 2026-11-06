# Chronos

> Sealed until the day it matters. Write a letter to the person you are becoming.

Chronos is a social letter-writing app. Put today into words (the doubts, the plans, the small wins) and Chronos keeps the letter sealed until the exact day you choose. It also has profiles, follow requests, private accounts, direct messages, and a global board.

## Features

- **Letters to your future self**: schedule a letter with a delivery date. It stays hidden from everyone except the author until that date passes.
- **Per-letter privacy**: mark any letter private so only you can read it, independent of your account settings.
- **Global Board**: a shared space for public letters.
- **Profiles and following**: find people, follow public accounts instantly, or send follow requests to private accounts.
- **Private accounts**: owners approve follow requests from Settings.
- **Direct messages**: 1:1 chat with live updates via Supabase Realtime.
- **Authentication**: email-based signup and login.

## Tech stack

- [TanStack Start](https://tanstack.com/start) and [TanStack Router](https://tanstack.com/router)
- [React 19](https://react.dev) with [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) and [Radix UI](https://www.radix-ui.com) primitives
- [Supabase](https://supabase.com) for auth, database, and realtime
- [TanStack Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com), and [Zod](https://zod.dev)

## Prerequisites

- [Node.js](https://nodejs.org) 20.19 or newer, and npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A [Supabase](https://supabase.com) project

## Installation

```sh
git clone https://github.com/sarhank8/chronos.git
cd chronos
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Find both values in your Supabase dashboard under **Project Settings → API**. If you use the Lovable editor, you can connect Supabase with the button in the top bar instead.

## Backend setup (Supabase)

1. **Run the schema.** Open the SQL editor in your Supabase project and run `supabase/migrations/0001_init.sql`. It creates the tables, row-level security policies, and a trigger that auto-creates a profile on signup.
2. **Enable email auth.** Go to **Authentication → Providers** and make sure Email is enabled. For quick local testing, you can turn off "Confirm email" under **Authentication → Settings**.
3. **Check Realtime for DMs.** The migration adds `messages` to the `supabase_realtime` publication. If messages don't update live, go to **Database → Replication** and make sure `messages` is toggled on.

### Database schema

| Table | Purpose |
|-------|---------|
| `profiles` | One row per user. `is_private` controls account privacy. Name, avatar, and privacy flag are publicly readable so people can find and follow accounts. |
| `follows` | `status` is `pending` or `accepted`. Public accounts accept instantly; private accounts require owner approval. |
| `letters` | Each letter has its own `is_private` flag and an optional `deliver_at` date. Future-dated letters are visible only to the author. |
| `messages` | Plain 1:1 direct messages, delivered in realtime via Supabase's Postgres change feed. |

## Usage

Start the development server:

```sh
npm run dev
```

Open the local URL printed in your terminal (the dev server runs on port 8080 in this setup).

### Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Create a build in development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the codebase with Prettier |

### Pages

| Route | Description |
|-------|-------------|
| `/signup`, `/login` | Create an account or sign in |
| `/letters` | Letters feed and compose view |
| Global Board | Public letters from everyone |
| `/people` | Search for people and follow them |
| `/profile/$username` | A user's profile |
| `/settings` | Edit profile, privacy toggle, follow requests |
| `/messages` | Conversation list |
| `/messages/$username` | Direct messages with a user |

## Project structure

```
.
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and Supabase client
│   ├── routes/          # File-based routes (TanStack Router)
│   ├── router.tsx       # Router setup
│   ├── routeTree.gen.ts # Auto-generated route tree (do not edit)
│   ├── server.ts        # Server entry
│   ├── start.ts         # TanStack Start entry
│   └── styles.css       # Global styles and Tailwind config
├── supabase/
│   └── migrations/
│       └── 0001_init.sql   # Schema, RLS policies, triggers
└── package.json
```

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch: `git checkout -b feature/your-feature`
2. Make your changes and run `npm run lint` and `npm run format`
3. Commit with a clear message and push your branch
4. Open a pull request describing what you changed and why

You can also keep developing in the [Lovable editor](https://lovable.dev/projects/73f88563-2372-490e-a896-ad091ae4fc60). Changes made there are committed to this repository, and pushes to `main` sync back into Lovable.

## License

No license has been chosen yet. Until one is added, all rights are reserved by the author.

## Contact

Maintained by [@sarhank8](https://github.com/sarhank8). For bugs and feature requests, please [open an issue](https://github.com/sarhank8/chronos/issues).