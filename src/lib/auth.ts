import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { Role } from "@/types/role";
import { prisma } from "@/lib/prisma";

const DEMO_ADMIN_EMAIL = "mauritech@mauritech.tech";
const DEMO_ADMIN_PASSWORD = "MauriTech@2026";

function isDemoAdminLoginAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.DEMO_ADMIN_LOGIN === "true";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        if (isDemoAdminLoginAllowed() && email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
          return {
            id: "demo-admin",
            email: DEMO_ADMIN_EMAIL,
            name: "MauriTech Admin",
            role: "ADMIN" as Role,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            password: true,
          },
        });
        if (!user?.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id as string,
          email: (user.email as string) ?? undefined,
          name: (user.name as string) ?? undefined,
          image: (user.image as string) ?? undefined,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user.role as Role) ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role) ?? "CUSTOMER";
        if (token.sub) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
};
