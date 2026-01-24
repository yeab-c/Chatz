import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

export const connectPostgreSQL = async () => {
  try {
    await prisma.$connect()
    console.log('PostgreSQL connected successfully')
  } catch (error) {
    console.error('PostgreSQL connection error:', error)
    process.exit(1)
  }
}

export const disconnectPostgreSQL = async () => {
  await prisma.$disconnect()
}

export default prisma