'use client'

import { useState } from 'react'
import { api } from '@/lib/api'

export default function CreateLeague() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    try {
      const res = await api.post('/leagues', {
        name,
        ownerEmail: email,
      })
      setResult(res.data)
    } catch (err: any) {
      setError('Failed to create league')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Create League ⚽</h1>

      <input
        className="border p-2 rounded w-64"
        placeholder="League name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 rounded w-64"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create League
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="mt-4 p-4 border rounded">
          <p><b>League created!</b></p>
          <p>ID: {result.leagueId}</p>
          <p>Name: {result.name}</p>
        </div>
      )} 
    </main>
  )
}
