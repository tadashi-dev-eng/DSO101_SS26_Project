import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

import LoginPage from "./page"

describe("LoginPage", () => {
  it("renders the login form and sign up link", () => {
    const html = renderToStaticMarkup(<LoginPage />)

    expect(html).toContain("Log in to your account")
    expect(html).toContain("Sign up")
    expect(html).toContain("Email")
    expect(html).toContain("Password")
    expect(html).toContain("Sign In")
  })
})
