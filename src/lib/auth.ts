import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Role } from "@/types/role";
import { prisma } from "@/lib/prisma";

const DEMO_ADMIN_EMAIL = "mauritech@mauritech.tech";
const DEMO_ADMIN_PASSWORD = "MauriTech@2026";

function isDemoAdminLoginAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.DEMO_ADMIN_LOGIN === "true";
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";

        if (!email || !password) {
          return null;
        }

        // Demo Admin (اختياري للتجربة)
        if (
          isDemoAdminLoginAllowed() &&
          email === DEMO_ADMIN_EMAIL &&
          password === DEMO_ADMIN_PASSWORD
        ) {
          return {
            id: "demo-admin",
            email: DEMO_ADMIN_EMAIL,
            name: "MauriTech Admin",
            role: "ADMIN" as Role,
          };
        }

        // البحث عن المستخدم في Neon عبر Prisma
        const user = await prisma.user.findUnique({
          where: {
            email,
          },

          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            password: true,
          },
        });

        if (!user) {
          return null;
        }

        // مقارنة كلمة السر مباشرة بدون تشفير
        if (password !== user.password) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: (user.role as Role) ?? "CUSTOMER",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "CUSTOMER";
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }

      return session;
    },
  },
};;
