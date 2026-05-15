# Landon AI — Product Requirements Document (Draft v0.1)

**Status:** Draft for client review
**Last updated:** 2026-05-16
**Author:** [Developer proposal — pre-engagement draft]

---

## 1. Background & Vision

Landon AI is a small AI automation and consulting business that wants a polished online presence and a private, subscription-based portal where customers can run AI-powered tools. The MVP launches with a single tool — a **PDF Comparison Tool** that compares 2–6 PDFs and returns a structured AI-generated report — but the product is intended to grow into a multi-tool AI workflow platform over time.

The public site is intentionally not a long, text-heavy consulting site. Visitors are assumed to already be interested in AI, automation, or document workflows. The home page works more like a clean navigation hub that quickly routes them to Tools, Consulting, Resources, Pricing, or Contact.

### 1.1 Goals

1. Establish a premium, Apple-esque brand presence for Landon AI.
2. Convert visitors into signed-up users via a low-friction free trial (1 free PDF comparison).
3. Convert free users into paid subscribers via Stripe.
4. Deliver a working, secure PDF Comparison Tool wired to the client's own OpenAI Workflow.
5. Lay a modular foundation so additional AI tools can be added without re-architecting.

### 1.2 Non-goals (for MVP)

- No long-form marketing/SEO content site.
- No multi-tier pricing matrix — one paid plan is acceptable for v1.
- No multi-tenant / team accounts — single-user accounts only.
- No mobile native apps — responsive web only.
- No in-house AI prompt engineering — the client owns the OpenAI Workflow logic.

### 1.3 Success Metrics

- Time from landing on home → signup ≤ 30 seconds.
- A new user can run their first PDF comparison in under 2 minutes after signup.
- 99%+ of comparison runs either succeed or surface a clear, actionable error.
- Zero leakage of user files or comparison results across accounts (RLS-enforced).
- Per-user OpenAI cost is bounded by enforced rate/usage limits.

---

## 2. Personas

| Persona                        | Description                                                     | Primary needs                                                             |
| ------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Insurance broker (primary)** | Compares expiring vs. renewal policies, quote options.          | Fast, structured side-by-side comparison output; private file storage.    |
| **SMB operator**               | General PDF comparison — proposals, contracts, vendor docs.     | Generic comparison output; trustworthy data handling.                     |
| **Consulting prospect**        | Found Landon AI via referral; wants to talk before subscribing. | Clear consulting page + easy contact form.                                |
| **Owner/Admin (Landon)**       | Operates the business, manages users and usage.                 | User list, subscription/token visibility, manual token grant, usage data. |

---

## 3. Design System

The reference image (`Welcome` screen with vertical nav cards) is the visual north star. The full app — public site, dashboard, and tools — should feel like one product.

### 3.1 Visual Language

- **Background:** White (`#FFFFFF`) with subtle abstract red wave/line accents (corners only — top-right and bottom-left as in reference).
- **Primary accent:** Red (target around `#E5484D` / `#EF4444` — to be finalized).
- **Typography:** Clean sans-serif (Inter or SF Pro fallback). Large, bold welcome headlines; light gray subtitles.
- **Cards:** White, large rounded corners (~14–16px radius), soft 1px border, very subtle shadow, comfortable internal padding.
- **Icons:** Thin red outline icons on the left of each nav card; gray utility icons in the top bar.
- **Spacing:** Generous. The page should feel calm, not packed.
- **Tone:** Premium, calm, professional, Apple-esque.

### 3.2 Layout Primitives (reused across product)

- **Top nav:** Logo + brand name (left); help / notifications / settings / avatar + dropdown (right). Subtle bottom border.
- **Welcome block:** Centered headline + one-line subtitle, used on dashboard and tool entry pages.
- **Nav card:** Icon (left) · Label · Right chevron. Hover state lifts shadow slightly.
- **Background waves:** Decorative SVG, low opacity, non-interactive.

### 3.3 Responsiveness

- Mobile-first breakpoints. Nav cards stack full-width on mobile. Top bar collapses utility icons into an overflow menu if necessary.

---

## 4. Information Architecture

```
/                          → Home (nav hub — same layout for logged-out & logged-in)
/tools                     → Tools portal (locked behind auth)
/tools/pdf-compare         → PDF Comparison Tool
/tools/pdf-compare/[id]    → Saved comparison result + follow-up Q&A
/consulting                → Consulting overview
/resources                 → Placeholder (CMS-ready) for future content
/pricing                   → Pricing + plan CTA
/contact                   → Contact / consultation request form
/login   /signup   /reset  → Auth screens
/account                   → Account, subscription, token status, billing portal link
/admin                     → Owner-only admin (users, usage, manual grants)
```

The home page is the same component for logged-out and logged-in users; only the avatar/account state differs. This keeps the experience consistent (per the spec: "the dashboard should feel like the same product").

---

## 5. Functional Requirements

### 5.1 Public Pages

| Page           | Requirements                                                                                                                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Home**       | Top nav, centered Welcome headline + subtitle, vertical stack of 5 nav cards (Tools, Consulting, Resources, Pricing, Contact), background wave accents. Identical layout pre- and post-login (see §4). |
| **Consulting** | Short, scannable explanation of services (manual work reduction, document review, repetitive workflows, data entry, internal processes, client communication, custom AI tooling). CTA → Contact.       |
| **Resources**  | Placeholder. Single "coming soon" panel + nav back. Architected to accept MDX/CMS content later.                                                                                                       |
| **Pricing**    | One paid plan card + free-trial explanation ("1 free PDF comparison after signup"). Subscribe CTA → Stripe Checkout.                                                                                   |
| **Contact**    | Simple form (name, email, message, optional consultation checkbox). Submissions stored in Supabase + email notification to owner.                                                                      |

### 5.2 Authentication

- Supabase Auth (email + password at minimum; magic link optional).
- Sign up, log in, log out, password reset.
- Session persisted; protected routes redirect to `/login`.
- On signup, server-side trigger provisions: `profile` row, `free_token` row (`used = false`), `subscription` row (`status = none`).
- Reasonable abuse protections on free-token creation:
  - Email verification required before token becomes usable.
  - Optional: Cloudflare Turnstile / hCaptcha on signup.
  - Optional: block disposable email domains.

### 5.3 Subscription & Billing (Stripe)

- One MVP plan (price + interval finalized with client).
- Stripe Checkout for new subscriptions; Stripe Customer Portal for managing/canceling.
- Webhooks handled server-side: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
- `subscriptions` table is the source of truth in our DB (status, current_period_end, stripe_customer_id, stripe_subscription_id).
- Access to PDF comparison (beyond the free token) gates on `subscription.status IN ('active', 'trialing')`.

### 5.4 Free Token

- Each user gets exactly **1** free PDF comparison token at signup.
- `free_token_used` flips to `true` on first successful submission to the OpenAI Workflow (not on upload, not on validation failure).
- Owner can manually grant additional tokens via admin panel.
- Token only applies to PDF Comparison Tool (future tools may have their own trial logic).

### 5.5 PDF Comparison Tool (the core feature)

#### Inputs

- 2–6 PDF files. Hard caps enforced both client- and server-side.
- Each file accepts an optional label (e.g., "Expiring Policy", "Renewal Policy", "Quote Option 1").
- File size cap: **target 25 MB per file**, **75 MB per submission** (final values TBD with client based on OpenAI Workflow limits).
- File-type validation: MIME + magic-byte check; reject non-PDF.

#### Flow

1. User opens `/tools/pdf-compare`. UI shows current entitlement (free token available / active subscription / locked).
2. User uploads 2–6 PDFs and labels them. Files upload to Supabase Storage in a per-user folder (`user_id/comparisons/{comparison_id}/...`), private bucket, signed-URL access only.
3. User clicks **Compare**. Submit button is debounced and disabled while in flight (prevents double-submit / rapid re-clicks).
4. Server validates entitlement → creates `comparison` row in `processing` state → calls the client's OpenAI Workflow endpoint with file references + labels.
5. UI shows progress / loading state (skeleton + status polling, or Supabase Realtime subscription on the comparison row).
6. On workflow success: report saved to DB, `free_token_used` flipped if applicable, UI navigates to `/tools/pdf-compare/[id]`.
7. On workflow failure: user is shown a clear error, no token is consumed, retry available.

#### Output Display

- Renders both **Markdown** and **structured JSON** output cleanly (the workflow may return either).
- Section headings, bullet lists, tables rendered with consistent typography.
- Actions on the result page:
  - Copy report (full text → clipboard).
  - Export as PDF (in scope — client side via headless print stylesheet; phase 3).
  - Follow-up Q&A chat tied to that specific comparison (phase 3, scope-flagged).
  - Delete comparison.

#### Access rules (recap)

| User state                             | Can run?                         |
| -------------------------------------- | -------------------------------- |
| Logged-out                             | No — redirected to signup/login. |
| New user, free token unused            | Yes (1 time).                    |
| User, free token used, no subscription | No — pricing CTA shown.          |
| Active subscriber                      | Yes, subject to rate limits.     |

### 5.6 OpenAI Workflow Integration

- All OpenAI API keys and workflow credentials live in Vercel environment variables (server-side only).
- Calls happen from a Next.js Route Handler / server action — never the browser.
- Request payload includes signed file URLs (or direct file content, depending on the client's workflow), labels, and a per-comparison correlation ID.
- Response is persisted verbatim alongside a parsed/normalized version for display.
- The developer's responsibility ends at "send files + labels to the client's workflow endpoint and render the response." The client owns prompt design and report content.

### 5.7 Cost Control & Abuse Prevention

- Auth + entitlement check on every comparison call.
- Per-user rate limit (e.g., max N comparisons per day, M per month — final numbers per plan, TBD with client).
- File-size and file-count enforcement server-side.
- Pre-flight PDF validation before any OpenAI call (extension, MIME, size, page count optional).
- Server-side debounce: a row-level "in-flight" flag per user prevents concurrent submissions.
- Edge middleware rate limit on auth, signup, and submission endpoints (Upstash or in-Postgres counter).
- All usage events logged to a `usage_events` table for visibility and forensics.

### 5.8 Account & Dashboard

- After login, user lands on Home (same layout) with avatar populated.
- `/account` page shows: profile basics, subscription status + manage button (Stripe portal), free-token status, usage summary, link to comparison history.
- Comparison history list with status, created date, file labels, and link to result.

### 5.9 Admin Panel

Minimal but functional. Owner-only (role check on `profiles.role = 'admin'`).

- List users: email, signup date, subscription status, free-token status, comparison count.
- Drill into a user → see their comparisons (metadata only, not file contents unless explicitly opened).
- Actions: disable user, manually grant additional token, refund/cancel link to Stripe.
- Aggregate usage view: comparisons per day, OpenAI call count, error rate.

---

## 6. Data Model (initial sketch)

```
profiles            (id PK = auth.users.id, email, full_name, role, created_at, disabled)
subscriptions      (user_id FK, stripe_customer_id, stripe_subscription_id,
                     status, current_period_end, plan_id, updated_at)
free_tokens        (user_id FK, used boolean, used_at, granted_by)
comparisons        (id PK, user_id FK, status, created_at, completed_at,
                     file_count, label_set jsonb, result_markdown, result_json,
                     openai_workflow_run_id, error_message)
comparison_files   (id PK, comparison_id FK, storage_path, original_name,
                     label, size_bytes, mime_type)
followup_messages  (id PK, comparison_id FK, role, content, created_at)
usage_events       (id PK, user_id FK, event_type, metadata jsonb, created_at)
contact_submissions(id PK, name, email, message, consultation boolean, created_at)
```

All tables are protected with Supabase Row-Level Security:

- A user can read/write only rows where `user_id = auth.uid()`.
- Storage policies restrict bucket access to the owning user's folder.
- Admin role bypasses RLS via dedicated policies.

---

## 7. Tech Stack

| Layer               | Choice                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| Frontend            | Next.js (App Router) + React + TypeScript                                   |
| Styling             | Tailwind CSS + Radix primitives (or shadcn/ui) for accessibility            |
| Backend             | Next.js Route Handlers + Server Actions (no separate backend)               |
| Auth & DB & Storage | Supabase (Postgres, Auth, Storage, RLS)                                     |
| Payments            | Stripe Checkout + Customer Portal + Webhooks                                |
| AI                  | Client-owned OpenAI Workflow (we integrate via server-side API call)        |
| Hosting             | Vercel                                                                      |
| Repo                | GitHub (client owns)                                                        |
| Email               | Resend (transactional) — for contact form, password reset, payment receipts |
| Rate limit          | Upstash Redis (or Postgres-backed counter for MVP)                          |
| Monitoring          | Sentry (errors), Vercel Analytics (basic traffic)                           |

---

## 8. Security & Privacy

- All API keys and Stripe/OpenAI secrets in Vercel env vars; never shipped to client bundle.
- Supabase RLS enforced on every table containing user data.
- Storage bucket private; access only via short-lived signed URLs.
- HTTPS-only; HSTS header; CSP header on all pages.
- Audit log via `usage_events`.
- Stripe webhook signature verification.
- Password reset rate-limited.
- No file content logged to error monitoring.

---

## 9. Scope: MVP vs. Future

### In MVP (Phases 1–3)

- All pages listed in §4.
- Auth, free token, Stripe subscription.
- PDF Comparison Tool (2–6 PDFs) end-to-end.
- Markdown + JSON result rendering.
- Copy + export-to-PDF.
- Follow-up Q&A tied to a comparison.
- Basic admin (users, tokens, manual grant, usage view).
- Vercel deploy + custom domain.

### Future / Out of MVP

- Additional tools (summarizer, renewal review, email generator, data extraction, etc.) — architecture supports them, content is later.
- Team/multi-user accounts.
- Multi-tier pricing.
- Public Resources content (CMS integration).
- Advanced analytics / cohort dashboards.
- Native mobile apps.

---

## 10. Open Questions for Client

1. **Brand:** Confirm exact logo file, brand color hex, and final type face.
2. **OpenAI Workflow:** What's the expected request/response shape and timeout? Are we sending file bytes, signed URLs, or extracted text?
3. **Pricing:** Final monthly price, currency, and any annual option.
4. **Limits:** Max comparisons per day/month for paid users? Max file size?
5. **Email domain:** Custom sender domain for Resend (e.g., `noreply@landon.ai`).
6. **Domain:** Final domain name and registrar; access for DNS/Vercel binding.
7. **Follow-up Q&A:** Confirm in scope for MVP or push to v1.1?
8. **Admin needs:** Acceptable as a simple internal page in v1, or do you want a separate admin sub-domain?
9. **Compliance:** Any data residency or regulatory constraints (insurance broker context could mean GDPR or similar)?

---

## 11. Risks & Mitigations

| Risk                                                | Mitigation                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| OpenAI Workflow latency exceeds web request timeout | Async pattern: enqueue → background task → Realtime push to UI.             |
| Large PDF uploads block UI / hit Vercel limits      | Direct-to-Supabase signed-URL uploads, not via API route.                   |
| Free token abuse via duplicate signups              | Email verification + optional captcha + disposable-domain blocklist.        |
| Runaway OpenAI cost                                 | Per-user rate limits, in-flight lock, pre-flight validation, usage logging. |
| Cross-tenant data leak                              | RLS on every table + storage policies + tested with two-account QA.         |
| Vendor lock concerns                                | Client owns all accounts, repo, and infra from day one.                     |

---

## 12. Acceptance Criteria (top-level)

- [ ] A new visitor can sign up, verify email, see the dashboard, and run one PDF comparison without paying.
- [ ] A second comparison attempt without subscribing is blocked with a clear pricing CTA.
- [ ] Subscribing via Stripe Checkout immediately unlocks the tool; canceling immediately blocks new comparisons after period end.
- [ ] PDF Comparison Tool accepts 2–6 PDFs, validates them, calls the client's workflow, and renders the report.
- [ ] All comparisons are saved to the user's account and only visible to that user.
- [ ] Owner can log in to `/admin` and view users, status, usage, and grant tokens.
- [ ] App is deployed on Vercel at the client's domain over HTTPS.
- [ ] Client owns and has admin access to: GitHub repo, Vercel project, Supabase project, Stripe account, OpenAI account, domain.
