import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next/font/google", () => ({
  Geist: vi.fn(() => ({ variable: "geist" })),
  Geist_Mono: vi.fn(() => ({ variable: "geist-mono" })),
}))

import RootLayout from "./layout"

describe("RootLayout", () => {
  it("renders HTML and body wrappers", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div>children</div>
      </RootLayout>
    )

    expect(html).toContain("<html")
    expect(html).toContain("<body")
    expect(html).toContain("children")
  })
})
