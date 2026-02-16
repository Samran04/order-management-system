// ============================================
// PRISMA CLIENT SINGLETON
// ============================================
// This file creates a single instance of Prisma Client
// to prevent multiple instances in development (hot reload)

import { PrismaClient } from '@prisma/client';

/**
 * Global type declaration for Prisma Client
 * This prevents TypeScript errors when accessing global.prisma
 */
declare global {
    var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client Singleton
 * 
 * In development, Next.js hot reloads can create multiple instances
 * of Prisma Client, which can exhaust database connections.
 * 
 * This pattern ensures we reuse the same instance across hot reloads.
 */
export const prisma = globalThis.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * In development, store the Prisma Client in the global object
 * so it persists across hot reloads
 */
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

/**
 * Example usage in API routes:
 * 
 * import { prisma } from '@/lib/prisma';
 * 
 * const users = await prisma.user.findMany();
 * const order = await prisma.order.create({ data: {...} });
 */
