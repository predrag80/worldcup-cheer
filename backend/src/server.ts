import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
})
 
await app.register(jwt, {
  secret: 'super-secret-key',
  cookie: { cookieName: 'token', signed: false },
})

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

app.listen({ port: 4000 })
