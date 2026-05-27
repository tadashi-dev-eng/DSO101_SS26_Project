import { afterEach, ComponentProps, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"

type GlobalFetch = typeof globalThis & { fetch?: typeof fetch }

vi.mock("next/link", () => ({
  default: (props: ComponentProps<"a">) => <a {...props} />,
  __esModule: true,
}))

import SignupPage from "./page"

describe("SignupPage", () => {
  let container: HTMLDivElement
  let root: Root | null = null

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (root) {
      root.unmount()
      root = null
    }
    container.remove()
    vi.restoreAllMocks()
  })

  it("renders the signup form and social button", () => {
    const html = renderToStaticMarkup(<SignupPage />)

    expect(html).toContain("Sign up and get started")
    expect(html).toContain("First name")
    expect(html).toContain("Last name")
    expect(html).toContain("Create Account")
    expect(html).toContain("Continue with Google")
  })

  it("submits the signup form and shows success message", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({ message: "Signup successful. You can now log in." }),
    }))
    ;(globalThis as GlobalFetch).fetch = fetchMock as unknown as typeof fetch

    await act(async () => {
      root = createRoot(container)
      root.render(<SignupPage />)
      await Promise.resolve()
      await Promise.resolve()
    })

    const firstName = container.querySelector<HTMLInputElement>("#firstName")!
    const lastName = container.querySelector<HTMLInputElement>("#lastName")!
    const email = container.querySelector<HTMLInputElement>("#email")!
    const password = container.querySelector<HTMLInputElement>("#password")!
    const form = container.querySelector("form")!

    await act(async () => {
      firstName.value = "Tashi"
      firstName.dispatchEvent(new Event("input", { bubbles: true }))
      lastName.value = "Penjor"
      lastName.dispatchEvent(new Event("input", { bubbles: true }))
      email.value = "tashi@example.com"
      email.dispatchEvent(new Event("input", { bubbles: true }))
      password.value = "secret"
      password.dispatchEvent(new Event("input", { bubbles: true }))
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(fetchMock).toHaveBeenCalled()
    expect(container.textContent).toContain("Signup successful. You can now log in.")
  })
})
