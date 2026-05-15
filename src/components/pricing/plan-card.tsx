import Link from "next/link";
import { Check } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  name: string;
  description: string;
  price: { amount: string; period?: string };
  features: readonly string[];
  cta: { href: string; label: string; variant?: ButtonProps["variant"] };
  highlighted?: boolean;
  className?: string;
};

export function PlanCard({
  name,
  description,
  price,
  features,
  cta,
  highlighted = false,
  className,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm",
        highlighted && "ring-1 ring-brand/30",
        className,
      )}
    >
      <div>
        <h2 className="text-lg font-medium text-foreground">{name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-semibold tracking-tight text-foreground">
          {price.amount}
        </span>
        {price.period ? (
          <span className="text-muted-foreground">/{price.period}</span>
        ) : null}
      </div>

      <ul className="space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check
              className="mt-0.5 size-4 shrink-0 text-brand"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <Button asChild variant={cta.variant ?? "default"} className="mt-auto">
        <Link href={cta.href}>{cta.label}</Link>
      </Button>
    </div>
  );
}
