# Next.js App Router — Complete Beginner-Friendly Guide

> A connected, practical guide to routing, route parameters, route groups, special files, layouts, navigation, rendering, data fetching, errors, and the mental model behind the App Router.
>
> **Audience:** React/MERN developers learning modern Next.js.  
> **Code style:** TypeScript + TSX, matching a typical `src/app` project. JavaScript projects use the same ideas; remove type annotations where needed.  
> **Version note:** Next.js evolves. This guide focuses on the stable App Router mental model and common conventions. Check the official documentation when a feature is version-specific.

---

## Table of contents

1. The mental model: React vs Next.js
2. Create and run a project
3. How folders become URLs
4. `page.tsx` and `layout.tsx`
5. The special route files
6. Dynamic route parameters
7. Catch-all and optional catch-all routes
8. Route groups and private folders
9. Navigation with `Link` and `useRouter`
10. Nested layouts, templates, and rendering lifecycle
11. Loading UI, Suspense, and streaming
12. Error handling and not-found states
13. Route Handlers: API endpoints inside App Router
14. Server Components vs Client Components
15. Data fetching, caching, and revalidation
16. Search parameters and forms
17. Parallel routes and intercepting routes
18. Metadata and SEO
19. Middleware / Proxy, redirects, and rewrites
20. A connected mini-project
21. Common mistakes and debugging
22. A compact cheat sheet
23. Practice exercises
24. Official references

---

# 1. The mental model: React vs Next.js

In a plain React app, you often configure a router yourself. In the Next.js **App Router**, the file and folder structure inside `app/` describes the routes.

For example:

```text
src/
└── app/
    ├── page.tsx
    ├── about/
    │   └── page.tsx
    └── products/
        └── page.tsx
```

This creates:

| File | URL |
|---|---|
| `src/app/page.tsx` | `/` |
| `src/app/about/page.tsx` | `/about` |
| `src/app/products/page.tsx` | `/products` |

**Core rule:** a folder is a URL segment, but a folder does not become a publicly accessible page just because it exists. A route becomes a page when its segment has a `page.tsx` file (or a route is otherwise exposed through a supported route convention).

Think of it like this:

```text
URL: /products
        │
        ▼
src/app/products/page.tsx
        │
        ▼
Next.js renders that page, along with applicable parent layouts
```

### Why App Router exists

It gives you conventions for:
- Nested pages and shared layouts.
- Loading and error UI at the right route segment.
- Server Components by default.
- Data fetching close to the UI that needs it.
- API endpoints through Route Handlers.
- Streaming and advanced routing patterns.

### App Router vs Pages Router

| App Router | Older Pages Router |
|---|---|
| `src/app/.../page.tsx` | `pages/...tsx` |
| `layout.tsx` supports nested persistent layouts | Often uses `_app.tsx` and custom layout patterns |
| React Server Components by default | Traditionally page components are client-rendered/hydrated |
| `route.ts` defines Route Handlers | `pages/api/...` defines API routes |

Do not mix the two routing systems casually in one feature. A project can contain both `app/` and `pages/` during migration, but their conventions are different.

---

# 2. Create and run a project

A typical setup:

```bash
npx create-next-app@latest nextjs-learning
cd nextjs-learning
npm run dev
```

Choose the App Router when prompted. A common TypeScript structure is:

```text
nextjs-learning/
├── public/
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── package.json
└── tsconfig.json
```

Run locally:
- `npm run dev` — development server.
- `npm run build` — production build.
- `npm run start` — serve a production build after building.

Your project may use `app/` directly instead of `src/app/`. Both are valid; use the structure already chosen for the project.

## First two files

`src/app/page.tsx`:

```tsx
export default function HomePage() {
  return <h1>Welcome to my app</h1>;
}
```

`src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
  description: "Learning the Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`page.tsx` provides the home page content. `layout.tsx` provides the shared outer document structure. The `children` prop is where the active page or nested layout is inserted.

---

# 3. How folders become URLs

Consider:

```text
src/app/
├── page.tsx
├── about/
│   └── page.tsx
├── contact/
│   └── page.tsx
└── dashboard/
    ├── page.tsx
    └── settings/
        └── page.tsx
```

Routes:

- `/` → `app/page.tsx`
- `/about` → `app/about/page.tsx`
- `/contact` → `app/contact/page.tsx`
- `/dashboard` → `app/dashboard/page.tsx`
- `/dashboard/settings` → `app/dashboard/settings/page.tsx`

A route is built from the directory path, while the special `page.tsx` file makes that route renderable.

## A folder does not always mean a visible page

```text
app/
└── dashboard/
    ├── page.tsx
    └── reports/
        └── chart.tsx
```

`/dashboard` exists because it has `page.tsx`. `/dashboard/reports` does **not** automatically become a page because `reports/` has no `page.tsx`. `chart.tsx` is just a regular module until imported by a page or another component.

This is useful for organizing components:

```text
app/
└── products/
    ├── page.tsx
    ├── ProductCard.tsx
    └── ProductFilters.tsx
```

`ProductCard.tsx` and `ProductFilters.tsx` are not routes. They are ordinary components.

---

# 4. `page.tsx` and `layout.tsx`

## `page.tsx` — content for a route

A `page.tsx` file is the UI for a particular route. It is the file that makes that route publicly navigable.

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
      <p>This is the about page.</p>
    </main>
  );
}
```

Open `/about` to see it.

Important:
- A page is a React component.
- It can import and render normal components.
- It is a Server Component by default.
- It can receive route `params` and URL `searchParams` as props. In current App Router conventions these are asynchronous values, so use `await` in an async page (examples below).
- You generally do not need to manually register the route.

## `layout.tsx` — shared UI around child routes

A layout wraps the page and nested layouts under its directory. It is useful for navigation bars, sidebars, shared shells, and persistent UI.

```text
app/
├── layout.tsx
├── page.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── settings/
        └── page.tsx
```

Root layout:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>My Website</header>
        {children}
      </body>
    </html>
  );
}
```

Dashboard layout:

```tsx
// app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <aside>
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </aside>
      <div>{children}</div>
    </section>
  );
}
```

For `/dashboard/settings`, the conceptual nesting is:

```text
RootLayout
└── DashboardLayout
    └── SettingsPage
```

So the header from the root layout and the sidebar from the dashboard layout both appear.

### Why layouts are useful

Without a layout, you might repeat the same header/sidebar in every page. A shared layout centralizes that UI. Layouts are designed to preserve state and remain mounted across navigation within their segment, instead of remounting the whole shell for every child-page change.

### Root layout rules

- The root layout is required.
- It must define `<html>` and `<body>`.
- It is usually where global CSS and site-wide metadata are imported/exported.
- If you use multiple root layouts through route groups, each root layout must provide the document tags.

---

# 5. The special route files

These filenames have special meanings. They are not interchangeable.

| File | Main job | Typical use |
|---|---|---|
| `page.tsx` | Route UI | The actual screen at a URL |
| `layout.tsx` | Persistent shared UI | Root shell, navbar, dashboard sidebar |
| `template.tsx` | Layout-like wrapper that remounts on navigation | Reset local state or re-run mount effects on segment navigation |
| `loading.tsx` | Loading fallback for a segment | Skeleton while that segment's page data/rendering is pending |
| `error.tsx` | Error boundary UI for a segment | Show retry button after a render/data error |
| `global-error.tsx` | Error UI for root-layout-level failures | Catch errors that the root layout's normal error boundary cannot handle |
| `not-found.tsx` | Not-found UI | Friendly 404-style page for that segment |
| `default.tsx` | Fallback UI for an unmatched parallel-route slot | Keep a slot renderable on hard navigation |
| `route.ts` | HTTP Route Handler | API endpoint: GET, POST, PATCH, DELETE, etc. |
| `robots.ts` | Generate robots.txt | Search engine crawling rules |
| `sitemap.ts` | Generate sitemap.xml | Search engine discovery |
| `manifest.ts` | Web app manifest | PWA metadata |
| `icon.*`, `apple-icon.*`, `opengraph-image.*`, `twitter-image.*` | Metadata image conventions | Browser icon and social previews |

Other supported conventions may include `forbidden.tsx` and `unauthorized.tsx` in versions/configurations that support the related authorization helpers. Verify your installed Next.js version before relying on them.

## 5.1 `template.tsx` vs `layout.tsx`

Both wrap child UI, but their lifecycle differs.

- A layout is reused and can preserve its component state across navigation within the segment.
- A template is given a unique key and is remounted when the relevant segment changes, so local state and effects reset.

Use a layout by default. Choose a template only when you intentionally need remount behavior.

```tsx
// app/dashboard/template.tsx
export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="dashboard-transition">{children}</div>;
}
```

A template is not a replacement for `page.tsx`; it wraps the page.

## 5.2 `loading.tsx`

```tsx
// app/products/loading.tsx
export default function LoadingProducts() {
  return <p>Loading products…</p>;
}
```

This acts as a loading fallback for the route segment and its descendants while the relevant UI is waiting. It is useful for skeletons and perceived performance.

## 5.3 `error.tsx`

```tsx
// app/products/error.tsx
"use client";

import { useEffect } from "react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section>
      <h2>Something went wrong.</h2>
      <button onClick={() => reset()}>Try again</button>
    </section>
  );
}
```

Important:
- `error.tsx` must be a Client Component, hence `"use client"`.
- It catches errors in the route segment below it, not errors thrown by the layout at the same segment.
- The root layout itself is not caught by the root segment's ordinary `error.tsx`; use `global-error.tsx` for root-layout failures.
- Do not expose private error details to end users in production.

## 5.4 `global-error.tsx`

```tsx
// app/global-error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <h2>The application encountered a problem.</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

Because it can replace the root layout, it must include `<html>` and `<body>`. This is a last-resort boundary, not the normal place for every page error.

## 5.5 `not-found.tsx`

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>404 — Page not found</h1>
      <Link href="/">Go home</Link>
    </main>
  );
}
```

You can also add a `not-found.tsx` deeper in the tree for a segment-specific not-found experience.

For a resource that does not exist, call `notFound()` from `next/navigation`:

```tsx
// app/products/[id]/page.tsx
import { notFound } from "next/navigation";

const products = [
  { id: "1", name: "Keyboard" },
  { id: "2", name: "Mouse" },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) notFound();

  return <h1>{product.name}</h1>;
}
```

`notFound()` stops rendering that route segment and displays the nearest applicable not-found UI.

## 5.6 `default.tsx`

This file is mainly for **parallel routes**, where a layout has named slots such as `@analytics` or `@team`. If a slot's active state cannot be recovered during a hard navigation, `default.tsx` gives Next.js a fallback for that slot.

It is **not** a default page for every ordinary folder. For a normal route, use `page.tsx`.

Example structure:

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @activity/
    │   ├── page.tsx
    │   └── default.tsx
    └── @stats/
        ├── page.tsx
        └── default.tsx
```

More on parallel routes later.

## 5.7 `route.ts` — an HTTP endpoint, not a page

```tsx
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from Next.js" });
}
```

Visit `/api/hello` and the response is JSON, not a rendered page.

A Route Handler can export HTTP methods such as `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS` as needed. A `route.ts` and a `page.tsx` cannot occupy the same route segment path at the same time.

---

# 6. Dynamic route parameters

Use square brackets when a URL segment is variable.

```text
app/
└── products/
    └── [id]/
        └── page.tsx
```

This matches URLs such as:
- `/products/1`
- `/products/keyboard`
- `/products/abc`

The value after `/products/` is the `id` parameter.

## Example: product details

```tsx
// app/products/[id]/page.tsx
type Product = {
  id: string;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: "1", name: "Keyboard", price: 1500 },
  { id: "2", name: "Mouse", price: 700 },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <main>
      <h1>{product.name}</h1>
      <p>Price: ₹{product.price}</p>
      <p>Product ID: {product.id}</p>
    </main>
  );
}
```

### Dry run

For `/products/2`:

1. Next.js matches the `[id]` folder.
2. It extracts `id = "2"` from the URL.
3. Next.js passes the route parameter to the page.
4. The page awaits `params`.
5. The code finds product 2 and renders Mouse.

**Important:** route parameters are strings. Convert them when you need a number:

```tsx
const numericId = Number(id);
```

Validate input before using it in database queries or business logic.

### Why is `params` a Promise?

In modern App Router versions, route `params` (and page `searchParams`) are asynchronous APIs. That lets Next.js coordinate request-dependent information with rendering. Use `await params` in an async Server Component. If you see older tutorials that use `params.id` directly, they may target an older Next.js version.

## Multiple dynamic segments

```text
app/
└── shops/
    └── [shopId]/
        └── products/
            └── [productId]/
                └── page.tsx
```

URL: `/shops/42/products/9`

```tsx
export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ shopId: string; productId: string }>;
}) {
  const { shopId, productId } = await params;

  return (
    <h1>
      Shop {shopId}, product {productId}
    </h1>
  );
}
```

The names inside the square brackets become the keys in `params`.

---

# 7. Catch-all and optional catch-all routes

Use these when a route can contain a variable number of path segments.

## Catch-all: `[...slug]`

```text
app/
└── docs/
    └── [...slug]/
        └── page.tsx
```

Matches:
- `/docs/getting-started`
- `/docs/api/authentication`
- `/docs/a/b/c`

Does **not** match `/docs` by itself because at least one segment is required.

```tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <p>Document path: {slug.join(" / ")}</p>;
}
```

For `/docs/api/authentication`, `slug` is `["api", "authentication"]`.

## Optional catch-all: `[[...slug]]`

```text
app/
└── docs/
    └── [[...slug]]/
        └── page.tsx
```

Matches both:
- `/docs`
- `/docs/api/authentication`

Here, `slug` may be `undefined` when no extra segments exist:

```tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;

  return <p>Document path: {slug?.join(" / ") ?? "Docs home"}</p>;
}
```

### Remember this

| Syntax | Meaning | `/docs` matches? |
|---|---|---|
| `[id]` | Exactly one dynamic segment | Not by itself; it matches `/docs/anything` if named under `docs` |
| `[...slug]` | One or more remaining segments | No |
| `[[...slug]]` | Zero or more remaining segments | Yes |

Do not create conflicting route patterns that match the same URL. Keep the route tree unambiguous.

---

# 8. Route groups and private folders

## Route groups: `(groupName)`

Parentheses group files without adding that name to the URL.

```text
app/
├── (marketing)/
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── pricing/
│       └── page.tsx
└── (shop)/
    └── products/
        └── page.tsx
```

URLs:
- `(marketing)/page.tsx` → `/`
- `(marketing)/about/page.tsx` → `/about`
- `(marketing)/pricing/page.tsx` → `/pricing`
- `(shop)/products/page.tsx` → `/products`

The parentheses are organizational; they are omitted from the URL.

### Why use groups?

You can group routes by feature or give them different layouts:

```text
app/
├── (marketing)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── pricing/page.tsx
└── (dashboard)/
    ├── layout.tsx
    └── dashboard/page.tsx
```

Marketing pages and dashboard pages can have different layouts without adding `/marketing` or `/dashboard` to every URL. But avoid duplicate final URL paths: two groups must not both define the same public route, such as two different `page.tsx` files that both resolve to `/about`.

## Private folders: `_folderName`

A leading underscore marks a private folder that is excluded from routing.

```text
app/
├── dashboard/
│   ├── page.tsx
│   └── _components/
│       └── Sidebar.tsx
```

`_components` is for internal files, not a URL segment. Import it from a page or layout:

```tsx
import Sidebar from "./_components/Sidebar";
```

Use route groups for organizational grouping without changing URLs; use private folders for implementation details that should not be treated as routes.

---

# 9. Navigation with `Link` and `useRouter`

## Prefer `Link` for normal navigation

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/products">Products</Link>
    </nav>
  );
}
```

`Link` is Next.js's enhanced anchor element. It supports client-side navigation and can prefetch routes when appropriate.

## Link to a dynamic route

```tsx
import Link from "next/link";

const products = [
  { id: "1", name: "Keyboard" },
  { id: "2", name: "Mouse" },
];

export default function ProductsPage() {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ))}
    </ul>
  );
}
```

Clicking Mouse navigates to `/products/2`, which matches `products/[id]/page.tsx`.

## `useRouter` for programmatic navigation

Use it when navigation follows an action, such as after a successful form submission. It is a Client Component hook.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function CreateProductButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        // In a real app, save the product first.
        router.push("/products");
      }}
    >
      Finish and view products
    </button>
  );
}
```

Common methods:
- `router.push("/path")` — navigate and add a history entry.
- `router.replace("/path")` — navigate without adding a new history entry.
- `router.back()` — go back.
- `router.refresh()` — request a refresh of the current route's Server Component payload; it does not automatically invalidate every cached data source.

Use `Link` for links. Use `useRouter` for navigation that must happen in code.

---

# 10. Nested layouts, templates, and rendering lifecycle

Suppose your tree is:

```text
app/
├── layout.tsx
├── page.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── settings/
        └── page.tsx
```

When visiting `/dashboard/settings`, Next.js composes the route tree:

```text
RootLayout
  └── DashboardLayout
        └── SettingsPage
```

The root layout's `children` receives the dashboard layout. The dashboard layout's `children` receives the settings page.

You do not manually call one page from another. The file structure and special conventions define the composition.

### Layouts and state

If a sidebar has local React state, a shared layout can preserve it while navigating between child routes. This is one reason to put persistent UI in layouts instead of duplicating it in each page.

### A layout is not automatically a Client Component

Layouts and pages are Server Components by default. If a small piece of the layout needs click state, put `"use client"` on a small interactive child component rather than converting the entire application shell unnecessarily.

---

# 11. Loading UI, Suspense, and streaming

A page may need time to fetch data. Instead of leaving the user with a blank screen, provide a loading fallback.

```text
app/
└── products/
    ├── loading.tsx
    └── page.tsx
```

`loading.tsx`:

```tsx
export default function Loading() {
  return <p>Loading products…</p>;
}
```

`page.tsx`:

```tsx
async function getProducts() {
  // Example delay/data source. Replace with a real API or database call.
  return [{ id: "1", name: "Keyboard" }];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

The loading UI can be shown while the segment is waiting for its page content. Next.js uses React Suspense and streaming to send available UI progressively when the rendering path supports it.

### Loading vs `useState`

- `loading.tsx` handles route-level loading automatically.
- `useState(true)` is often used for client-side actions, such as a button that submits a form.
- They solve related but different problems.

### A local Suspense boundary

For a slower section inside a page, you can use React Suspense:

```tsx
import { Suspense } from "react";

async function SlowRecommendations() {
  const recommendations = await getRecommendations();
  return <p>{recommendations.join(", ")}</p>;
}

async function getRecommendations() {
  return ["Keyboard", "Mouse"];
}

export default function ProductHomePage() {
  return (
    <main>
      <h1>Products</h1>
      <Suspense fallback={<p>Loading recommendations…</p>}>
        <SlowRecommendations />
      </Suspense>
    </main>
  );
}
```

This lets the page provide a fallback for that subsection rather than treating the entire page as one indivisible loading unit.

---

# 12. Error handling and not-found states

These are different situations:

- **Loading:** content is not ready yet.
- **Not found:** the requested page/resource does not exist.
- **Error:** something unexpected failed.

A practical structure:

```text
app/
├── not-found.tsx
└── products/
    ├── loading.tsx
    ├── error.tsx
    ├── not-found.tsx
    ├── page.tsx
    └── [id]/
        └── page.tsx
```

Use:
- `loading.tsx` for pending UI.
- `error.tsx` for recoverable rendering/data errors.
- `not-found.tsx` and `notFound()` for missing routes/resources.

Do not use a thrown generic error to represent a normal “product not found” outcome. Use the not-found flow.

---

# 13. Route Handlers: API endpoints inside App Router

A Route Handler is a server-side HTTP endpoint, commonly placed in `route.ts`.

```text
app/
└── api/
    └── products/
        └── route.ts
```

Example:

```tsx
// app/api/products/route.ts
import { NextResponse } from "next/server";

const products = [
  { id: "1", name: "Keyboard" },
  { id: "2", name: "Mouse" },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Validate body before saving it in a real application.
  return NextResponse.json(
    { message: "Product received", product: body },
    { status: 201 }
  );
}
```

Try:
- `GET /api/products` — returns JSON.
- `POST /api/products` with a JSON request body — returns a response.

A Route Handler is similar in purpose to an Express endpoint, but it uses Web Request/Response APIs and Next.js conventions.

### Read query parameters in a Route Handler

```tsx
// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("q") ?? "";

  return NextResponse.json({ term });
}
```

`GET /api/search?q=keyboard` returns `{ "term": "keyboard" }`.

### Route Handler vs Server Action

- A **Route Handler** exposes an HTTP endpoint.
- A **Server Action** is a server function invoked through React/Next.js action mechanisms, often for mutations from forms.
- They can both perform server-side work, but they are not the same thing.

---

# 14. Server Components vs Client Components

This is a key App Router concept.

## Server Components are the default

```tsx
// app/products/page.tsx
export default async function ProductsPage() {
  const response = await fetch("https://example.com/api/products");
  const products = await response.json();

  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
```

This example demonstrates the shape of server-side data loading; use a real, trusted endpoint and handle errors/validate the response in production.

A Server Component is useful for:
- Reading data securely on the server.
- Keeping secrets away from browser bundles.
- Reducing client JavaScript for non-interactive UI.
- Rendering data-dependent UI.

Do not place private API keys in code that runs in the browser.

## When do you need `"use client"`?

Use it when the component needs browser-side interactivity or APIs such as:
- `useState`, `useEffect`, `useReducer`.
- Event handlers such as `onClick`.
- Browser APIs such as `window` or `localStorage`.

```tsx
// app/components/Counter.tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
}
```

Then a Server Component can render it:

```tsx
// app/page.tsx
import Counter from "./components/Counter";

export default function HomePage() {
  return (
    <main>
      <h1>Home</h1>
      <Counter />
    </main>
  );
}
```

### Important boundary rule

`"use client"` marks a client-module boundary. Its imported component dependencies become part of the client bundle. Keep that boundary as low and small as practical.

A Client Component can be pre-rendered to HTML on the server initially, then hydrated in the browser. “Client Component” does not simply mean “never rendered on the server.”

---

# 15. Data fetching, caching, and revalidation

Server Components can fetch data directly. The exact caching defaults have changed across Next.js versions, so do not assume every `fetch()` is cached forever or always uncached. Be explicit when behavior matters and check the docs for your installed version.

Basic example:

```tsx
// app/products/page.tsx
type Product = {
  id: number;
  title: string;
};

async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://dummyjson.com/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: { products: Product[] } = await response.json();
  return data.products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.slice(0, 5).map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

This is a public demonstration API. In real applications, validate external response data and handle rate limits, network failures, and schema changes.

## Common cache intentions

Conceptually, decide which behavior you want:

1. **Reusable/cached data:** the data can be shared between requests for some period.
2. **Fresh request-time data:** fetch it when the request needs it.
3. **Time-based revalidation:** reuse data but refresh it periodically.
4. **On-demand revalidation:** refresh after a mutation or event.

Depending on your Next.js version, options can include `cache`, `next: { revalidate: ... }`, and cache-tag/path invalidation APIs such as `revalidateTag()` and `revalidatePath()`. Their exact semantics evolve, so consult the current official caching documentation before using them in production.

Example of a time-based revalidation option used in versions that support this fetch option:

```tsx
const response = await fetch("https://example.com/api/products", {
  next: { revalidate: 60 },
});
```

This expresses an intent to revalidate the fetched data on a roughly 60-second interval, subject to Next.js's caching model and route behavior for your version.

### Keep data fetching close to the UI that needs it

A page can call a helper such as `getProducts()`. A nested component can fetch its own data when appropriate. Avoid duplicating identical database/API logic across multiple pages; move shared logic into a reusable server-side module.

---

# 16. Search parameters and forms

Path parameters and search parameters are different.

- Path parameter: `/products/42` → `params.id === "42"`.
- Search parameter: `/products?category=keyboard` → `searchParams.category === "keyboard"`.

Example page:

```tsx
// app/products/page.tsx
type SearchParams = Promise<{
  category?: string;
  q?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, q } = await searchParams;

  return (
    <main>
      <h1>Products</h1>
      <p>Category: {category ?? "all"}</p>
      <p>Search: {q ?? "none"}</p>
    </main>
  );
}
```

Try:
- `/products`
- `/products?category=keyboard`
- `/products?category=keyboard&q=mechanical`

A search parameter can also have multiple values. Type it accordingly if your page needs to support repeated keys.

## Read search parameters in a Client Component

Use `useSearchParams` from `next/navigation` when the UI needs to read the current query string in the browser. Follow current Next.js guidance about Suspense/static rendering for the version you use.

## Form that changes the URL

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const encoded = encodeURIComponent(query.trim());
    router.push(`/products?q=${encoded}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

For user-controlled values, encode them before inserting them into a URL. In production, also validate and normalize inputs on the server.

---

# 17. Parallel routes and intercepting routes

These are advanced features. Understand ordinary routing and layouts first.

## Parallel routes: `@slot`

Parallel routes let one layout render multiple named route slots at the same time. They are useful for dashboards with independent panels or complex modal layouts.

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── @analytics/
    │   └── page.tsx
    └── @activity/
        └── page.tsx
```

The layout receives each slot as a prop:

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  activity,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  activity: React.ReactNode;
}) {
  return (
    <main>
      <section>{children}</section>
      <div className="dashboard-grid">
        <section>{analytics}</section>
        <section>{activity}</section>
      </div>
    </main>
  );
}
```

Each `@analytics` and `@activity` folder is a slot, not a URL segment. The slots can match route state independently. Add `default.tsx` fallbacks where needed for hard-navigation cases.

## Intercepting routes

Intercepting route conventions use parentheses such as `(.)`, `(..)`, `(..)(..)`, and `(...)` to intercept a route from another part of the route tree, commonly to show a modal while preserving the background page during client navigation.

A common use case:
- Clicking a photo opens it in a modal over a gallery.
- Opening or refreshing the photo URL directly renders a full photo page.

This requires coordinated route structure and parallel slots. It is intentionally omitted from the beginner mini-project because the route tree is more involved; learn it after layouts, dynamic routes, and parallel routes.

---

# 18. Metadata and SEO

You can export static metadata from a Server Component page or layout.

```tsx
// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | My App",
  description: "Learn more about this application.",
};

export default function AboutPage() {
  return <h1>About</h1>;
}
```

For a dynamic product page, metadata can depend on `params` and fetched data using the supported `generateMetadata` convention. Do not export `metadata` or `generateMetadata` from a Client Component.

File-based metadata conventions can generate icons and social images. `sitemap.ts` and `robots.ts` can produce sitemap and robots responses. These are useful when the site needs discoverability by search engines.

---

# 19. Middleware / Proxy, redirects, and rewrites

Next.js has request interception conventions that have changed naming and capabilities across releases. In current versions, the convention may be named `proxy.ts`; older projects commonly use `middleware.ts`. Check the documentation for your installed version before adding one.

Use request interception carefully for tasks such as:
- Redirecting a URL.
- Rewriting a URL internally.
- Lightweight request-based routing decisions.
- Some authentication-related checks.

Do **not** treat middleware/proxy as the only security boundary. Verify authorization in the server-side data access or mutation itself. A user hiding a button in the UI does not secure an API or database operation.

For simple redirects, supported configuration or `redirect()` from `next/navigation` may be simpler. A rewrite serves a destination while keeping the visible URL; a redirect sends the browser to a different URL.

---

# 20. A connected mini-project: Product Catalog

This small project connects routing, links, dynamic params, query strings, layouts, loading, not-found UI, and an API route.

## Folder structure

```text
src/app/
├── layout.tsx
├── page.tsx
├── not-found.tsx
├── products/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── not-found.tsx
└── api/
    └── products/
        └── route.ts
```

## Step 1 — Shared root layout

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiny Store",
  description: "A small App Router learning project",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/">Tiny Store</Link>{" "}
          <Link href="/products">Products</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
```

## Step 2 — Home page

```tsx
// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Tiny Store</h1>
      <p>Explore our sample products.</p>
      <Link href="/products">Browse products</Link>
    </main>
  );
}
```

## Step 3 — Shared products layout

```tsx
// src/app/products/layout.tsx
export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <h1>Product area</h1>
      {children}
    </section>
  );
}
```

Both `/products` and `/products/1` are nested under this layout.

## Step 4 — A tiny shared data module

Create `src/lib/products.ts` (make `lib/` at `src/` level if it does not exist):

```tsx
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Keyboard",
    price: 1500,
    description: "A simple mechanical-style keyboard.",
  },
  {
    id: "2",
    name: "Mouse",
    price: 700,
    description: "A lightweight everyday mouse.",
  },
  {
    id: "3",
    name: "Monitor",
    price: 9000,
    description: "A monitor for work and study.",
  },
];
```

This is in-memory sample data, not a database. A real application would use a database or a trusted server-side API.

## Step 5 — Product listing with links and search params

```tsx
// src/app/products/page.tsx
import Link from "next/link";
import { products } from "@/lib/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const normalizedQuery = q?.toLowerCase().trim() ?? "";

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery)
  );

  return (
    <main>
      <h2>Products</h2>
      <p>Search with a URL such as /products?q=mouse.</p>

      {filteredProducts.length === 0 ? (
        <p>No products matched your search.</p>
      ) : (
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>
                {product.name} — ₹{product.price}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

Notice:
- The URL query string comes through `searchParams`.
- The route links to `/products/1`, `/products/2`, etc.
- Each link is handled by the dynamic route in the next step.

## Step 6 — Dynamic product details

```tsx
// src/app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { products } from "@/lib/products";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>₹{product.price}</strong>
    </main>
  );
}
```

Try `/products/1`, `/products/2`, and `/products/999`. The last one triggers the nearest not-found UI.

## Step 7 — Loading fallback

```tsx
// src/app/products/loading.tsx
export default function ProductsLoading() {
  return <p>Loading the product area…</p>;
}
```

This becomes useful when the page has asynchronous work. With tiny synchronous in-memory data, the loading UI may appear too briefly to notice.

## Step 8 — Not-found UI

```tsx
// src/app/products/[id]/not-found.tsx
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main>
      <h2>Product not found</h2>
      <p>That product ID does not exist in our sample catalog.</p>
      <Link href="/products">Back to products</Link>
    </main>
  );
}
```

## Step 9 — API endpoint for the same data

```tsx
// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { products } from "@/lib/products";

export async function GET() {
  return NextResponse.json(products);
}
```

Visit `/api/products` to see JSON. This endpoint and the product pages reuse the same data module, keeping the example correlated.

## Walkthrough

1. Open `/` → `app/page.tsx` renders inside the root layout.
2. Click Products → `/products` renders the root layout, products layout, and product list page.
3. Click Keyboard → `/products/1` matches `[id]`, extracts `"1"`, finds the item, and renders its details.
4. Open `/products/999` → no item is found, so `notFound()` renders the nearest not-found UI.
5. Open `/products?q=mouse` → the `q` search parameter filters the list.
6. Open `/api/products` → the Route Handler returns JSON instead of page HTML.

---

# 21. Common mistakes and debugging

## Mistake 1: expecting every folder to create a route

Wrong assumption: `app/profile/settings/SettingsForm.tsx` automatically creates `/profile/settings`.

Correction: the route needs a `page.tsx`. Ordinary component files do not create URLs.

## Mistake 2: putting interactive hooks in a Server Component

If you use `useState`, `useEffect`, or browser event handlers, add `"use client"` at the top of the component file and keep the client boundary as small as practical.

## Mistake 3: forgetting to await `params`

Modern App Router convention:

```tsx
const { id } = await params;
```

Do not copy an old tutorial's synchronous params example without checking your Next.js version.

## Mistake 4: confusing `params` with `searchParams`

- `/products/12` → path parameter `id = "12"`.
- `/products?q=mouse` → search parameter `q = "mouse"`.

## Mistake 5: using `default.tsx` as a normal fallback page

`default.tsx` is for parallel route slots. For ordinary page content use `page.tsx`; for missing routes use `not-found.tsx`.

## Mistake 6: using `route.ts` and `page.tsx` for the same route segment

They represent different response types and cannot coexist at the exact same segment path. Put the API under a separate path such as `app/api/products/route.ts`.

## Mistake 7: assuming `"use client"` means “only runs in the browser”

Client Components may still be pre-rendered on the server for the initial HTML. The directive establishes a client module boundary and enables client-side interactivity.

## Mistake 8: treating UI checks as authorization

A hidden button is not access control. Check permissions inside the server-side handler or data access layer for every protected operation.

## Mistake 9: blindly trusting cached data

Caching defaults and APIs vary across Next.js releases. Choose freshness and revalidation intentionally, especially for user-specific, financial, or frequently updated data.

## Mistake 10: duplicate URLs inside route groups

Groups are removed from the URL. If two grouped pages resolve to `/about`, you have a conflict. Keep final public paths unique.

---

# 22. Compact cheat sheet

| Need | Use |
|---|---|
| Render a route | `page.tsx` |
| Shared persistent UI | `layout.tsx` |
| Force remount behavior for a segment | `template.tsx` |
| Show loading UI | `loading.tsx` |
| Recover from route error | `error.tsx` |
| Handle root layout errors | `global-error.tsx` |
| Missing page/resource | `not-found.tsx` + `notFound()` |
| Parallel slot fallback | `default.tsx` |
| HTTP API | `route.ts` |
| One variable URL segment | `[id]` |
| Multiple variable segments | `[...slug]` |
| Zero or more segments | `[[...slug]]` |
| Organize without URL segment | `(group)` |
| Keep internal folder out of routes | `_folder` |
| Normal navigation | `Link` |
| Navigate after code/action | `useRouter` |
| Path values | `params` |
| Query-string values | `searchParams` |
| Browser interactivity | `"use client"` |
| Search-engine metadata | `metadata` / `generateMetadata` |
| Sitemap | `sitemap.ts` |
| Crawler rules | `robots.ts` |

---

# 23. Practice exercises

Try these without looking at the answers first.

### Exercise 1 — Predict the URL

Given:

```text
app/
└── (store)/
    └── categories/
        └── [category]/
            └── page.tsx
```

What URL matches the page for `category = "books"`?

### Exercise 2 — Predict `params`

For `/users/42`, what value is extracted from this folder?

```text
app/users/[userId]/page.tsx
```

What is the key name in the `params` object?

### Exercise 3 — Catch-all

What is the difference between `[...slug]` and `[[...slug]]`? Does each match the base route with no extra segments?

### Exercise 4 — Pick the correct file

Choose the convention for each need:
1. Shared sidebar on all dashboard pages.
2. Loading skeleton while a route segment waits.
3. JSON response at `/api/health`.
4. Friendly page for a missing product ID.
5. A counter using `useState`.
6. Group admin routes without adding `/admin-group` to the URL.
7. Fallback for a parallel route slot.

### Exercise 5 — Build

Extend the mini-project:
- Add `/about`.
- Add `/categories/[category]`.
- Add a `Link` from the product page to the category page.
- Make `/products/999` use `notFound()`.
- Add a query-string filter using `?q=`.

### Exercise 6 — Explain in your own words

Explain what Next.js does when a user visits `/products/2`, from URL matching to rendering the root layout, products layout, and dynamic page.

---

# 24. Official references

Use the official docs for version-specific details and updates:

- App Router: https://nextjs.org/docs/app
- Project structure and special files: https://nextjs.org/docs/app/getting-started/project-structure
- Pages and layouts: https://nextjs.org/docs/app/getting-started/layouts-and-pages
- Dynamic routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
- Route groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups
- Linking and navigation: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
- Error handling: https://nextjs.org/docs/app/getting-started/error-handling
- Loading UI and streaming: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Data fetching: https://nextjs.org/docs/app/getting-started/fetching-data
- Metadata: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Parallel routes: https://nextjs.org/docs/app/building-your-application/routing/parallel-routes
- Intercepting routes: https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes

---

## Final mental model

When a request comes in, Next.js matches the URL against the route tree, resolves the relevant route segments and special conventions, and composes the applicable layouts around the selected page or route UI. Dynamic folders provide values through `params`; query strings are available through `searchParams`; loading, error, and not-found files handle different UI states; Route Handlers respond to HTTP requests rather than rendering pages. Server Components are the default, while Client Components are used where browser interactivity is needed.

Learn in this order: **folders and pages → layouts → links → dynamic params → catch-all routes → route groups → loading/errors/not-found → Server vs Client Components → data fetching → Route Handlers → parallel/intercepting routes.**
