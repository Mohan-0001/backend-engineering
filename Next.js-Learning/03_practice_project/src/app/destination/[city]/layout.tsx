// app/destination/[city]/layout.tsx
import React from 'react'

export default function CityLayout({ children, info }: { children: React.ReactNode, info: React.ReactNode }) {
    return (
        <div className="flex flex-row min-h-screen">
            {children}
            
            {/* Parallel Route Content */}
            <div className="w-[50%] text-white text-3xl font-bold flex justify-center items-center">
                {info}
            </div>
        </div>
    )
}