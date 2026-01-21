// src/plugins/db.ts
import fp from 'fastify-plugin'
import { pool } from '../db/index.js'

export default fp(async (app) => {
  app.decorate('db', pool)

  app.addHook('onClose', async () => {
    await pool.end()
  })
})
