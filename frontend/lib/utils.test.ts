import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("utility helpers", () => {
  it("merges class names and deduplicates tailwind classes", () => {
    expect(cn("text-sm", "font-bold", "text-sm")).toBe("font-bold text-sm")
  })

  it("returns an empty string when no class names are provided", () => {
    expect(cn()).toBe("")
  })
})
