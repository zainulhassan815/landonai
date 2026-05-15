/**
 * Server-side validation for contact form submissions. Mirrors the loose
 * client-side `required`/`type=email` constraints with stricter bounds so a
 * crafted POST can't slip past the form UI.
 */

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 10,
  messageMax: 4000,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  consultation: boolean;
};

export type ValidatedContact = {
  name: string;
  email: string;
  message: string;
  consultation: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactInput(
  input: ContactInput,
): { ok: true; value: ValidatedContact } | { ok: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const message = input.message.trim();

  if (name.length < CONTACT_LIMITS.nameMin) {
    return { ok: false, error: "Please enter your name." };
  }
  if (name.length > CONTACT_LIMITS.nameMax) {
    return { ok: false, error: "Name is too long." };
  }
  if (email.length === 0 || email.length > CONTACT_LIMITS.emailMax) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length < CONTACT_LIMITS.messageMin) {
    return {
      ok: false,
      error: "Please add a little more detail to your message.",
    };
  }
  if (message.length > CONTACT_LIMITS.messageMax) {
    return { ok: false, error: "Message is too long." };
  }

  return {
    ok: true,
    value: { name, email, message, consultation: input.consultation },
  };
}
