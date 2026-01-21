'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [status, setStatus] = useState<string>('Loading...')

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((res) => setStatus(res.data.status))
      .catch(() => setStatus('Backend not reachable'))
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">World Cup Cheer ⚽</h1>
      <p className="mt-4">Backend status: <b>{status}</b></p>
    </main>
  )
}
