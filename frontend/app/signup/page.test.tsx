import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import SignupPage from "./page"

describe("SignupPage", () => {
  it("renders the signup form and social button", () => {
    const html = renderToStaticMarkup(<SignupPage />)

    expect(html).toContain("Sign up and get started")
    expect(html).toContain("First name")
    expect(html).toContain("Last name")
    expect(html).toContain("Create Account")
    expect(html).toContain("Continue with Google")
  })
})
