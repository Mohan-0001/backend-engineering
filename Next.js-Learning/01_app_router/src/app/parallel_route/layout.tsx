
import React from "react";

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
  analytics: React.ReactNode;
  teams: React.ReactNode;
}>;

export default function DashboardLayout({
  children,
  analytics,
  teams,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen w-full bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <header className="flex flex-col gap-3 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium tracking-widest text-sky-400 uppercase">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Track your progress, analytics, and team activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm text-slate-300">
              Workspace active
            </span>
          </div>
        </header>

        {/* Parallel Route Sections */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">

          {/* Main route: children */}
          <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-7 lg:col-span-2">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your main dashboard content
              </p>
            </div>

            {children}
          </section>

          {/* Parallel route: @analytics */}
          <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <p className="mt-1 text-sm text-slate-400">
                Performance at a glance
              </p>
            </div>

            {analytics}
          </section>

          {/* Parallel route: @teams */}
          <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-7 lg:col-span-3">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Teams</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your team members and collaboration
              </p>
            </div>

            {teams}
          </section>

        </div>
      </div>
    </main>
  );
}
