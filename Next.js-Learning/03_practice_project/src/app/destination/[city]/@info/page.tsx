"use client"
import { useParams } from 'next/navigation'
import React, { Suspense } from 'react'

function InfoContent() {
  const param = useParams()
  const city = param.city;
  return (
    <div>
      {city} is the most beautiful city
    </div>
  )
}

export default function InfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoContent/>
    </Suspense>
  )
}