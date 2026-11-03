"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session?.user);

  // Session loading state
  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-indigo-500" />
          <p className="text-sm text-gray-400">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  // Unauthenticated state
  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="rounded-xl bg-gray-800 p-8 text-center shadow-lg">
          <h1 className="mb-3 text-2xl font-bold">Welcome!</h1>
          <p className="text-gray-400">
            Please sign in to access your dashboard.
          </p>
        </div>
      </main>
    );
  }

  const { name, email, image } = session.user;

  // Authenticated dashboard
  return (
    <main className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-lg bg-gray-800 p-6 shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md bg-red-600 px-4 py-2 transition hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="User Profile"
            width={100}
            height={100}
            className="rounded-full border-2 border-indigo-500 object-cover"
            unoptimized
          />

          <h2 className="text-xl font-semibold">
            {name || "User"}
          </h2>

          <p className="text-gray-400">
            {email || "No email available"}
          </p>
        </div>
      </div>
    </main>
  );
}