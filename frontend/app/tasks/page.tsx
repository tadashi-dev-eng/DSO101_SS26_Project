"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api"

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  createdAt: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    const token = getToken()
    if (!token) {
      setError("You must log in to view tasks.")
      setTasks([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/protected/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token")
          router.push("/login")
          return
        }
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || `Failed to load tasks (${response.status})`)
      }

      const data = await response.json()
      setTasks(data.tasks ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks()
    }

    void loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    const token = getToken()

    if (!token) {
      setError("You must log in to create a task.")
      setSaving(false)
      return
    }

    if (!title.trim()) {
      setError("Task title is required.")
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/protected/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDate || undefined,
        }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || `Unable to create task (${response.status})`)
      }

      setTitle("")
      setDescription("")
      setDueDate("")
      setMessage("Task created successfully.")
      fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  const handleToggleComplete = async (task: Task) => {
    const token = getToken()
    if (!token) {
      setError("You must log in to update a task.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/protected/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || `Unable to update task (${response.status})`)
      }

      setTasks((current) =>
        current.map((item) => (item.id === task.id ? { ...item, completed: !item.completed } : item))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleDelete = async (taskId: string) => {
    const token = getToken()
    if (!token) {
      setError("You must log in to delete a task.")
      return
    }

    try {
      const response = await fetch(`${API_URL}/protected/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || `Unable to delete task (${response.status})`)
      }

      setTasks((current) => current.filter((item) => item.id !== taskId))
      setMessage("Task deleted successfully.")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Task dashboard</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your tasks</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              View, create, and manage your tasks using the backend API. Tasks are stored for your account and updated in real time.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-400">
              Home
            </Link>
            <Button variant="outline" onClick={handleLogout} className="rounded-full">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">Active tasks</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{tasks.length} items</span>
            </div>

            {loading ? (
              <p className="text-slate-600">Loading tasks…</p>
            ) : error ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900 ring-1 ring-rose-200">{error}</p>
            ) : tasks.length === 0 ? (
              <p className="text-slate-600">No tasks found. Create one using the form on the right.</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <article key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{task.completed ? "Complete" : "Open"}</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-950">{task.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant={task.completed ? "secondary" : "default"} size="sm" onClick={() => handleToggleComplete(task)}>
                          {task.completed ? "Mark open" : "Mark complete"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm leading-6 text-slate-700">{task.description || "No description provided."}</p>
                      <p className="text-sm text-slate-500">Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-950">Create a new task</h2>
              <p className="mt-2 text-slate-600">Add a task and save it to the backend. Only logged-in users can access these endpoints.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Task title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Review dataset quality"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Write a short note about the task."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving task…" : "Create task"}
              </Button>
            </form>

            {message ? (
              <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">{message}</p>
            ) : null}
            {error ? (
              <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900 ring-1 ring-rose-200">{error}</p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  )
}
