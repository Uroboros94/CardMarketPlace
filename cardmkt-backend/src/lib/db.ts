import { PrismaClient } from '@prisma/client'
 
const prisma = new PrismaClient({
  log: process.env.NODE_ENV !== 'production' ? ['query', 'warn', 'error'] : ['error'],
})
 
export const db prisma
