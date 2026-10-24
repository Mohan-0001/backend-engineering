"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()

  return (
    <div>
      <ul>
        <Link href={"/"}> <li>Home</li></Link>
        <Link href={"/about"}><li>About</li></Link>
        <Link href={"/contact"}><li>Contact</li></Link>
      </ul>

      <button onClick={() => router.push("https://google.com")}>
        go to Google
      </button>
    </div>
  );
}
