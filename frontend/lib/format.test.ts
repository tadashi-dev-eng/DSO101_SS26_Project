import { describe, expect, it } from "vitest"
import { formatButtonLabel, normalizeEmail } from "./format"

describe("format utilities", () => {
  it("normalizes email addresses by trimming and lowercasing", () => {
    expect(normalizeEmail("  Test@Example.COM  ")).toBe("test@example.com")
  })

  it("formats button labels by trimming whitespace and adding an arrow", () => {
    expect(formatButtonLabel("  Sign Up  ")).toBe("Sign Up →")
    expect(formatButtonLabel("Save   Changes")).toBe("Save Changes →")
  })
})
