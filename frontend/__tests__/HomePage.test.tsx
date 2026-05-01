/// <reference types="vitest" />
import { normalizeEmail, formatButtonLabel } from "../lib/format";

describe("format utilities", () => {
  it("normalizes email addresses by trimming and lowercasing", () => {
    expect(normalizeEmail("  USER@Example.COM ")).toBe("user@example.com");
  });

  it("formats button labels with an arrow suffix", () => {
    expect(formatButtonLabel("  Sign In  ")).toBe("Sign In →");
  });
});
