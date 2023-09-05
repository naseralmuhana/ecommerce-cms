import { PrismaClient } from "@prisma/client"

// Declare a variable 'prisma' in the global scope
declare global {
  var prisma: PrismaClient | undefined
}

// Initialize 'prisma' using the existing global instance or create a new one
const prismadb = globalThis.prisma || new PrismaClient()

// If the application is not in production, set the global 'prisma' variable
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

export default prismadb
