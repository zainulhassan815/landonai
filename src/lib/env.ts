const requiredPublicEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

type RequiredPublicEnvVar = (typeof requiredPublicEnvVars)[number];

export function getPublicEnv(name: RequiredPublicEnvVar): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

export function hasPublicEnv(): boolean {
  return requiredPublicEnvVars.every((name) => Boolean(process.env[name]));
}
