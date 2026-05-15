# Supabase email templates

Branded HTML templates for the Supabase Auth emails. Paste each one into
**Supabase Dashboard → Authentication → Email Templates**.

| Template            | File                     | Suggested subject                    | Dashboard tab          |
| ------------------- | ------------------------ | ------------------------------------ | ---------------------- |
| Sign-up confirmation | `confirm-signup.html`   | `Confirm your Landon AI account`    | **Confirm signup**     |
| Password reset      | `reset-password.html`    | `Reset your Landon AI password`     | **Reset password**     |
| Magic link          | `magic-link.html`        | `Your Landon AI sign-in link`       | **Magic Link**         |
| Email change        | `email-change.html`      | `Confirm your new email address`    | **Change Email Address** |

## One-time configuration

These templates link to our own `/confirm` route handler (not Supabase's
default verify endpoint), which lets us redirect to a chosen `next` page
after verification. Two settings need to match:

1. **Site URL** — Dashboard → Authentication → URL Configuration → set
   to `https://landonai.vercel.app` (or the production domain). The
   `{{ .SiteURL }}` variable in every template renders from this value.

2. **Redirect URLs** — Same screen, *Redirect URLs* allow-list. Add:
   - `https://landonai.vercel.app/confirm`
   - `https://landonai.vercel.app/update-password`
   - (and the equivalents for any other deployed environments)

   Without these, Supabase will refuse to honour the `next` parameter and
   the password-reset flow will land users on the home page instead of
   `/update-password`.

## URL pattern

Every template sends the user to:

```
{{ .SiteURL }}/confirm?token_hash={{ .TokenHash }}&type=<TYPE>[&next=<PATH>]
```

Where `<TYPE>` is one of `signup`, `recovery`, `magiclink`, or
`email_change`. The `/confirm` handler (`src/app/(auth)/confirm/route.ts`)
calls `supabase.auth.verifyOtp({ token_hash, type })` and then redirects
to `next` (defaulting to `/`).

> **Don't use `{{ .ConfirmationURL }}`.** That variable bakes in
> Supabase's own verify endpoint and ignores our `next` parameter.

## Deliverability — recommended

Default Supabase SMTP works for development but is rate-limited
(2 emails / hour for free tier) and uses a shared `noreply@…supabase.co`
sender that some inboxes flag as spam.

For production, plug in **Resend** as the custom SMTP provider:

1. Verify the sending domain in Resend (DKIM + SPF DNS records).
2. Dashboard → Project Settings → Auth → SMTP Settings → enable Custom SMTP.
3. Host: `smtp.resend.com`, Port: `465`, User: `resend`, Pass: your
   Resend API key. Sender: `noreply@<your-domain>`.

This is also what the contact form (PRD §10 q5) is waiting on — the same
sender domain unblocks both flows.

## Updating

Edit the files here, then paste the new HTML into the dashboard for each
template. There is no automatic sync — Supabase doesn't read these from
the repo today. Once the Supabase CLI is wired up (`supabase init` +
linked project), `supabase/config.toml` can reference these files and
`supabase db push` will install them.
