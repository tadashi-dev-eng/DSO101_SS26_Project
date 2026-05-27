import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

import TasksPage from "./page"

describe("TasksPage", () => {
  it("renders the tasks dashboard and form", () => {
    const html = renderToStaticMarkup(<TasksPage />)

    expect(html).toContain("Your tasks")
    expect(html).toContain("Active tasks")
    expect(html).toContain("Create a new task")
    expect(html).toContain("Task title")
    expect(html).toContain("Create task")
  })
})
