import { afterEach, ComponentProps, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"

const pushMock = vi.fn()
const replaceMock = vi.fn()

type GlobalFetch = typeof globalThis & { fetch?: typeof fetch }

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
}))

vi.mock("next/link", () => ({
  default: (props: ComponentProps<"a">) => <a {...props} />,
  __esModule: true,
}))

import LoginPage from "./page"

describe("LoginPage", () => {
  let container: HTMLDivElement
  let root: Root | null = null

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    localStorage.clear()
    pushMock.mockReset()
    replaceMock.mockReset()
  })

  afterEach(() => {
    if (root) {
      root.unmount()
      root = null
    }
    container.remove()
    vi.restoreAllMocks()
  })

  it("renders the login form and sign up link", () => {
    const html = renderToStaticMarkup(<LoginPage />)

    expect(html).toContain("Log in to your account")
    expect(html).toContain("Sign up")
    expect(html).toContain("Email")
    expect(html).toContain("Password")
    expect(html).toContain("Sign In")
  })

  it("submits the login form and stores the token", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: async () => ({ token: "fake-token", message: "Signed in successfully." }),
    }))
    ;(globalThis as GlobalFetch).fetch = fetchMock as unknown as typeof fetch

    await act(async () => {
      root = createRoot(container)
      root.render(<LoginPage />)
      await Promise.resolve()
      await Promise.resolve()
    })

    const email = container.querySelector<HTMLInputElement>("#email")!
    const password = container.querySelector<HTMLInputElement>("#password")!
    const form = container.querySelector("form")!

    await act(async () => {
      email.value = "user@example.com"
      email.dispatchEvent(new Event("input", { bubbles: true }))
      password.value = "secret"
      password.dispatchEvent(new Event("input", { bubbles: true }))
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(fetchMock).toHaveBeenCalled()
    expect(localStorage.getItem("token")).toBe("fake-token")
    expect(container.textContent).toContain("Signed in successfully.")
  })
})
