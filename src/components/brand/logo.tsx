import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("text-brand", className)}
    >
      <path d="M16 4 v22 a8 8 0 0 1 -8 8 H6" />
      <path d="M40 36 v-22 a8 8 0 0 1 8 -8 h2" />
    </svg>
  );
}
