"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
      })

      let data: any = null
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        data = await response.json()
      }

      if (!response.ok) {
        throw new Error(data?.message || `Signin failed (${response.status})`)
      }

      setMessage(data?.message || "Signed in successfully.")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 sm:p-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Secure access
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Log in to your account
          </h1>
          <p className="mt-4 text-slate-600">
            Enter your credentials below to access your dashboard and continue working.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(value) => setRemember(Boolean(value))}
              />
              <Label className="font-normal text-sm" htmlFor="remember">
                Remember me
              </Label>
            </div>
            <Link href="/" className="text-sm font-medium underline text-slate-700 hover:text-slate-900">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {message ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900 ring-1 ring-rose-200">
            {error}
          </p>
        ) : null}

        <p className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-slate-950 underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
