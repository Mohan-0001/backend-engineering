# Next.js App Router — Complete Data Fetching Guide

> Beginner-friendly notes covering Server Components, fetching patterns, caching, SSR/SSG/ISR, parallel and sequential requests, loading states, Route Handlers, Server Actions, and production practices.
>
> **Version note:** Next.js caching behavior has changed across versions. These notes use the modern App Router API patterns and call out places where defaults may vary. Check the documentation for the version installed in your project.

## Table of contents

1. [The big picture](#1-the-big-picture)
2. [Where can data be fetched?](#2-where-can-data-be-fetched)
3. [Basic server-side fetching](#3-basic-server-side-fetching)
4. [Fetching close to the component that needs the data](#4-fetching-close-to-the-component-that-needs-the-data)
5. [Sequential vs parallel fetching](#5-sequential-vs-parallel-fetching)
6. [Caching and revalidation](#6-caching-and-revalidation)
7. [Static rendering, SSR, and ISR](#7-static-rendering-ssr-and-isr)
8. [Loading UI, Suspense, and streaming](#8-loading-ui-suspense-and-streaming)
9. [Error handling and not-found pages](#9-error-handling-and-not-found-pages)
10. [Route Handlers](#10-route-handlers)
11. [Server Actions and mutations](#11-server-actions-and-mutations)
12. [Client-side fetching](#12-client-side-fetching)
13. [Search, pagination, and URL state](#13-search-pagination-and-url-state)
14. [Database access, security, and performance](#14-database-access-security-and-performance)
15. [Common mistakes](#15-common-mistakes)
16. [Practice project](#16-practice-project)
17. [Quick revision sheet](#17-quick-revision-sheet)

---

## 1. The big picture

Data fetching means getting information from a source such as:

- An external API
- Your own API
- A database
- A file or other service

In the Next.js App Router, a useful default is:

- Fetch data in **Server Components** when the data can be loaded on the server.
- Fetch data in **Client Components** when it depends on browser interaction or must update interactively in the browser.
- Use **Route Handlers** when you need to expose an HTTP endpoint.
- Use **Server Actions** for server-side mutations triggered by UI actions, such as form submissions.
- Choose caching and revalidation according to how fresh the data must be.

### The basic flow

```text
Browser requests a page
        |
        v
Next.js renders the route on the server
        |
        v
Server Component fetches data
        |
        v
React produces the initial UI output
        |
        v
Browser receives and displays the page
```

The exact rendering and caching behavior depends on the route, framework version, configuration, and data source.

## 2. Where can data be fetched?

### A. Server Component

In the App Router, pages and layouts are Server Components by default.

```tsx
export default async function ProductsPage() {
  const response = await fetch("https://example.com/api/products");
  const products = await response.json();

  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
```

Benefits:

- Secrets can stay on the server.
- The browser does not need to make this initial request itself.
- You can call a database or server-only service directly.
- You can reduce the JavaScript sent for components that do not need browser interactivity.

### B. Client Component

Use `"use client"` when a component needs browser capabilities such as state, event handlers, effects, or browser APIs.

```tsx
"use client";

import { useEffect, useState } from "react";

export default function ClientProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to load products");
      setProducts(await response.json());
    }

    loadProducts().catch(console.error);
  }, []);

  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
```

This example is intentionally basic. In production, also provide loading and error UI, and consider a data-fetching library for caching, deduplication, retries, and refetching.

### C. Direct database or service access

If server-side code needs database data, it can often call a shared server-side function directly instead of making an HTTP request to its own Route Handler.

```tsx
// app/products/page.tsx
import { getProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await getProducts();
  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
```

Keep database code and secrets in server-only modules. Do not import database clients into Client Components.

---

## 3. Basic server-side fetching

Here is the original example:

```tsx
export default async function Home() {
  const response = await fetch("http://localhost:3000/api/user", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const data = await response.json();

  return (
    <div>
      Hello Ji
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### What each part does

- `async function Home()` allows the component to await asynchronous work.
- `fetch(...)` requests data.
- `cache: "no-store"` opts that fetch out of the Next.js Data Cache.
- `response.ok` checks whether the HTTP status is successful. `fetch()` does not automatically throw for statuses such as 404 or 500.
- `await response.json()` parses the response body.
- JSX renders the data.

### Avoid hardcoding localhost for production

`http://localhost:3000` points to the machine/container running the code. In production, it may not point to your deployed application. For a Next.js page fetching its own data, prefer a shared server-side function or database call when appropriate.

Also remove unused imports, such as `import Image from "next/image"` if no image is rendered.

---

## 4. Fetching close to the component that needs the data

This is an **architectural principle**, not a strict rule.

Imagine a dashboard with three sections:

```text
Dashboard
├── Profile        needs user data
├── Orders         needs order data
└── Notifications  needs notification data
```

### Option A: Fetch everything in the parent

```tsx
export default async function Dashboard() {
  const user = await getUser();
  const orders = await getOrders();
  const notifications = await getNotifications();

  return (
    <div>
      <Profile user={user} />
      <Orders orders={orders} />
      <Notifications notifications={notifications} />
    </div>
  );
}
```

This is valid, but these sequential `await` statements make the requests run one after another if each function starts its work only when called.

### Option B: Let each section fetch what it needs

```tsx
// app/dashboard/page.tsx
import Profile from "./Profile";
import Orders from "./Orders";
import Notifications from "./Notifications";

export default function Dashboard() {
  return (
    <div>
      <Profile />
      <Orders />
      <Notifications />
    </div>
  );
}
```

```tsx
// app/dashboard/Profile.tsx
import { getUser } from "@/lib/data";

export default async function Profile() {
  const user = await getUser();
  return <div>Welcome, {user.name}</div>;
}
```

```tsx
// app/dashboard/Orders.tsx
import { getOrders } from "@/lib/data";

export default async function Orders() {
  const orders = await getOrders();
  return <div>Total orders: {orders.length}</div>;
}
```

Benefits:

- Each component owns the data it needs.
- Components can be easier to reuse.
- Data access and presentation for a section stay close together.
- With appropriate Suspense boundaries, sections can stream independently.

### Important nuance

Component-local fetching does **not guarantee** that every request starts at exactly the same time. If requests are independent and you want them to start together, explicitly start them in parallel or structure the components with suitable Suspense boundaries.

Choose based on the page's needs. Fetch in the parent when the parent needs to coordinate or share the results; fetch near the component when it improves ownership and independent rendering.

---

## 5. Sequential vs parallel fetching

### Sequential: the second request waits

```tsx
const user = await getUser();
const orders = await getOrders();
```

If `getUser()` takes about 1 second and `getOrders()` takes about 2 seconds, total waiting time is roughly 3 seconds.

Use sequential requests when the second request depends on the first result.

```tsx
const user = await getUser();
const orders = await getOrdersForUser(user.id);
```

The order is necessary because `user.id` is not available until `getUser()` resolves.

### Parallel: independent requests run concurrently

```tsx
const [user, orders] = await Promise.all([
  getUser(),
  getOrders(),
]);
```

If both take around 2 seconds, total waiting time may be around 2 seconds, plus overhead, instead of around 4 seconds.

`Promise.all()` returns results in input order, not completion order. It rejects if any input promise rejects.

### Parallel fetching with fetch()

```tsx
const [userResponse, ordersResponse] = await Promise.all([
  fetch("https://example.com/api/user"),
  fetch("https://example.com/api/orders"),
]);

if (!userResponse.ok || !ordersResponse.ok) {
  throw new Error("Failed to load dashboard data");
}

const [user, orders] = await Promise.all([
  userResponse.json(),
  ordersResponse.json(),
]);
```

### Avoid a request waterfall

A request waterfall happens when one request must finish before another independent request even starts.

```text
Bad for independent work:
getUser -> wait -> getOrders -> wait -> render

Better:
getUser  ---------\
                   -> render when both finish
getOrders --------/
```

### When should you use each?

| Situation | Good approach |
|---|---|
| Second request needs first result | Sequential `await` |
| Requests are independent and both results are needed | `Promise.all()` |
| Independent UI sections can appear separately | Separate async components + Suspense |
| One request failing should not discard all other results | Consider `Promise.allSettled()` and handle each result |

---

## 6. Caching and revalidation

Caching stores a result so it can be reused instead of recomputing or refetching it every time. In Next.js, understand these as distinct concepts:

1. **Data Cache** — caching of data fetched with supported Next.js fetch options.
2. **Full Route Cache** — cached rendered route output where applicable.
3. **Router Cache** — client-side cache of route segments during navigation.
4. **Browser/CDN caches** — separate HTTP caching layers that may also affect what a user receives.

They are related, but they are not the same cache.

### A. Do not cache this fetch

```tsx
const response = await fetch("https://example.com/api/user", {
  cache: "no-store",
});
```

This opts the fetch out of the Next.js Data Cache. It does not mean every cache in the entire delivery path is automatically disabled.

Useful when data needs to be fetched fresh for each server request, such as request-specific information. Make sure private data is authorized correctly.

### B. Revalidate after an interval

```tsx
const response = await fetch("https://example.com/api/products", {
  next: { revalidate: 60 },
});
```

This sets a 60-second revalidation interval for the fetch.

The important point: **60 seconds is not a promise that the page will regenerate exactly at second 60.** After the interval, a subsequent request can trigger revalidation. With stale-while-revalidate behavior, a request may receive the previously cached result while Next.js refreshes the cache. A later request can receive the regenerated result.

If nobody requests the page/data, time passing alone generally does not cause a request-driven revalidation to run immediately.

### C. Force caching (where supported by the installed version)

```tsx
const response = await fetch("https://example.com/api/products", {
  cache: "force-cache",
});
```

This opts into the Next.js Data Cache. Check your installed Next.js version because defaults and cache APIs have changed.

### D. On-demand revalidation

For data that changes after an admin action or mutation, time-based revalidation may not be enough.

Depending on the cache design and Next.js version, you can use:

- `revalidatePath("/products")` to revalidate cached data/route output associated with a path.
- `revalidateTag("products")` to invalidate or revalidate tagged data.
- `updateTag("products")` in supported Server Action flows when immediate expiration is needed.

Example of tagging a fetch:

```tsx
const response = await fetch("https://example.com/api/products", {
  next: { tags: ["products"] },
});
```

Then from suitable server-side code:

```tsx
import { revalidateTag } from "next/cache";

revalidateTag("products", "max");
```

**Version note:** Tag invalidation signatures and semantics vary by Next.js version. In current versions that use the cache-life profile form, `"max"` uses stale-while-revalidate behavior. Check the docs for the version in your project before copying this API into production.

### E. Route segment revalidation

A route segment can also declare a revalidation interval in supported configurations:

```tsx
export const revalidate = 60;
```

This is different from setting `next: { revalidate: 60 }` on an individual fetch. Route segment configuration has runtime and route restrictions, so use the version-specific documentation.

### Quick comparison

| Option | Meaning |
|---|---|
| `cache: "no-store"` | Do not use the Next.js Data Cache for this fetch |
| `cache: "force-cache"` | Opt into the Data Cache |
| `next: { revalidate: 60 }` | Revalidate cached data after the interval, typically on a later request |
| `next: { tags: ["products"] }` | Associate cached data with a tag for targeted revalidation |
| `revalidatePath(...)` | Revalidate data/route output associated with a path |
| `revalidateTag(...)` | Revalidate or invalidate data associated with a tag, according to the API/version |

---

## 7. Static rendering, SSR, and ISR

These terms describe rendering strategies, while `fetch` cache settings describe data-fetch behavior. They are connected but not interchangeable.

### SSR / dynamic rendering

The server renders a response at request time when the route's configuration and data require dynamic rendering.

```tsx
export default async function Home() {
  const response = await fetch("https://example.com/api/user", {
    cache: "no-store",
  });
  const data = await response.json();

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### Static rendering / SSG

A route can be rendered ahead of time and reused when its data and route configuration allow static rendering. Exact defaults depend on the Next.js version and route features.

Good for public content that changes infrequently, such as documentation or marketing pages.

### ISR

Incremental Static Regeneration allows cached static output to be regenerated after a revalidation interval or via supported on-demand invalidation.

```tsx
export default async function Home() {
  const response = await fetch("https://example.com/api/products", {
    next: { revalidate: 60 },
  });
  const products = await response.json();

  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
```

### What the browser experiences

- A cached HTML response does not update an already-open browser tab by itself.
- Revalidation refreshes server-side cached output/data; it does not push new HTML into the browser.
- A later request or navigation can receive updated output.
- For live updates without navigation/reload, add polling, a user-triggered refresh, Server-Sent Events, or WebSockets as appropriate.

### Comparison

| Strategy | Typical use | Freshness behavior |
|---|---|---|
| Request-time rendering / SSR | Request-specific or frequently changing content | Server renders for the request |
| Static rendering / SSG | Public, relatively stable content | Reuses pre-rendered output |
| ISR | Public content that can tolerate a short delay | Reuses cached output and regenerates when revalidation is triggered |

Do not assume that `revalidate: 60` alone guarantees every route is statically generated in every version/configuration. Rendering decisions depend on the route and the installed Next.js version.

---

## 8. Loading UI, Suspense, and streaming

A slow data request can delay the UI. Next.js and React provide ways to show a loading state or stream sections as they become ready.

### A. `loading.tsx`

Example structure:

```text
app/
└── dashboard/
    ├── loading.tsx
    └── page.tsx
```

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

Next.js can show this loading UI while the route segment is loading. It is especially useful for route-level loading states and navigation.

### B. React Suspense for individual sections

```tsx
import { Suspense } from "react";
import Profile from "./Profile";
import Orders from "./Orders";

export default function Dashboard() {
  return (
    <div>
      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading orders...</p>}>
        <Orders />
      </Suspense>
    </div>
  );
}
```

`Profile` and `Orders` can be async Server Components that fetch their own data. Their boundaries allow their sections to show fallbacks while waiting, then stream content when ready.

### C. How streaming changes the experience

```text
Page starts rendering
       |
       +--> Profile fallback appears
       |
       +--> Orders fallback appears
       |
       +--> Profile data is ready -> Profile UI streams in
       |
       +--> Orders data is ready -> Orders UI streams in
```

The exact timing depends on the rendering tree, data requests, and runtime.

---

## 9. Error handling and not-found pages

### A. Check HTTP responses

`fetch()` rejects for network failures, but does not automatically throw for an HTTP 404 or 500. Check `response.ok`.

```tsx
const response = await fetch("https://example.com/api/products");

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

const products = await response.json();
```

### B. Route-level `error.tsx`

```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

`error.tsx` is a Client Component. It catches errors in the relevant route segment's rendered subtree; errors thrown in the same segment's layout may require a boundary higher in the tree.

### C. Handle missing records with `notFound()`

```tsx
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return <h1>{product.name}</h1>;
}
```

This `params` type reflects modern Next.js versions where route params are asynchronous. Older versions may use synchronous params; follow your project's version.

Use `notFound()` for a genuinely missing resource, not as a catch-all for every API or database failure.

---

## 10. Route Handlers

A Route Handler exposes an HTTP endpoint, for example `app/api/products/route.ts`.

```tsx
// app/api/products/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
```

A `POST` handler can accept a request body:

```tsx
// app/api/products/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // Validate body, authorize user, then create the product.
  const product = await createProduct(body);

  return NextResponse.json(product, { status: 201 });
}
```

These are simplified examples. Production code must validate input, authenticate/authorize the caller, and handle errors safely.

### When to use a Route Handler

Use it when you need an HTTP API for:

- A browser Client Component
- A mobile app or other external client
- A webhook
- A third-party integration

### When not to add an unnecessary HTTP hop

If a Server Component needs data from your own database, prefer a shared server-side data-access function:

```tsx
const products = await getProducts();
```

rather than:

```tsx
const response = await fetch("http://localhost:3000/api/products");
```

The direct call avoids making your server issue another HTTP request to itself. Keep Route Handlers when an HTTP boundary is actually needed.

---

## 11. Server Actions and mutations

Fetching is often described as reading data. Creating, updating, or deleting data is a mutation.

Server Actions let client UI invoke server-side functions for mutations. They are useful for forms and actions such as adding a product to a cart.

```tsx
// app/actions.ts
"use server";

export async function createProduct(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Product name is required");
  }

  // Authenticate and authorize the user.
  // Validate all fields and save the product to the database.
}
```

Use it from a form:

```tsx
import { createProduct } from "@/app/actions";

export default function ProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" required />
      <button type="submit">Create product</button>
    </form>
  );
}
```

This is only a teaching example. Real actions should use the application's validation and error-reporting approach, and must authenticate/authorize each operation. Never assume a Server Action is private merely because it runs on the server.

After a mutation, you may need to refresh or invalidate affected cached data:

- `revalidatePath(...)`
- `revalidateTag(...)`
- `updateTag(...)` in supported Server Action use cases
- `refresh()` or client-side refresh patterns where appropriate

Choose the method based on your caching strategy and Next.js version.

---

## 12. Client-side fetching

Client-side fetching is useful when data depends on user interaction, needs to refresh frequently, or should update without a full route navigation.

### Simple example with `useEffect`

```tsx
"use client";

import { useEffect, useState } from "react";

type User = {
  name: string;
};

export default function UserWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("Failed to fetch user");

        const data: User = await response.json();
        if (!cancelled) setUser(data);
      } catch {
        if (!cancelled) setError("Could not load user.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>No user found.</p>;

  return <p>Hello, {user.name}</p>;
}
```

For larger applications, consider a library such as SWR or TanStack Query for client-side caching, refetching, mutations, retries, and request deduplication.

---

## 13. Search, pagination, and URL state

Search and pagination are common data-fetching patterns. Query parameters are useful because the URL can represent the current search state.

Example URL:

```text
/products?query=phone&page=2
```

In a modern App Router page:

```tsx
type SearchParams = Promise<{
  query?: string;
  page?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { query = "", page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number(page) || 1);

  const products = await searchProducts({
    query,
    page: pageNumber,
  });

  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
```

`searchParams` is asynchronous in modern Next.js versions; older versions may differ.

Remember to:

- Validate and normalize query values.
- Limit page size.
- Use database indexes for common search patterns.
- Enforce authorization on the server.
- Avoid trusting user-supplied IDs or filters without checks.

---

## 14. Database access, security, and performance

### A. Keep secrets on the server

Do not expose database passwords, private API keys, or privileged credentials in Client Components or variables prefixed for public exposure.

### B. Authorize every protected data read

Hiding a component in the UI is not authorization. The server-side function, Route Handler, or Server Action must check whether the current user can access the requested record.

### C. Use a data-access layer

A common structure:

```text
app/
├── dashboard/
│   ├── page.tsx
│   ├── Profile.tsx
│   └── Orders.tsx
├── api/
│   └── products/
│       └── route.ts
lib/
├── data.ts
└── auth.ts
```

Keep database queries and reusable server-only logic in `lib/`. A `server-only` import can help prevent accidental use of sensitive modules in Client Components.

### D. Avoid duplicate work

If both `generateMetadata()` and a page need the same product, consider sharing a data-access function. Identical `fetch()` requests may be memoized in supported rendering contexts, but arbitrary database calls or custom functions do not automatically get every same caching/deduplication behavior. Check the current Next.js docs and use request memoization or caching intentionally.

### E. Handle scale

For production, consider:

- Database indexes
- Pagination and bounded result sizes
- Request timeouts and cancellation
- Rate limiting
- Retries only where safe
- Cache invalidation strategy
- Observability and error logging
- Avoiding slow serial requests
- Protecting against N+1 database queries

---

## 15. Common mistakes

### Mistake 1: Assuming `fetch()` throws for HTTP 404/500

It normally does not. Check `response.ok`.

### Mistake 2: Assuming `revalidate: 60` updates an open tab automatically

It does not push updates into an already-open browser tab. Revalidation updates server-side cached data/output; the browser needs a later request or an explicit live-update mechanism to see new data.

### Mistake 3: Treating all caches as one cache

The Data Cache, Full Route Cache, Router Cache, and browser/CDN caches have different purposes.

### Mistake 4: Making sequential requests when they are independent

Use `Promise.all()` when all results are needed and the requests do not depend on each other.

### Mistake 5: Assuming component-local fetching always starts in parallel

Component placement improves ownership, but explicit concurrency and Suspense boundaries determine how independent work starts and streams.

### Mistake 6: Fetching your own Route Handler from a Server Component unnecessarily

Directly call a shared server-side data function or database when an HTTP endpoint is not needed.

### Mistake 7: Treating Server Actions as automatically authorized

They execute on the server, but every mutation still needs validation and authorization.

### Mistake 8: Copying caching code without checking the Next.js version

Caching defaults and revalidation APIs have changed. Check your project's installed version and the matching documentation.

---

## 16. Practice project

Build a small products dashboard with:

1. A server-rendered product list.
2. A product detail route using a dynamic `[slug]` segment.
3. Search and pagination using URL query parameters.
4. A loading UI using `loading.tsx` or Suspense.
5. A useful not-found state for missing products.
6. Parallel fetching for independent dashboard sections.
7. A cached product list with time-based revalidation.
8. A mutation that updates a product and invalidates the relevant cached data.
9. A Route Handler for external clients.
10. Authentication and authorization for private operations.

### Suggested file structure

```text
app/
├── products/
│   ├── page.tsx
│   └── [slug]/
│       ├── page.tsx
│       └── loading.tsx
├── dashboard/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── Profile.tsx
│   └── Orders.tsx
├── api/
│   └── products/
│       └── route.ts
└── actions.ts
lib/
├── data.ts
└── auth.ts
```

---

## 17. Quick revision sheet

| Concept | Remember |
|---|---|
| Server Component | Default App Router component; can fetch on the server |
| Client Component | Use `"use client"` for state, events, effects, and browser APIs |
| `cache: "no-store"` | Opts a fetch out of the Next.js Data Cache |
| `next: { revalidate: 60 }` | Time-based revalidation for cached fetch data |
| `Promise.all()` | Concurrently await independent promises |
| Sequential `await` | Useful when later work depends on earlier results |
| Fetch close to the component | Keeps data ownership near the UI that needs it |
| Suspense | Provides a boundary for fallback UI and streaming |
| `loading.tsx` | Route-segment loading UI |
| `error.tsx` | Route-segment error boundary UI |
| `notFound()` | Show the route's not-found UI for a missing resource |
| Route Handler | Exposes an HTTP endpoint |
| Server Action | Runs server-side mutation logic invoked by UI |
| `revalidatePath()` | Revalidates data/route output associated with a path |
| `revalidateTag()` | Revalidates or invalidates tag-associated data |
| ISR | Reuses static output and regenerates it when revalidation is triggered |
| Direct database call | Often preferable to an unnecessary self-request to your own API |

## Final mental model

```text
Need data?
   |
   +--> Server-side page data
   |       -> Server Component
   |       -> shared server data function / database
   |
   +--> Independent requests?
   |       -> Promise.all()
   |
   +--> Independent UI sections should load separately?
   |       -> async Server Components + Suspense
   |
   +--> Need data refreshed/cached?
   |       -> choose cache and revalidation strategy
   |
   +--> Browser interaction or live updates?
   |       -> Client Component / polling / SSE / WebSocket
   |
   +--> Need an HTTP endpoint?
   |       -> Route Handler
   |
   +--> Need to create/update/delete data?
           -> Server Action or Route Handler
           -> validate, authorize, then revalidate affected data
```

**Core rule:** Decide where data belongs, whether requests depend on each other, how fresh the result must be, and how the UI should behave while waiting. Those decisions determine the right Next.js data-fetching pattern.
