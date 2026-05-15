import { describe, expect, it } from "vitest";
import { requiresAuth } from "@/lib/auth/protected-paths";

describe("requiresAuth", () => {
  it("returns true when the path equals a protected prefix exactly", () => {
    expect(requiresAuth("/dashboard")).toBe(true);
    expect(requiresAuth("/tools")).toBe(true);
    expect(requiresAuth("/account")).toBe(true);
    expect(requiresAuth("/admin")).toBe(true);
  });

  it("returns true for nested protected paths", () => {
    expect(requiresAuth("/tools/pdf-compare")).toBe(true);
    expect(requiresAuth("/account/billing")).toBe(true);
    expect(requiresAuth("/admin/users/123")).toBe(true);
  });

  it("returns false for the home page", () => {
    expect(requiresAuth("/")).toBe(false);
  });

  it("returns false for public marketing routes", () => {
    expect(requiresAuth("/consulting")).toBe(false);
    expect(requiresAuth("/pricing")).toBe(false);
    expect(requiresAuth("/contact")).toBe(false);
    expect(requiresAuth("/resources")).toBe(false);
  });

  it("returns false for auth flow routes", () => {
    expect(requiresAuth("/login")).toBe(false);
    expect(requiresAuth("/sign-up")).toBe(false);
    expect(requiresAuth("/forgot-password")).toBe(false);
    expect(requiresAuth("/update-password")).toBe(false);
    expect(requiresAuth("/sign-up-success")).toBe(false);
    expect(requiresAuth("/confirm")).toBe(false);
    expect(requiresAuth("/auth-error")).toBe(false);
  });

  it("does not match lookalike paths that share a prefix but differ in segment", () => {
    expect(requiresAuth("/admin-help")).toBe(false);
    expect(requiresAuth("/toolset")).toBe(false);
    expect(requiresAuth("/dashboards")).toBe(false);
  });
});
