"use client"
import { useRouter } from 'next/navigation';
import React from 'react'

export default function Page() {
    const destination = ['Paris', 'Tokyo', 'NewYork'];
    const router = useRouter();
    
  return (
    <div className='flex flex-col justify-center items-center text-white h-screen gap-4'>
      <div className='text-xl font-semibold'>
        Choose Your Destination
      </div>
      <div className='flex flex-col gap-2'>
        {destination.map((d, index) => (
            <div 
              key={index} 
              className='font-bold text-2xl flex items-center justify-center rounded-2xl bg-white text-black px-6 py-3 cursor-pointer transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-105 shadow-md'
              onClick={() => router.push(`/destination/${d}`)}
            >
                {d}
            </div>
        ))}
      </div>
    </div>
  )
}