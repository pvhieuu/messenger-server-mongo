import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import { ICradle } from './container'
import { sockets } from './sockets'
import { connect } from 'mongoose'

export const initMongoDB = ({ envs }: ICradle) => {
  connect(envs.URI_MONGODB)
  console.log('🚀🚀🚀 MongoDB connected 🚀🚀🚀')
}

export const setup = async ({ initMongoDB }: ICradle) => {
  await initMongoDB
}

export const startServer = ({ envs, routers }: ICradle) => {
  const app = express()
  const server = createServer(app)
  const port = envs.PORT

  server.listen(port, () =>
    console.log(`--- Server is running on port ${port} ---`),
  )

  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(express.json({ limit: '10mb' }))
  app.use(cors())
  app.use(helmet())
  app.use(compression())

  app.use(routers)

  sockets(server)
}
