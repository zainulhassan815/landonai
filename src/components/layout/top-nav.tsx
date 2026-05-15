import Link from "next/link";
import { Suspense } from "react";
import { Bell, HelpCircle, Settings } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, getInitialsFromEmail } from "@/lib/auth/current-user";

function UtilityIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-muted-foreground transition",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
      )}
    >
      {children}
    </Link>
  );
}

function ControlsFallback() {
  return (
    <div
      aria-hidden="true"
      className="ml-1 flex items-center gap-2 sm:ml-2"
    >
      <div className="size-9 animate-pulse rounded-full bg-muted" />
    </div>
  );
}

async function AuthControls() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <>
        <UtilityIconLink href="/account" label="Notifications">
          <Bell className="size-5" strokeWidth={1.75} />
        </UtilityIconLink>
        <UtilityIconLink href="/account" label="Settings">
          <Settings className="size-5" strokeWidth={1.75} />
        </UtilityIconLink>
        <UserMenu
          email={user.email}
          initials={getInitialsFromEmail(user.email)}
        />
      </>
    );
  }

  return (
    <div className="ml-1 flex items-center gap-2 sm:ml-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="Landon AI home"
          className="flex items-center gap-2.5 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Logo className="size-9" />
          <span className="text-base font-semibold text-foreground">
            Landon AI
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <UtilityIconLink href="/contact" label="Help">
            <HelpCircle className="size-5" strokeWidth={1.75} />
          </UtilityIconLink>

          <Suspense fallback={<ControlsFallback />}>
            <AuthControls />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
