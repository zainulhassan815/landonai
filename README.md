# Landon AI

AI automation and consulting platform. The MVP ships a clean Apple-esque
public site, Supabase-authenticated user accounts, Stripe subscriptions, and a
PDF Comparison Tool that calls a client-owned OpenAI Workflow.

See [`docs/prd.md`](docs/prd.md) for the product spec and
[`docs/milestones.md`](docs/milestones.md) for the phased delivery plan.

---

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (Radix primitives)
- Supabase (Auth, Postgres, Storage, RLS) via `@supabase/ssr`
- Stripe (subscriptions + webhooks) — wired in Phase 1D
- OpenAI Workflow (client-owned) — wired in Phase 2
- Vitest + Testing Library (unit)
- ESLint + Prettier
- pnpm · Vercel

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in Supabase keys
pnpm dev
```

Open http://localhost:3000 — you should see the **Welcome** screen.

### Required environment variables

| Name                                   | Purpose                                                        |
| -------------------------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL                                           |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key                                |
| `NEXT_PUBLIC_SITE_URL`                 | Public site origin used for absolute metadata + auth redirects |

The app fails fast (clear error from `src/lib/env.ts`) if a required variable
is missing — no silent fallbacks.

## Scripts

| Script                              | Purpose                                            |
| ----------------------------------- | -------------------------------------------------- |
| `pnpm dev`                          | Run Next.js dev server                             |
| `pnpm build`                        | Production build                                   |
| `pnpm start`                        | Run the production build                           |
| `pnpm lint`                         | ESLint (Next + TypeScript + Prettier-compat rules) |
| `pnpm format` / `pnpm format:check` | Prettier write / check                             |
| `pnpm typecheck`                    | `tsc --noEmit`                                     |
| `pnpm test`                         | Vitest unit tests (jsdom)                          |
| `pnpm test:watch`                   | Vitest in watch mode                               |

## Project layout

```
src/
  app/                    Next.js App Router routes
    auth/                 Supabase email auth flow (login, sign-up, reset, confirm)
    layout.tsx            Root layout (light-only, Geist font)
    page.tsx              Welcome / nav-hub home (placeholder for Phase 1B)
    globals.css           Tailwind 4 entry + brand tokens (@theme inline)
  components/
    ui/                   shadcn/ui primitives (button, card, input, label, …)
    auth/                 Auth feature components
  lib/
    env.ts                Required env-var helpers (throws on missing)
    utils.ts              cn() Tailwind classname merger
    auth/
      protected-paths.ts  Path policy used by the proxy + tests
    supabase/
      client.ts           Browser Supabase client
      server.ts           Server Supabase client
      session.ts          Request-proxy session refresh + auth gate
proxy.ts                  Next.js proxy (formerly middleware.ts) — calls updateSession
tests/
  setup.ts                jest-dom matchers
  unit/                   Vitest unit tests, mirror src/ layout
docs/                     PRD, milestones, future design notes
```

## Conventions

- **kebab-case** for files and directories (including docs).
- **Path alias `@/*`** resolves to `src/*`.
- **No silent env fallbacks** — `src/lib/env.ts` throws with a clear message.
- **Light-only theme** (per design brief). Tokens live in `globals.css`
  under `:root` and are mapped to Tailwind utilities via `@theme inline`.
- **Auth gate** is centralised in `src/lib/auth/protected-paths.ts` so the
  proxy and tests stay in sync.

## Deployment

Vercel — `pnpm build` runs `next build`. Set the three env vars in the Vercel
dashboard before the first deploy. See `docs/milestones.md` Phase 4 for the
full launch checklist.
