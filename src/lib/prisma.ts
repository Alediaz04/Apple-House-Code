import { PrismaClient } from "@prisma/client";

// Guardamos la instancia en el objeto global para reutilizarla
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Solo en desarrollo: reusar la misma instancia entre recargas (hot reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;