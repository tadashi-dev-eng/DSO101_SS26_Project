import { afterEach, ComponentProps, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"

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

import TasksPage from "./page"

describe("TasksPage", () => {
  let container: HTMLDivElement
  let root: Root | null = null

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    localStorage.setItem("token", "fake-token")
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
    localStorage.clear()
  })

  it("renders the tasks dashboard and loads tasks", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        tasks: [
          {
            id: "1",
            title: "Review dataset",
            description: "Check quality",
            completed: false,
            dueDate: "2026-06-01",
            createdAt: "2026-05-01T00:00:00.000Z",
          },
        ],
      }),
    })

    ;(globalThis as GlobalFetch).fetch = fetchMock as unknown as typeof fetch

    await act(async () => {
      root = createRoot(container)
      root.render(<TasksPage />)
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(container.textContent).toContain("Your tasks")
    expect(container.textContent).toContain("Review dataset")
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("toggles task completion when the button is clicked", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          tasks: [
            {
              id: "1",
              title: "Review dataset",
              description: "Check quality",
              completed: false,
              dueDate: "2026-06-01",
              createdAt: "2026-05-01T00:00:00.000Z",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: "Updated" }),
      })

    ;(globalThis as GlobalFetch).fetch = fetchMock as unknown as typeof fetch

    await act(async () => {
      root = createRoot(container)
      root.render(<TasksPage />)
      await Promise.resolve()
      await Promise.resolve()
    })

    const completeButton = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Mark complete")
    )!
    expect(completeButton.textContent).toContain("Mark complete")

    await act(async () => {
      completeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][0]).toContain("/protected/tasks/1")
    expect(container.textContent).toContain("Mark open")
  })

  it("deletes a task when the Delete button is clicked", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          tasks: [
            {
              id: "1",
              title: "Review dataset",
              description: "Check quality",
              completed: false,
              dueDate: "2026-06-01",
              createdAt: "2026-05-01T00:00:00.000Z",
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: "Deleted" }),
      })

    ;(globalThis as GlobalFetch).fetch = fetchMock as unknown as typeof fetch

    await act(async () => {
      root = createRoot(container)
      root.render(<TasksPage />)
      await Promise.resolve()
      await Promise.resolve()
    })

    const deleteButton = Array.from(container.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Delete")
    )!

    await act(async () => {
      deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(container.textContent).not.toContain("Review dataset")
  })
})
