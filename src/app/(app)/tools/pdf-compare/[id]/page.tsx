import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  FileText,
  Loader2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResultActions } from "@/components/tools/result-actions";
import {
  findComparison,
  formatBytes,
  type Comparison,
} from "@/lib/tools/demo-data";

export const metadata: Metadata = {
  title: "Comparison report",
};

const RUN_REPORT_TEXT = `Comparison report — Renewal vs. expiring home policy

Summary
- Renewal premium up 9.5% ($1,840 → $2,015), with expanded property/liability limits.
- Alt. carrier (AC Insurance) offers comparable coverage at a 4% lower premium.
- Two new exclusions on the renewal: water damage from gradual leak; identity theft restoration.
- Inflation-guard endorsement added at no extra cost.

Side-by-side coverage
  Item                      Expiring     Renewal      Alt. carrier
  Property limit            $500,000     $750,000     $750,000
  Personal liability        $300,000     $500,000     $500,000
  Deductible                $1,000       $1,500       $1,000
  Annual premium            $1,840       $2,015       $1,935
  Inflation guard           No           Yes          Yes
  Water-damage (gradual)    Covered      Excluded     Covered

Recommendations
1. Request a binder from AC Insurance using matched coverage levels — there's a clear price advantage worth confirming.
2. Confirm the gradual-leak exclusion does not affect your existing claims history (covered leak claim, 2024).
3. The higher deductible is offset by the new inflation-guard endorsement — accept if comfortable.
4. If you want identity-theft cover, add it as an endorsement (~$60/year) rather than switching plans.`;

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ChangeArrow({ direction }: { direction: "up" | "down" }) {
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;
  const tone =
    direction === "up" ? "text-destructive" : "text-emerald-600";
  return (
    <Icon className={`inline size-3.5 ${tone}`} strokeWidth={2.5} />
  );
}

function ProcessingState({ comparison }: { comparison: Comparison }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 pt-24 pb-24 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Loader2 className="size-7 animate-spin" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
        Comparing your documents
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        {comparison.title}. We&apos;ll be done in a few seconds — the page
        will refresh automatically.
      </p>
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-24 sm:pt-16">
      <div className="h-4 w-32 animate-pulse rounded-full bg-muted" />
      <div className="mt-8 space-y-3">
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export default function ComparisonResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <ResultBody params={params} />
    </Suspense>
  );
}

async function ResultBody({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const comparison = findComparison(id);

  if (comparison.status === "processing") {
    return <ProcessingState comparison={comparison} />;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-24 sm:pt-16">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground print:hidden"
      >
        <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        Back to history
      </Link>

      <header className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              Complete
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {comparison.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Compared {comparison.files.length} files ·{" "}
              {formatLongDate(comparison.createdAt)}
              {comparison.durationSeconds
                ? ` · ran in ${comparison.durationSeconds}s`
                : ""}
            </p>
          </div>
          <ResultActions copyText={RUN_REPORT_TEXT} />
        </div>

        <ul className="flex flex-wrap gap-2">
          {comparison.files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm"
            >
              <FileText
                className="size-3.5 text-brand"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="font-medium text-foreground">{file.label}</span>
              <span className="text-muted-foreground/70">·</span>
              <span className="truncate">{file.filename}</span>
              <span className="text-muted-foreground/70">·</span>
              <span>{formatBytes(file.sizeBytes)}</span>
            </li>
          ))}
        </ul>
      </header>

      <article className="mt-10 space-y-12">
        <section>
          <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            <Sparkles className="size-3.5 text-brand" strokeWidth={2.5} />
            Summary
          </div>
          <p className="mt-3 text-lg leading-relaxed text-foreground">
            The renewal carrier raised the annual premium by{" "}
            <span className="font-semibold text-foreground">
              9.5% ($1,840 → $2,015)
            </span>{" "}
            while expanding the property and liability limits. A competing
            quote from AC Insurance offers comparable coverage at a{" "}
            <span className="font-semibold text-foreground">
              4% lower premium
            </span>
            . Two new exclusions appear on the renewal — review the{" "}
            <span className="font-medium text-foreground">water-damage</span>{" "}
            and{" "}
            <span className="font-medium text-foreground">identity-theft</span>{" "}
            sections before signing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Key changes</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="up" />
              <span>
                Annual premium up <strong>9.5%</strong> — $1,840 → $2,015.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="up" />
              <span>
                Property coverage limit raised from{" "}
                <strong>$500,000</strong> to <strong>$750,000</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="up" />
              <span>
                Personal liability raised from <strong>$300,000</strong> to{" "}
                <strong>$500,000</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="up" />
              <span>
                Deductible increased from <strong>$1,000</strong> to{" "}
                <strong>$1,500</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="up" />
              <span>
                New exclusion — water damage from gradual leak.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="up" />
              <span>
                New exclusion — identity-theft restoration services.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <ChangeArrow direction="down" />
              <span>
                Inflation-guard endorsement added at no extra cost.
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Side-by-side coverage
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <th scope="col" className="px-4 py-3">
                    Coverage item
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Expiring policy
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Renewal quote
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Alt. carrier quote
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Property limit
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    $500,000
                  </td>
                  <td className="px-4 py-3 text-foreground">$750,000</td>
                  <td className="px-4 py-3 text-foreground">$750,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Personal liability
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    $300,000
                  </td>
                  <td className="px-4 py-3 text-foreground">$500,000</td>
                  <td className="px-4 py-3 text-foreground">$500,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Deductible
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">$1,000</td>
                  <td className="px-4 py-3 text-foreground">$1,500</td>
                  <td className="px-4 py-3 text-foreground">$1,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Annual premium
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">$1,840</td>
                  <td className="px-4 py-3 text-foreground">$2,015</td>
                  <td className="px-4 py-3 font-medium text-emerald-700">
                    $1,935
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Inflation guard
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">No</td>
                  <td className="px-4 py-3 text-foreground">Yes</td>
                  <td className="px-4 py-3 text-foreground">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">
                    Water damage — gradual leak
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Covered</td>
                  <td className="px-4 py-3 text-destructive">Excluded</td>
                  <td className="px-4 py-3 text-foreground">Covered</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            <Lightbulb className="size-3.5 text-brand" strokeWidth={2.5} />
            Recommendations
          </div>
          <ol className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                1
              </span>
              <p className="leading-relaxed text-foreground">
                Request a binder from <strong>AC Insurance</strong> using
                matched coverage levels — there&apos;s a clear price advantage
                worth confirming before accepting the renewal.
              </p>
            </li>
            <li className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                2
              </span>
              <p className="leading-relaxed text-foreground">
                Confirm the gradual-leak exclusion does not affect your
                existing claims history (covered leak claim, 2024).
              </p>
            </li>
            <li className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                3
              </span>
              <p className="leading-relaxed text-foreground">
                The higher $1,500 deductible is offset by the new
                inflation-guard endorsement — net-positive if you&apos;re
                comfortable with the deductible math.
              </p>
            </li>
            <li className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                4
              </span>
              <p className="leading-relaxed text-foreground">
                If identity-theft coverage matters, add it as an endorsement
                (~$60/year) rather than switching plans for that single item.
              </p>
            </li>
          </ol>
        </section>
      </article>
    </div>
  );
}
