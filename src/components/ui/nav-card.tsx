import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavCardProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  className?: string;
};

export function NavCard({ href, label, icon: Icon, className }: NavCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4",
        "shadow-sm transition-all duration-200",
        "hover:-translate-y-px hover:border-border hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <Icon
        className="size-6 shrink-0 text-brand"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span className="flex-1 text-base font-medium text-foreground">
        {label}
      </span>
      <ChevronRight
        className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={2}
        aria-hidden="true"
      />
    </Link>
  );
}
