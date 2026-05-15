import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-muted-foreground">{claims.email}</span>
      <LogoutButton />
    </div>
  );
}
