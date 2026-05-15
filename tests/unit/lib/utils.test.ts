import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names with a space", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("merges conflicting Tailwind utilities so the last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-base")).toBe("text-base");
  });

  it("drops falsy values", () => {
    expect(cn("base", false && "no", undefined, null, "yes")).toBe("base yes");
  });

  it("handles arrays and objects via clsx", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});
