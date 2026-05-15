import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_OTP_TYPES: ReadonlySet<EmailOtpType> = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function isSafeRelativePath(value: string | null): value is string {
  return Boolean(value) && value!.startsWith("/") && !value!.startsWith("//");
}

function buildErrorRedirect(message: string): string {
  const params = new URLSearchParams({ error: message });
  return `/auth-error?${params.toString()}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type");
  const nextParam = searchParams.get("next");
  const nextPath = isSafeRelativePath(nextParam) ? nextParam : "/";

  if (!tokenHash || !rawType || !VALID_OTP_TYPES.has(rawType as EmailOtpType)) {
    redirect(buildErrorRedirect("Invalid or missing verification token."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type: rawType as EmailOtpType,
    token_hash: tokenHash,
  });

  if (error) {
    redirect(buildErrorRedirect(error.message));
  }

  redirect(nextPath);
}
