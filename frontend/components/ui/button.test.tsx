import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { Button } from "./button"

describe("Button component", () => {
  it("renders children in a button element", () => {
    const html = renderToStaticMarkup(<Button>Click me</Button>)
    expect(html).toContain("Click me")
    expect(html).toContain("button")
  })
})
