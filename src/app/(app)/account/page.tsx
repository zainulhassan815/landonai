import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CreditCard,
  Mail,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BillingButton } from "@/components/account/billing-button";
import { ComparisonHistory } from "@/components/account/comparison-history";
import { getCurrentUser } from "@/lib/auth/current-user";
import { DEMO_HISTORY } from "@/lib/tools/demo-data";

export const metadata: Metadata = {
  title: "Account",
  description: "Your profile, plan, and comparison history.",
};

function AccountSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-24 sm:pt-16">
      <div className="mx-auto h-12 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="mx-auto mt-4 h-5 w-72 animate-pulse rounded-full bg-muted" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="h-44 animate-pulse rounded-2xl bg-muted" />
        <div className="h-44 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="mt-14 h-32 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountBody />
    </Suspense>
  );
}

async function AccountBody() {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-24 sm:pt-16">
      <header className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Account
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Your profile, plan, and comparison history.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
              <UserRound
                className="size-4"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </span>
            <h2 className="text-base font-semibold text-foreground">
              Profile
            </h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="size-3.5" strokeWidth={1.75} />
                Email
              </dt>
              <dd className="mt-1 truncate font-medium text-foreground">
                {user.email}
              </dd>
            </div>
          </dl>
          <Button asChild variant="outline" size="sm" className="self-start">
            <Link href="/contact">Need to change something?</Link>
          </Button>
        </section>

        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Sparkles
                  className="size-4"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </span>
              <h2 className="text-base font-semibold text-foreground">Plan</h2>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700"
            >
              Active
            </Badge>
          </div>

          <div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              Pro
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              $49 / month · unlimited comparisons.
            </p>
          </div>

          <dl className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1.5">
                <CalendarClock className="size-3.5" strokeWidth={1.75} />
                Next invoice
              </dt>
              <dd className="text-foreground">May 15, 2026</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1.5">
                <CreditCard className="size-3.5" strokeWidth={1.75} />
                Payment
              </dt>
              <dd className="text-foreground">Visa ending 4242</dd>
            </div>
          </dl>

          <BillingButton />
        </section>
      </div>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Comparison history
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every report stays here for as long as your account is active.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/tools/pdf-compare">
              <Plus className="size-4" strokeWidth={2} />
              New comparison
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          <ComparisonHistory comparisons={DEMO_HISTORY} />
        </div>
      </section>
    </div>
  );
}
