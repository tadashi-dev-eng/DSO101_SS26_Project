import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-8 rounded-3xl bg-white/90 p-8 shadow-lg shadow-slate-200/80 ring-1 ring-slate-200 sm:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              DSO Project
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Home for data science workflows and shared analytics.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Bring together insights, users, and collaborative dashboards in a polished web experience. Sign up to get started or log in to continue working with your data.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/20 transition hover:bg-slate-800"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-400"
            >
              Login
            </Link>
          </div>
        </header>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">Fast insights</h2>
            <p className="mt-4 text-slate-600">
              Turn raw data into actionable summaries with clear visualizations and a responsive dashboard layout.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">Secure access</h2>
            <p className="mt-4 text-slate-600">
              Protect your workspace with authenticated sign-in, user management, and project-level controls.
            </p>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold">Collaborative workflows</h2>
            <p className="mt-4 text-slate-600">
              Share updates, save progress, and coordinate with your team from one unified application.
            </p>
          </article>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-12 text-white sm:px-12">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300">Welcome</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
              A modern landing page built for your final project.
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-300">
              Start with a simple home page that introduces the app, highlights key benefits, and directs visitors to signup or login.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-slate-700">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Organize</p>
                <p className="mt-3 text-base font-semibold text-white">Keep datasets and analyses in one place.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-slate-700">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Review</p>
                <p className="mt-3 text-base font-semibold text-white">See results faster with clean summaries.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-6 ring-1 ring-slate-700">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Share</p>
                <p className="mt-3 text-base font-semibold text-white">Invite classmates and collaborators securely.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
