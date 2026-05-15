import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getPublicEnv, hasPublicEnv } from "@/lib/env";

const REQUIRED_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

const originalValues = new Map<string, string | undefined>();

beforeEach(() => {
  for (const key of REQUIRED_KEYS) {
    originalValues.set(key, process.env[key]);
    delete process.env[key];
  }
});

afterEach(() => {
  for (const key of REQUIRED_KEYS) {
    const original = originalValues.get(key);
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  }
});

describe("getPublicEnv", () => {
  it("returns the value when the variable is set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    expect(getPublicEnv("NEXT_PUBLIC_SUPABASE_URL")).toBe(
      "https://example.supabase.co",
    );
  });

  it("throws a descriptive error when the variable is missing", () => {
    expect(() => getPublicEnv("NEXT_PUBLIC_SUPABASE_URL")).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("treats an empty string as missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "";
    expect(() => getPublicEnv("NEXT_PUBLIC_SUPABASE_URL")).toThrow();
  });
});

describe("hasPublicEnv", () => {
  it("returns false when any required variable is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "set";
    expect(hasPublicEnv()).toBe(false);
  });

  it("returns true only when every required variable is set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "url";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "key";
    expect(hasPublicEnv()).toBe(true);
  });
});
