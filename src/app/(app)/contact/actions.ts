"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  validateContactInput,
  type ContactInput,
} from "@/lib/contact/validate";

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContactForm(
  input: ContactInput & { honeypot?: string },
): Promise<ContactSubmitResult> {
  // Bots typically fill every field. If the hidden honeypot has a value we
  // pretend the submit succeeded and drop the message on the floor.
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: true };
  }

  const validated = validateContactInput({
    name: input.name,
    email: input.email,
    message: input.message,
    consultation: input.consultation,
  });

  if (!validated.ok) {
    return { ok: false, error: validated.error };
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 500) ?? null;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: validated.value.name,
    email: validated.value.email,
    message: validated.value.message,
    consultation: validated.value.consultation,
    user_agent: userAgent,
  });

  if (error) {
    console.error("contact_submissions insert failed", error);
    return {
      ok: false,
      error: "We couldn't send your message. Please try again in a moment.",
    };
  }

  // TODO: notify the owner via Resend once the sender domain is finalized
  // (PRD §10 q5). For now the submission lives in Supabase only.

  return { ok: true };
}
