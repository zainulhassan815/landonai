import type { Metadata } from "next";
import Link from "next/link";
import { BookText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides, write-ups, and references for getting more out of Landon AI.",
};

export default function ResourcesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24 sm:pt-24">
      <header className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Resources
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Guides, write-ups, and references for getting more out of Landon AI.
        </p>
      </header>

      <div className="mx-auto mt-16 max-w-2xl">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
            <BookText className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Coming soon
            </h2>
            <p className="text-sm text-muted-foreground">
              We&apos;re putting together write-ups on document workflows, AI
              for SMBs, and getting the most out of the comparison tool. Check
              back in a few weeks — or get in touch if there&apos;s something
              specific you&apos;d like covered.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Request a topic</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
