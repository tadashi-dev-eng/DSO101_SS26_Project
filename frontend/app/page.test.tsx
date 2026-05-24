import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import HomePage from "./page"

describe("Home page", () => {
  it("renders the landing headline", () => {
    const html = renderToStaticMarkup(<HomePage />)
    expect(html).toContain("Home for data science workflows")
  })
})
