"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

type UserMenuProps =
  | { state: "anonymous" }
  | { state: "authenticated"; email: string; initials: string };

export function UserMenu(props: UserMenuProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  const initials = props.state === "authenticated" ? props.initials : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1 rounded-full p-1 text-sm transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label="Account menu"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
          {props.state === "authenticated" ? (
            initials
          ) : (
            <UserRound className="size-4" strokeWidth={1.75} />
          )}
        </span>
        <ChevronDown
          className="size-4 text-muted-foreground"
          strokeWidth={2}
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        {props.state === "authenticated" ? (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Signed in as
              <div className="truncate text-sm font-medium text-foreground">
                {props.email}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void handleSignOut();
              }}
            >
              <LogOut className="size-4" strokeWidth={1.75} />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/login">Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-up">Create account</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
