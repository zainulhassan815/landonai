import Link from "next/link";
import { Bell, HelpCircle, Settings } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/layout/user-menu";
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

export async function TopNav() {
  const user = await getCurrentUser();

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
          <UtilityIconLink href="/account" label="Notifications">
            <Bell className="size-5" strokeWidth={1.75} />
          </UtilityIconLink>
          <UtilityIconLink href="/account" label="Settings">
            <Settings className="size-5" strokeWidth={1.75} />
          </UtilityIconLink>

          {user ? (
            <UserMenu
              state="authenticated"
              email={user.email}
              initials={getInitialsFromEmail(user.email)}
            />
          ) : (
            <UserMenu state="anonymous" />
          )}
        </div>
      </div>
    </header>
  );
}
