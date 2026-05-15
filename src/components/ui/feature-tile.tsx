import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureTileProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function FeatureTile({
  icon: Icon,
  title,
  description,
  className,
}: FeatureTileProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
