# Next.js Parallel Routes — Quick Summary

## 1. What are Parallel Routes?

**Parallel Routes** in the Next.js App Router let you render multiple independently routed UI sections together inside one shared layout.

**Formula:** `Parallel Routes = Named slots + Shared layout + Multiple UI sections`

## 2. Important keyword: Slot

A **slot** is a named section of UI that a layout can render.

- Named slots are created using folders that begin with `@`.
- Example: `@analytics` creates an `analytics` slot.
- The `@` folder name **does not become part of the URL**.
- `children` is the default slot; it comes from the route's `page.tsx`.

## 3. Example folder structure

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @teams/
        └── page.tsx
```

The layout receives these props:

| Prop | Comes from | Purpose |
|---|---|---|
| `children` | `dashboard/page.tsx` | Main dashboard content; the default slot |
| `analytics` | `dashboard/@analytics/page.tsx` | Analytics UI; a named slot |
| `teams` | `dashboard/@teams/page.tsx` | Teams UI; a named slot |

## 4. Layout example (`layout.tsx`)

```tsx
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
    <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="border-b border-slate-800 pb-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">
            Parallel Routes Example
          </p>
          <h1 className="mt-2 text-3xl font-bold">Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Default slot */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold">Main content</h2>
            {children}
          </section>

          {/* Named slot: @analytics */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-lg font-semibold">Analytics slot</h2>
            {analytics}
          </section>

          {/* Named slot: @teams */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-3">
            <h2 className="mb-4 text-lg font-semibold">Teams slot</h2>
            {teams}
          </section>
        </div>
      </div>
    </main>
  );
}
```

## 5. Useful keywords

| Keyword | Meaning |
|---|---|
| `@folder` | Creates a named slot, e.g. `@analytics` |
| `children` | Default slot, normally populated by `page.tsx` |
| `layout.tsx` | Receives and arranges `children` and named slot props |
| `default.tsx` | Fallback UI when Next.js cannot recover a slot's active state during a full page load |
| `loading.tsx` | Loading UI for a route segment |
| `error.tsx` | Error UI for a route segment |

## 6. Real-world use cases

- **Dashboards:** overview, analytics, notifications, and activity panels.
- **Admin panels:** reports, user management, and statistics.
- **Social applications:** feed, messages, and online friends.
- **Complex interfaces:** multiple route-aware sections displayed together.

## 7. Important points

1. `@analytics` does **not** add `/analytics` to the URL.
2. A named slot is passed to the layout as a prop named after its folder, without `@`.
3. Each slot can have its own route structure and can use route-segment features such as `loading.tsx` and `error.tsx`.
4. Parallel Routes support independently managed sections, but they do not automatically make every data fetch or server operation independent.
5. Route Groups such as `(marketing)` organize routes and layouts but do not create named slot props.

## Interview-ready definition

> Parallel Routes in the Next.js App Router let an application render multiple named page segments simultaneously within a shared layout using `@slot` folders.

**Memory trick:** `@folder` creates a **slot** → the slot becomes a layout **prop** → `layout.tsx` decides where that UI appears.
