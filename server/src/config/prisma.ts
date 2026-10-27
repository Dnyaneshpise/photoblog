import { PrismaClient } from '@prisma/client'

/**
 * Single shared Prisma client instance.
 * Why: Creating many clients wastes connections; one instance is the recommended pattern.
 * What: Instantiates PrismaClient and reuses it across the whole server.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
