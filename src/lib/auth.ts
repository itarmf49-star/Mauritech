import bcrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Role } from "@/types/role";
import { prisma } from "@/lib/prisma";

const DEMO_ADMIN_EMAIL = "mauritech@mauritech.tech";
const DEMO_ADMIN_PASSWORD = "MauriTech@2026";

export function getNextAuthSecret() {
  return process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? process.env.NEXTAUTH_AUTH_SECRET ?? "dev-secret-change-me";
}

export function getNextAuthUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function isDemoAdminLoginAllowed() {
  return process.env.NODE_ENV !== "production" || process.env.DEMO_ADMIN_LOGIN === "true";
}

export const authOptions: NextAuthOptions = {
  secret: getNextAuthSecret(),
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

        console.log("AUTH: authorize email", email, "password provided", password ? "***" : "<empty>");

        if (!email || !password) {
          console.log("AUTH: authorize failed - missing email or password");
          return null;
        }

        // Demo Admin (اختياري للتجربة)
        if (
          isDemoAdminLoginAllowed() &&
          email === DEMO_ADMIN_EMAIL &&
          password === DEMO_ADMIN_PASSWORD
        ) {
          console.log("AUTH: demo admin login allowed");
          return {
            id: "demo-admin",
            email: DEMO_ADMIN_EMAIL,
            name: "MauriTech Admin",
            role: "ADMIN" as Role,
          };
        }

        // البحث عن المستخدم في جدول users الخاص بالمشروع عبر SQL الخام
        const rows = await prisma.$queryRawUnsafe<Array<{
          id: number;
          email: string | null;
          name: string | null;
          role: string | null;
          password: string;
        }>>(
          'SELECT id, email, name, role, password FROM users WHERE lower(email) = lower($1) LIMIT 1',
          email,
        );
        const user = rows[0] ?? null;

        console.log("AUTH: user found", !!user);

        if (!user) {
          console.log("AUTH: authorize failed - no user");
          return null;
        }

        const bcryptMatch = await bcrypt.compare(password, user.password).catch(() => false);
        const normalizedPassword = password.trim();
        const normalizedStoredPassword = user.password?.trim() ?? "";
        const plainTextMatch = normalizedPassword === normalizedStoredPassword || normalizedPassword.toLowerCase() === normalizedStoredPassword.toLowerCase();
        const passwordMatches = bcryptMatch || plainTextMatch;
        console.log("AUTH: password match", passwordMatches);

        if (!passwordMatches) {
          console.log("AUTH: authorize failed - bad password");
          return null;
        }

        const rawRole = typeof user.role === "string" ? user.role.toUpperCase() : "CUSTOMER";
        const normalizedRole = rawRole === "ADMIN" || rawRole === "EDITOR" || rawRole === "CUSTOMER" ? (rawRole as Role) : "CUSTOMER";
        console.log("AUTH: normalized role", rawRole, normalizedRole);

        const result = {
          id: String(user.id),
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role: normalizedRole,
        };

        console.log("AUTH: authorize success role", result.role);
        return result;
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

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
};
