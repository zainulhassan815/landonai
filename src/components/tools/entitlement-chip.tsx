import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type EntitlementChipProps = {
  state: "free-token" | "subscribed";
  className?: string;
};

export function EntitlementChip({ state, className }: EntitlementChipProps) {
  const isSubscribed = state === "subscribed";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        isSubscribed
          ? "border-brand/30 bg-brand-soft text-brand"
          : "border-border bg-muted text-foreground",
        className,
      )}
    >
      {isSubscribed ? (
        <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      )}
      {isSubscribed ? "Pro plan · unlimited" : "Free comparison available"}
    </span>
  );
}
