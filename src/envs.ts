import dotenv from 'dotenv'
dotenv.config()

export interface IEnvs {
  NODE_ENV: string

  PORT: number
  ACCESS_TOKEN_SECRET: string
  ENCRYPT_PASSWORD: string

  URI_MONGODB: string
}

export const envs = (): IEnvs => ({
  NODE_ENV: process.env.NODE_ENV || '',

  PORT: process.env.PORT ? +process.env.PORT : 4000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
  ENCRYPT_PASSWORD: process.env.ENCRYPT_PASSWORD || '',

  URI_MONGODB: process.env.URI_MONGODB || '',
})
