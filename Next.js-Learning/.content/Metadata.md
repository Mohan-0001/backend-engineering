# Next.js App Router: Metadata API — Complete Learning Notes

> Beginner-friendly notes covering the metadata concepts discussed in this chat.

## 1. What is metadata?

Metadata describes a page to browsers and search engines. In Next.js App Router, you can define metadata by exporting a `metadata` object from a `layout.tsx` or `page.tsx` file.

Common metadata includes:

- `title`: the page title, often shown in the browser tab and potentially in search results.
- `description`: a short summary of the page that search engines may use as a search-result snippet.

Next.js uses the route hierarchy to resolve metadata and generate the appropriate HTML for each URL. Google does **not** read your `layout.tsx` source file directly; it crawls the rendered page.

## 2. Basic metadata

Example: `app/layout.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "Learning the Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### What does `Metadata` mean?

`import type { Metadata } from "next"` imports Next.js's TypeScript type for metadata. It helps TypeScript check that the object uses supported metadata fields and values.

`export const metadata` makes the metadata available to Next.js. The `metadata` export is supported in Server Components; do not export it from a Client Component marked with `"use client"`.

## 3. Metadata in nested layouts and pages

Example project structure:

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

Each folder segment can contribute metadata through its `layout.tsx`, and an individual page can define its own metadata through `page.tsx`.

### Root layout: `app/layout.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "Welcome to My App. Explore our website.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Dashboard layout: `app/dashboard/layout.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | My App",
  description: "Manage your account and projects.",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <section>{children}</section>;
}
```

The dashboard layout wraps the dashboard page and its nested pages. Its metadata is inherited by those descendants unless a more specific segment overrides relevant fields.

### Dashboard page: `app/dashboard/page.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your projects and track progress.",
};

export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}
```

The page's `title` and `description` take precedence over those fields from ancestor layouts.

### Settings page: `app/dashboard/settings/page.tsx`

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings.",
};

export default function SettingsPage() {
  return <h1>Settings</h1>;
}
```

If a page defines its own description, that description wins over inherited descriptions. If it does not, the nearest applicable ancestor description is inherited.

## 4. How metadata inheritance and merging work

Next.js resolves metadata from the root layout down through nested layouts to the leaf page.

Conceptually:

1. Start with metadata from the root layout.
2. Apply metadata from each nested layout along the route.
3. Apply metadata from the page.
4. More specific values override inherited values for the same fields.

Metadata is merged field by field; a child does not automatically erase every field from its parent just because it exports a metadata object.

Example:

| Route | Title source | Description source |
|---|---|---|
| `/` | Root metadata or the root title default | Root layout, unless home page overrides it |
| `/dashboard` | Dashboard page, if defined; otherwise inherited/default title behavior | Dashboard page, if defined; otherwise inherited description |
| `/dashboard/settings` | Settings page, if defined; otherwise inherited/default title behavior | Settings page, if defined; otherwise inherited description |

**Important:** A child page can override `title` and `description` independently. For example, it can set a custom title but continue inheriting the parent's description.

## 5. `title.default` and `title.template`

A root layout can define a default title and a template:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "My App",
    template: "%s | My App",
  },
  description: "Learning the Next.js App Router",
};
```

### `default`

`default` is the fallback title for a segment when a child page or nested layout does not provide a title of its own.

For example, if the home page has no title metadata, the default can be `My App`.

### `template`

`template` formats titles supplied by child pages or nested layouts.

```tsx
title: {
  default: "My App",
  template: "%s | My App",
}
```

Here, `%s` is a special placeholder understood by Next.js. It is replaced with the title supplied by the child.

| Child title | Resolved title |
|---|---|
| `Dashboard` | `Dashboard \| My App` |
| `Settings` | `Settings \| My App` |
| `Products` | `Products \| My App` |

`%s` is not a JavaScript variable or a string interpolation expression. It is a placeholder used by Next.js's metadata title-template feature.

### Example page title

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}
```

With the root template `%s | My App`, the resolved title is `Dashboard | My App`.

### A subtle but important rule

A layout's own `title.template` applies to titles in its **child segments**; it does not format the title of that same layout. A layout's `title.default` supplies the fallback title for its segment when applicable.

For example, a nested dashboard layout can define:

```tsx
export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Dashboard",
  },
};
```

A child settings page with `title: "Settings"` resolves to `Settings | Dashboard`, because the nearest applicable parent template is the dashboard layout's template.

The dashboard layout's own title is not transformed into `Dashboard | Dashboard` by its own template.

## 6. Can `description` have a template like `%s`?

No. The special `title.template` mechanism is for the title field. `description` does not have an equivalent `%s` template.

Define a default description in a parent layout:

```tsx
export const metadata: Metadata = {
  description: "Welcome to My App. Explore our website.",
};
```

Then override it for an individual page:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your projects and track progress.",
};
```

The dashboard page gets its own description. Other pages inherit the nearest applicable description unless they define their own.

### Good SEO practice

Write a distinct, accurate description for each important page. Search engines may use the description as a search-result snippet, but Google can choose different text from the page content. Metadata alone does not guarantee indexing or a particular ranking.

## 7. How does Google receive this metadata?

For a route such as `/dashboard`, Next.js resolves the applicable metadata and emits HTML similar to:

```html
<head>
  <title>Dashboard | My App</title>
  <meta
    name="description"
    content="Manage your projects and track progress."
  />
</head>
```

The browser can use the `<title>` for the tab title. Search engines can read the HTML when crawling the URL.

Key distinction:

- `/` is one URL and has its own resolved metadata.
- `/dashboard` is another URL and has its own resolved metadata.
- `/dashboard/settings` is another URL and has its own resolved metadata.

Google does not identify metadata based on a filename such as `layout.tsx`. Next.js uses the route hierarchy to generate the appropriate output for each URL.

## 8. Quick rules to remember

- **`layout.tsx`**: metadata shared by a route segment and its descendants.
- **`page.tsx`**: metadata specific to a page.
- **More specific metadata**: overrides inherited values for the same fields.
- **`title.default`**: fallback title.
- **`title.template`**: formats child titles using `%s`.
- **`description`**: inherits or gets overridden, but has no `%s` template feature.
- **Google**: crawls the generated page HTML, not your source files.
- **SEO**: unique descriptions can help communicate page content, but do not guarantee rankings or a particular snippet.

## 9. Official documentation

- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js `metadata` and `generateMetadata` API reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

---

*Learning note: understand the route hierarchy first, then think of metadata as values that flow from parent layouts to child pages, with more specific values taking precedence.*

## 10. Avoiding duplicate database queries in `generateMetadata()` and the page

A common concern: both `generateMetadata()` and the page component need the same product data. If each calls a database function that performs a fresh query, the application may do the same work twice.

### The duplicated lookup

```tsx
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug); // Potential database query #1

  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug); // Potential database query #2

  if (!product) notFound();

  return <h1>{product.name}</h1>;
}
```

Both calls are valid, but without deduplication, a direct database function such as a Mongoose query may execute twice.

### Solution: wrap the shared data-access function with React `cache()`

Create one shared function, for example `app/lib/products.ts`:

```ts
import { cache } from "react";
import { Product } from "@/models/Product";

export const getProduct = cache(async (slug: string) => {
  return Product.findOne({ slug }).lean();
});
```

Then import this exact `getProduct` function in both `generateMetadata()` and `ProductPage()`.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/app/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return <h1>{product.name}</h1>;
}
```

### What does `cache()` do here?

- The first call for a given argument, such as `"iphone"`, runs the function and obtains the product.
- A matching call through the same cached function can reuse the result within the relevant React server-render/request context.
- This can avoid a second MongoDB query when `generateMetadata()` and the page need the same product.
- Keep the function in a shared module so both callers use the same cached function instance.

### Important distinction: memoization is not a permanent cache

React `cache()` is for memoization in React's server-rendering context. It does **not** mean the product stays cached forever across all users and future requests. A later request can query the database again.

Also distinguish these two cases:

- **Next.js `fetch()` requests:** identical fetch requests are automatically memoized in supported rendering contexts.
- **Direct database calls (such as Mongoose):** they are not automatically deduplicated merely because they query the same record. A shared React `cache()` wrapper is one suitable approach.

If the application needs data to remain cached across separate requests, that is a separate persistent-caching decision and should be configured deliberately for the relevant Next.js version and data-freshness requirements.

### Practical checklist

1. Put the database lookup in one shared data-access function.
2. Wrap that function with `cache()` when request/render-level deduplication is appropriate.
3. Import the same wrapped function into both the page and `generateMetadata()`.
4. Handle missing records in both paths, for example with `notFound()`.
5. Do not mistake request-level memoization for a long-lived application cache.

Official references:
- [Next.js `generateMetadata()` API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Fetching Data guide](https://nextjs.org/docs/app/getting-started/fetching-data)
- [React `cache()` reference](https://react.dev/reference/react/cache)
