import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!(url.startsWith("prisma://") || url.startsWith("prisma+postgres://"))) {
    throw new Error(
      "DATABASE_URL must be a Prisma Accelerate URL starting with `prisma://` or `prisma+postgres://`. " +
        "Use DIRECT_DATABASE_URL for migrations/studio via prisma.config.ts.",
    );
  }

  return new PrismaClient({
    accelerateUrl: url,
  }).$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
