Next.js App Router — Complete useRouter() Notes

1. What is useRouter()?
useRouter() is a React hook that lets you navigate programmatically in Next.js App Router.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function DashboardButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/dashboard")}>
      Open Dashboard
    </button>
  );
}
```

Important:
- Import from next/navigation when using the App Router.
- The component must be a Client Component.
- Use useRouter() when navigation depends on an action or condition.
- Prefer <Link> for ordinary navigation links.
- The older Pages Router uses next/router, which has a different API.

2. All useRouter() Methods

| Method | Purpose |
| --- | --- |
| `router.push()` | Navigate and add a browser-history entry |
| `router.replace()` | Navigate without adding a new history entry |
| `router.back()` | Go back in browser history |
| `router.forward()` | Go forward in browser history |
| `router.refresh()` | Request an updated render of the current route |
| `router.prefetch()` | Prefetch a route to help make future navigation faster |

3. router.push()
Use push() when you want to navigate to another route and normally allow the Back button to return to the previous history entry.

```tsx
router.push("/profile");
```

It also accepts an options object:

```tsx
router.push("/products", {
  scroll: false,
});
```

Use cases:
- Opening a dashboard after clicking a button.
- Navigating after a successful operation.
- Changing the route when the user selects a result.

Navigation with transition types
In Next.js versions that support it:

```tsx
router.push("/dashboard", {
  transitionTypes: ["slide"],
});
```

We will explain transitionTypes in Section 6.

4. router.replace()
replace() navigates to another route without creating a new browser-history entry.

```tsx
router.replace("/dashboard");
```

Example: after login
Suppose the user is on /login.
After successful login:

```tsx
router.replace("/dashboard");
```

This replaces the current history entry rather than adding another one. Pressing Back is therefore less likely to take the user back to the login entry.

It accepts navigation options, too:

```tsx
router.replace("/dashboard", {
  scroll: false,
});
```

Remember:
- push() → add a history entry.
- replace() → replace the current history entry.

5. Scrolling — the scroll Option
Both push() and replace() support the scroll option.

Default behavior

```tsx
router.push("/products");
```

Next.js handles scrolling automatically. For typical route navigation, it generally scrolls to the top of the new page, while preserving or restoring scroll position when appropriate.

Disable automatic scrolling

```tsx
router.push("/products?sort=price", {
  scroll: false,
});
```

This is useful when changing a filter or sort order while the user is reading a long list.

You can also use it with replace():

```tsx
router.replace("/settings", {
  scroll: false,
});
```

Important: scroll: false disables Next.js's automatic scroll behavior for that navigation. It does not prevent your own code from scrolling the page, and it does not guarantee that every nested scroll container will preserve its position.

6. transitionTypes — Navigation Transitions
In Next.js versions that support it, push() and replace() accept a transitionTypes option.

```tsx
router.push("/dashboard", {
  transitionTypes: ["slide"],
});
```

What does it do?
It passes transition type names into React's navigation transition mechanism.
Think of it as identifying the type of transition associated with a navigation.

Does "slide" automatically create a slide animation?
No.
Writing:
transitionTypes: ["slide"]
does not automatically create a visual slide animation.
The visual effect needs to be implemented using the relevant React View Transition support and styling, where supported by your React and Next.js versions and project setup.

Combining scrolling and transitions

```tsx
router.push("/dashboard", {
  scroll: false,
  transitionTypes: ["slide"],
});
```

This combines two separate options:
- scroll: false — disable Next.js's automatic scroll behavior.
- transitionTypes: ["slide"] — mark the navigation with the slide transition type.
It does not define the actual animation.

Version note: Check the official documentation for your installed Next.js and React versions because transition APIs and support can evolve.

7. router.back()
Moves backward through the browser's history.

```tsx
router.back();
```

Example:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()}>
      Go Back
    </button>
  );
}
```

It behaves similarly to the browser's Back button.
Be careful: if the user opened the current page directly, there might not be a useful previous page in the application.
If you need a guaranteed fallback route, implement that fallback explicitly.

8. router.forward()
Moves forward through the browser's history.

```tsx
router.forward();
```

Example:

```tsx
<button onClick={() => router.forward()}>
  Go Forward
</button>
```

It behaves like the browser's Forward button.
Both back() and forward() depend on the browser-history stack.

9. router.refresh()
refresh() requests the current route again and merges the updated React Server Component (RSC) payload into the existing UI.

```tsx
router.refresh();
```

Conceptual flow
1. The client requests a refresh of the current route.
2. Next.js renders the relevant Server Components again.
3. Next.js returns an updated RSC payload.
4. React merges the updated result into the existing UI.
5. Client-side state that can be preserved is not necessarily reset.

Important caching distinction
router.refresh() does not invalidate the server-side Data Cache.
If your server-side data is cached, a refresh can reuse cached data.

| Goal | API to consider |
| --- | --- |
| Refresh the current route's Server Component UI | `router.refresh()` |
| Revalidate cached server data | `revalidatePath()` or `revalidateTag()` in the appropriate server-side context |
| Navigate to another route | `router.push()` or `router.replace()` |

router.refresh() vs window.location.reload()
- router.refresh() requests an updated route render through Next.js's RSC mechanism.
- window.location.reload() reloads the browser document.
They are not the same operation.

10. router.prefetch()
prefetch() requests route resources ahead of time so that later navigation may be faster.

```tsx
router.prefetch("/dashboard");
```

The onInvalidate option
In supported versions, you can provide an onInvalidate callback:

```tsx
router.prefetch("/dashboard", {
  onInvalidate() {
    // The prefetched data became stale.
    // Decide whether another prefetch is useful.
  },
});
```

This callback indicates that the prefetched data became stale. It does not guarantee that the route will automatically be prefetched again.

Do we always need prefetch()?
No. Next.js <Link> can automatically prefetch routes when links enter the viewport, depending on route type and configuration.
Use manual prefetching when you have a specific reason to prepare a route ahead of time.

11. Where Are pathname and query?
In the App Router, useRouter() does not provide the old Pages Router properties router.pathname and router.query.
Use separate hooks instead:

| Requirement | Hook |
| --- | --- |
| Current pathname, such as `/products` | `usePathname()` |
| Query string, such as `?sort=price&page=2` | `useSearchParams()` |
| Dynamic route parameters, such as `slug` | `useParams()` |

These hooks are intended for Client Components. Server Component pages can also receive route parameters and search parameters through their props, depending on the Next.js version and route.

12. Practical Example — Navigate After an Action

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function SaveAndContinue() {
  const router = useRouter();

  async function handleContinue() {
    // 1. Save or submit the data.
    // 2. Check whether the operation succeeded.
    // 3. Navigate only after success.

    router.push("/checkout/review", {
      scroll: false,
    });
  }

  return (
    <button onClick={handleContinue}>
      Continue
    </button>
  );
}
```

In a real application, handle loading states, errors, and duplicate submissions around the asynchronous operation.

13. Security — Validate Navigation URLs
Avoid passing untrusted URLs directly to router.push() or router.replace().
For example:

```tsx
router.push(userProvidedUrl);
```

This can be unsafe if userProvidedUrl is not validated. Dangerous URLs, such as some javascript: URLs, can create security problems.
Prefer known internal paths or validate destinations against an allowlist before navigating.

14. Which API Should I Use?

| Situation | Recommended API |
| --- | --- |
| A normal link | `<Link href="/about">About</Link>` |
| Navigate after an action succeeds | `router.push()` |
| Replace the current history entry | `router.replace()` |
| Preserve scroll during navigation | `push()` or `replace()` with `{ scroll: false }` |
| Mark a navigation with a transition type | `transitionTypes`, where supported |
| Refresh the current Server Component UI | `router.refresh()` |
| Revalidate cached server data | `revalidatePath()` / `revalidateTag()` |
| Prepare a route for later navigation | `router.prefetch()` |
| Navigate through browser history | `router.back()` / `router.forward()` |
| Read the current pathname | `usePathname()` |
| Read query parameters | `useSearchParams()` |
| Read dynamic route parameters | `useParams()` |

15. Quick Revision
- push() → navigate and add a history entry.
- replace() → navigate without adding a history entry.
- scroll: false → disable Next.js's automatic scroll behavior for that navigation.
- transitionTypes → pass transition type names; it is not an animation by itself.
- back() / forward() → follow browser history.
- refresh() → request an updated RSC render; it does not invalidate the server Data Cache.
- prefetch() → prepare a route ahead of time.
- usePathname() → read the pathname.
- useSearchParams() → read the query string.
- useParams() → read dynamic route parameters.

Official Documentation
- Next.js useRouter() — App Router
- Next.js usePathname()
- Next.js useSearchParams()
- Next.js useParams()
- React ViewTransition

Version note: Verify transitionTypes and View Transition support against the exact Next.js and React versions used in your project.