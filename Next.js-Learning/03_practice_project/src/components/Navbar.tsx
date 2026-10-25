"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() :  Readonly<React.ReactNode> {
  const pathname = usePathname();
  return (
    <div className='w-full h-[80px] bg-white flex justify-between items-center px-[25px]'>
      <div className='text-black font-bold text-2xl'>
          🌎 Travel Guide
      </div>
      <div >
        <ul className='flex justify-center items-center gap-[15px]'>
        <Link href={"/"} className={pathname == "/"? "text-blue-500": ""}><li>Home</li></Link>
        <Link href={"/destination"} className={pathname == "/destination"? "text-blue-500": ""}><li>Destination</li></Link>
        <Link href={"/contact"} className={pathname == "/contact"? "text-blue-500": ""}><li>Contact Us</li></Link>
        </ul>
      </div>
    </div>
  )
}