import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import dbPlugin from './plugins/db.js'
import 'dotenv/config'

declare module 'fastify' {
  interface FastifyInstance {
    db: any
  }
}

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
})

await app.register(jwt, {
  secret: 'super-secret-key',
  cookie: { cookieName: 'token', signed: false },
})

// 🔴 Register DB plugin HERE
await app.register(dbPlugin)
 
app.get('/', async () => {
  return {
    name: 'World Cup Cheer API',
    status: 'running',
    version: '1.0.0'
  }
})

app.get('/health', async () => {
  return { status: 'ok' }
})

// 🧪 DB test endpoint
app.get('/db-test', async () => {
  const result = await app.db.query('SELECT 1 as ok')
  return result.rows[0]
})


app.post('/leagues', async (req, reply) => {
  const { name, ownerEmail } = req.body as {
    name: string
    ownerEmail: string
  }

  if (!name || !ownerEmail) {
    reply.code(400)
    return { error: 'name and ownerEmail are required' }
  }

  // 1. Create or get user
  const userResult = await app.db.query(
    `
    INSERT INTO users (email)
    VALUES ($1)
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id
    `,
    [ownerEmail]
  )

  const userId = userResult.rows[0].id

  // 2. Create league
  const leagueResult = await app.db.query(
    `
    INSERT INTO leagues (name, owner_id)
    VALUES ($1, $2)
    RETURNING id, name
    `,
    [name, userId]
  )

  const league = leagueResult.rows[0]

  // 3. Add owner as member
  await app.db.query(
    `
    INSERT INTO league_members (user_id, league_id)
    VALUES ($1, $2)
    `,
    [userId, league.id]
  )

  return {
    leagueId: league.id,
    name: league.name,
  }
})


await app.listen({ port: 5000, host: 'localhost' })
app.log.info('Server listening on http://localhost:5000')
