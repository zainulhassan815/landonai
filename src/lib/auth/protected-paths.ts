/**
 * Single source of truth for which app paths require an authenticated session.
 * Imported by both the request proxy (for redirects) and unit tests.
 *
 * A path is considered protected when it equals a prefix exactly (e.g.
 * `/admin`) or is a sub-segment of one (e.g. `/admin/users`). Lookalike
 * paths such as `/admin-help` are intentionally NOT matched.
 */
export const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/tools",
  "/account",
  "/admin",
] as const;

export function requiresAuth(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
