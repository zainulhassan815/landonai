# Landon AI — Milestones (Draft v0.1)

**Last updated:** 2026-05-16

This is a phase-and-milestone breakdown of the MVP build. Phases match the structure the client outlined in the brief (Phase 1: Core SaaS / Phase 2: PDF Tool / Phase 3: Polish & Q&A) plus a Phase 0 for kickoff and a Phase 4 for launch.

Estimates assume one full-stack developer working actively. They can compress with parallel client decisions (brand assets, Stripe price, OpenAI Workflow endpoint).

---

## Phase 0 — Kickoff & Setup (≈ 2–3 days)

**Goal:** Everything provisioned, accounts owned by client, repo wired to deployment.

| #   | Deliverable                         | Done when                                                                                                                          |
| --- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | PRD signed off                      | Client approves this PRD draft (and OPEN QUESTIONS in §10 are answered)                                                            |
| 0.2 | Brand assets received               | Logo, color hex, font, reference image variants                                                                                    |
| 0.3 | Accounts provisioned (client-owned) | Supabase project, Stripe account (test + live), OpenAI account, Vercel project, domain registrar — developer added as collaborator |
| 0.4 | GitHub repo created (client-owned)  | Repo initialized, developer invited, CI baseline (lint + typecheck) green                                                          |
| 0.5 | Next.js skeleton on Vercel          | `landon-ai.vercel.app` live with placeholder homepage                                                                              |
| 0.6 | Env management                      | All secrets in Vercel env vars; `.env.example` committed                                                                           |

---

## Phase 1 — Core Website & SaaS Foundation (≈ 1.5–2 weeks)

**Goal:** Public site live, users can sign up, subscribe, and see their dashboard. No PDF tool yet.

### 1A — Design system & layout primitives (3–4 days)

- [ ] Tailwind config: brand color, type scale, radius, shadow tokens.
- [ ] Background wave SVG component.
- [ ] Top navigation bar component.
- [ ] Welcome block + Nav card components (matches reference image 1:1).
- [ ] Mobile responsive behavior verified across breakpoints.

### 1B — Public pages (2–3 days)

- [ ] `/` Home (logged-out variant).
- [ ] `/consulting` — short, clean services page.
- [ ] `/resources` — placeholder.
- [ ] `/pricing` — single plan + free-trial copy.
- [ ] `/contact` — form → Supabase + email notification.

### 1C — Authentication (2 days)

- [ ] Supabase Auth wired (email + password, password reset, email verification).
- [ ] `/signup`, `/login`, `/reset-password` screens (on-brand).
- [ ] Protected route middleware.
- [ ] Signup trigger: provisions `profile` + `free_token` + empty `subscription`.
- [ ] Optional: captcha on signup, disposable-email blocklist.

### 1D — Stripe subscription (2–3 days)

- [ ] One subscription product + price configured.
- [ ] Stripe Checkout session creation.
- [ ] Webhook handler (`checkout.session.completed`, `subscription.updated`, `subscription.deleted`, `invoice.payment_failed`).
- [ ] `subscriptions` table sync.
- [ ] Stripe Customer Portal link from `/account`.

### 1E — Dashboard & account (1–2 days)

- [ ] `/` Home (logged-in) — same layout, populated avatar.
- [ ] `/account` — profile, subscription status + manage button, free-token status, comparison history (empty for now).

**Phase 1 exit criteria:** A new user can sign up → land on dashboard → subscribe → see their subscription reflected in `/account` → cancel via Stripe portal. All public pages live and on-brand.

---

## Phase 2 — PDF Comparison Tool (≈ 1.5–2 weeks)

**Goal:** Core feature works end-to-end against the client's OpenAI Workflow.

### 2A — File upload & validation (2–3 days)

- [ ] `/tools` portal entry (gated by auth).
- [ ] `/tools/pdf-compare` UI: 2–6 file slots, label inputs, drag-drop.
- [ ] Direct-to-Supabase Storage signed-URL uploads (skips Vercel route limits).
- [ ] Client + server validation: file type, size, count.
- [ ] Per-user storage folder + RLS policies.

### 2B — Comparison submission flow (3–4 days)

- [ ] `comparisons` + `comparison_files` schema with RLS.
- [ ] Server action: entitlement check → create row → call client's OpenAI Workflow.
- [ ] In-flight lock per user (no double-submit).
- [ ] Loading/progress UI (Realtime subscription on the comparison row).
- [ ] Error states surfaced cleanly; failed runs do not consume the free token.

### 2C — Result rendering (2 days)

- [ ] `/tools/pdf-compare/[id]` result page.
- [ ] Markdown renderer (headings, lists, tables, code blocks).
- [ ] Structured-JSON renderer fallback.
- [ ] Copy-to-clipboard action.
- [ ] Comparison history list on `/account`.

### 2D — Free-token + subscription gating (1 day)

- [ ] Entitlement helper used by both UI and server action.
- [ ] Free-token flips on first successful run only.
- [ ] Pricing CTA shown to users with no entitlement.

**Phase 2 exit criteria:** A user can upload 2–6 PDFs, label them, hit Compare, see a loading state, and view a clean rendered report. Free token enforced. Subscription gating enforced. All files private.

---

## Phase 3 — Polish, Limits, Admin & Q&A (≈ 1–1.5 weeks)

**Goal:** Production-ready hardening and remaining nice-to-haves from the brief.

### 3A — Cost-control hardening (2 days)

- [ ] Per-user rate limits (daily + monthly) via Upstash or Postgres.
- [ ] Edge middleware on auth/signup/submit endpoints.
- [ ] Usage events logging table populated end-to-end.
- [ ] Pre-flight PDF validation (page count, optional text-extraction sanity check).

### 3B — Admin panel (2 days)

- [ ] `/admin` (role-gated).
- [ ] User list with subscription/token/comparison-count columns.
- [ ] Drill-down per user.
- [ ] Actions: disable user, manually grant token.
- [ ] Aggregate usage chart (daily comparisons, error rate).

### 3C — Follow-up Q&A (2 days, scope-flagged)

- [ ] Chat UI on result page tied to `comparisons.id`.
- [ ] Server action calls workflow with prior context + new question.
- [ ] Messages stored in `followup_messages`.
- [ ] Counts toward usage limits.

### 3D — Export & polish (1–2 days)

- [ ] Export comparison as PDF (print stylesheet).
- [ ] Final UI polish pass: spacing, hover states, empty states, micro-copy.
- [ ] Sentry wired; error boundaries on all routes.
- [ ] Accessibility audit (keyboard nav, focus states, color contrast).

**Phase 3 exit criteria:** App is robust to common abuse vectors, owner can manage users, optional Q&A works, polish complete.

---

## Phase 4 — Launch (≈ 2–3 days)

**Goal:** Go live on the client's domain with confidence.

| #   | Deliverable              | Done when                                                                          |
| --- | ------------------------ | ---------------------------------------------------------------------------------- |
| 4.1 | Domain connected         | Custom domain bound to Vercel, SSL issued, DNS verified                            |
| 4.2 | Stripe live mode         | Live keys configured, webhook endpoint live, test purchase verified                |
| 4.3 | OpenAI live workflow     | Production workflow endpoint configured                                            |
| 4.4 | Email sender domain      | Resend sender domain DKIM/SPF verified                                             |
| 4.5 | End-to-end smoke test    | Full signup → subscribe → run comparison → cancel flow on production               |
| 4.6 | Owner handover doc       | Short README covering: deploying changes, env vars, granting tokens, common issues |
| 4.7 | Two-account isolation QA | Account A cannot see Account B's files, comparisons, or history                    |

---

## Total Timeline Estimate

| Phase                    | Duration                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| Phase 0 — Kickoff        | 2–3 days                                                                                        |
| Phase 1 — Core SaaS      | 1.5–2 weeks                                                                                     |
| Phase 2 — PDF Tool       | 1.5–2 weeks                                                                                     |
| Phase 3 — Polish & Admin | 1–1.5 weeks                                                                                     |
| Phase 4 — Launch         | 2–3 days                                                                                        |
| **Total**                | **~5–7 weeks** end-to-end, depending on client decision velocity and OpenAI Workflow readiness. |

---

## Critical Path Dependencies

These items unblock other work and should be answered/delivered as early as possible:

1. **OpenAI Workflow contract** — request/response shape, timeout, file vs. URL input. Blocks Phase 2B.
2. **Stripe price** — final amount + currency + interval. Blocks Phase 1D and Phase 4.2.
3. **Brand assets** — logo + color hex + font. Blocks Phase 1A.
4. **Domain access** — DNS for Vercel binding. Blocks Phase 4.1.
5. **Per-plan limits** — daily/monthly comparison caps + max file size. Blocks Phase 3A.

---

## Out of Scope (Explicitly)

To keep the MVP focused, the following are noted as explicitly _not_ included and are tracked for v1.1+:

- Additional AI tools beyond PDF comparison (architecture supports them — content does not exist yet).
- Team / multi-seat accounts.
- Multi-tier pricing.
- CMS-backed Resources content.
- Native mobile apps.
- Full analytics dashboard beyond the basic admin usage view.
