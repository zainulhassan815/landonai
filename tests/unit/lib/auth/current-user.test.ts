import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getCurrentUser, getInitialsFromEmail } from "@/lib/auth/current-user";

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

describe("getCurrentUser", () => {
  it("returns null when Supabase env vars are missing (does not throw)", async () => {
    await expect(getCurrentUser()).resolves.toBeNull();
  });
});

describe("getInitialsFromEmail", () => {
  it("returns first + last letter of the local part, uppercased", () => {
    expect(getInitialsFromEmail("alice@example.com")).toBe("AE");
    expect(getInitialsFromEmail("bob@example.com")).toBe("BB");
  });

  it("strips non-letters from the local part", () => {
    expect(getInitialsFromEmail("alice.bob+work@example.com")).toBe("AK");
  });

  it("uppercases a single-letter local part", () => {
    expect(getInitialsFromEmail("a@example.com")).toBe("A");
  });

  it("falls back to the first two characters when no letters are present", () => {
    expect(getInitialsFromEmail("123@example.com")).toBe("12");
  });
});
