import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  formatDate,
  type Comparison,
  type ComparisonStatus,
} from "@/lib/tools/demo-data";

const STATUS_LABEL: Record<ComparisonStatus, string> = {
  processing: "Processing",
  complete: "Complete",
  failed: "Failed",
};

function StatusBadge({ status }: { status: ComparisonStatus }) {
  if (status === "processing") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-amber-100 text-amber-700"
      >
        <Loader2 className="size-3 animate-spin" />
        {STATUS_LABEL[status]}
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge variant="secondary" className="bg-destructive/10 text-destructive">
        {STATUS_LABEL[status]}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function ComparisonHistory({
  comparisons,
}: {
  comparisons: readonly Comparison[];
}) {
  if (comparisons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No comparisons yet — your first run will land here.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {comparisons.map((comparison) => {
        const labels = comparison.files.map((f) => f.label).join(" · ");
        return (
          <li key={comparison.id}>
            <Link
              href={`/tools/pdf-compare/${comparison.id}`}
              className={cn(
                "group flex items-center gap-4 px-5 py-4 transition",
                "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
              )}
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate font-medium text-foreground">
                    {comparison.title}
                  </span>
                  <StatusBadge status={comparison.status} />
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {comparison.files.length} files · {labels} ·{" "}
                  {formatDate(comparison.createdAt)}
                </p>
              </div>
              <ChevronRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
