/**
 * Centralised access to the public env vars Supabase needs in both the
 * browser and Node runtimes.
 *
 * IMPORTANT: Next.js only inlines `process.env.NEXT_PUBLIC_*` into the
 * browser bundle when the property is accessed *as a literal* — `process
 * .env[name]` with a dynamic key is not replaced and reads `undefined` in
 * the browser. Each branch of the switch uses literal access so the
 * client bundle ships the real values.
 */

const REQUIRED_PUBLIC_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

type RequiredPublicEnvVar = (typeof REQUIRED_PUBLIC_ENV_VARS)[number];

function readPublicEnv(name: RequiredPublicEnvVar): string | undefined {
  switch (name) {
    case "NEXT_PUBLIC_SUPABASE_URL":
      return process.env.NEXT_PUBLIC_SUPABASE_URL;
    case "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY":
      return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  }
}

export function getPublicEnv(name: RequiredPublicEnvVar): string {
  const value = readPublicEnv(name);
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

export function hasPublicEnv(): boolean {
  return REQUIRED_PUBLIC_ENV_VARS.every((name) => Boolean(readPublicEnv(name)));
}
