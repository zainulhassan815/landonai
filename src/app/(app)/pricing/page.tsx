import type { Metadata } from "next";
import { PlanCard } from "@/components/pricing/plan-card";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with one PDF comparison. Upgrade for full access to the Landon AI tools portal.",
};

// Currency + amount are TBD with the client; one paid plan for MVP per PRD §5.5.
const PRO_PRICE = { amount: "$49", period: "month" } as const;

const FREE_FEATURES = [
  "One PDF comparison, on us",
  "Compare up to 6 documents in your trial run",
  "No credit card required",
] as const;

const PRO_FEATURES = [
  "Full access to the tools portal",
  "PDF Comparison Tool — up to 6 documents per run",
  "Saved comparison history",
  "Follow-up Q&A on any comparison",
  "Cancel anytime",
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-24 sm:pt-24">
      <header className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Start free with one PDF comparison. Upgrade when you&apos;re ready for
          more.
        </p>
      </header>

      <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
        <PlanCard
          name="Free trial"
          description="Try the PDF Comparison Tool before you subscribe."
          price={{ amount: "$0" }}
          features={FREE_FEATURES}
          cta={{
            href: "/auth/sign-up",
            label: "Create account",
            variant: "outline",
          }}
        />
        <PlanCard
          name="Pro"
          description="Full access to every tool in the portal."
          price={PRO_PRICE}
          features={PRO_FEATURES}
          cta={{ href: "/auth/sign-up", label: "Get started" }}
          highlighted
        />
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
        Subscription begins only when you choose to upgrade. The free comparison
        applies once per account.
      </p>
    </div>
  );
}
