import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function AuthCard({
  title,
  description,
  footer,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-base text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {children}
      </div>

      {footer ? (
        <p className="text-center text-sm text-muted-foreground">{footer}</p>
      ) : null}
    </div>
  );
}
