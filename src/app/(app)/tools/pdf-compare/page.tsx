import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, FileText, Sparkles, Workflow } from "lucide-react";
import { FeatureTile } from "@/components/ui/feature-tile";
import { EntitlementChip } from "@/components/tools/entitlement-chip";
import { PdfCompareForm } from "@/components/tools/pdf-compare-form";

export const metadata: Metadata = {
  title: "PDF Comparison Tool",
  description:
    "Upload 2–6 PDFs and get a structured side-by-side comparison report.",
};

const STEPS = [
  {
    icon: FileText,
    title: "Add up to 6 PDFs",
    description:
      "Drag in policies, quotes, or contracts. Label each so the report reads naturally.",
  },
  {
    icon: Workflow,
    title: "We extract and compare",
    description:
      "Each document is parsed and aligned against the others — coverage, terms, dollar amounts, exclusions.",
  },
  {
    icon: Sparkles,
    title: "Get a structured report",
    description:
      "A clean side-by-side summary with key changes and a recommendation. Copy, export, or follow up with questions.",
  },
] as const;

export default function PdfComparePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-12 pb-24 sm:pt-16">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        Back to Tools
      </Link>

      <header className="mt-8 flex flex-col items-center gap-4 text-center">
        <EntitlementChip state="subscribed" />
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          PDF Comparison Tool
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Compare 2–6 PDFs and get a structured side-by-side report —
          differences, key changes, and a recommendation.
        </p>
      </header>

      <section className="mt-12">
        <PdfCompareForm />
      </section>

      <section className="mt-20">
        <h2 className="text-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
          How it works
        </h2>
        <ul className="mx-auto mt-8 grid max-w-3xl gap-x-10 gap-y-8 sm:grid-cols-3">
          {STEPS.map(({ icon, title, description }) => (
            <li key={title}>
              <FeatureTile
                icon={icon}
                title={title}
                description={description}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
