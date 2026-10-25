"use client"
import { useParams } from 'next/navigation'
import React, { Suspense } from 'react'
import tokyoImg from "@/assets/tokyo.png"
import newyorkImg from "@/assets/newyork.png"
import parisImg from "@/assets/paris.png"
import Image from 'next/image'

function CityContent() { 
    const params = useParams();
    const destination = typeof params.city === 'string' ? params.city.toLowerCase() : "";

    return (
        <div className="w-[50%] flex flex-col justify-center items-center h-screen text-white text-3xl font-bold bg-gray-900">
            <span className="capitalize mb-4">{destination}</span> is a beautiful city!
            
            {destination === "tokyo" && <Image src={tokyoImg} alt='Tokyo Image'loading='eager' />}
            {destination === "newyork" && <Image src={newyorkImg} alt='New York Image' />}
            {destination === "paris" && <Image src={parisImg} alt='Paris Image' priority />}
        </div>
    )
}

export default function CityPage() {
    return (
        <Suspense fallback={<div className="bg-gray-900 h-screen text-white flex items-center justify-center">Loading...</div>}>
            <CityContent />
        </Suspense>
    )
}