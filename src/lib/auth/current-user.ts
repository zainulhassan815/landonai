import { hasPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
};

/**
 * Returns the signed-in user's lightweight identity, or `null` when the
 * request is anonymous. Returns `null` (instead of throwing) when Supabase
 * env vars are not configured, so pages can render during local first-run
 * before `.env.local` is filled in.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!hasPublicEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const id = typeof claims?.sub === "string" ? claims.sub : null;
  const email = typeof claims?.email === "string" ? claims.email : null;

  if (!id || !email) return null;
  return { id, email };
}

export function getInitialsFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const cleaned = local.replace(/[^a-zA-Z]/g, "");
  if (cleaned.length === 0) return email.slice(0, 2).toUpperCase();
  if (cleaned.length === 1) return cleaned.toUpperCase();
  return (cleaned[0]! + cleaned[cleaned.length - 1]!).toUpperCase();
}
