import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMITS,
  validateContactInput,
} from "@/lib/contact/validate";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I'd like to learn more about the comparison tool.",
  consultation: false,
};

describe("validateContactInput", () => {
  it("accepts a well-formed submission", () => {
    const result = validateContactInput(valid);
    expect(result.ok).toBe(true);
  });

  it("trims and lowercases the email", () => {
    const result = validateContactInput({
      ...valid,
      email: "  ADA@Example.com  ",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe("ada@example.com");
    }
  });

  it("trims whitespace from name and message", () => {
    const result = validateContactInput({
      ...valid,
      name: "  Ada  ",
      message: "  This is a real message body.  ",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Ada");
      expect(result.value.message).toBe("This is a real message body.");
    }
  });

  it("rejects an empty name", () => {
    const result = validateContactInput({ ...valid, name: " " });
    expect(result.ok).toBe(false);
  });

  it("rejects a name over the maximum length", () => {
    const result = validateContactInput({
      ...valid,
      name: "x".repeat(CONTACT_LIMITS.nameMax + 1),
    });
    expect(result.ok).toBe(false);
  });

  it("rejects an obviously-bad email", () => {
    const result = validateContactInput({ ...valid, email: "not-an-email" });
    expect(result.ok).toBe(false);
  });

  it("rejects a message that's too short", () => {
    const result = validateContactInput({ ...valid, message: "hi" });
    expect(result.ok).toBe(false);
  });

  it("rejects a message that's too long", () => {
    const result = validateContactInput({
      ...valid,
      message: "x".repeat(CONTACT_LIMITS.messageMax + 1),
    });
    expect(result.ok).toBe(false);
  });

  it("preserves the consultation flag", () => {
    const result = validateContactInput({ ...valid, consultation: true });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.consultation).toBe(true);
    }
  });
});
