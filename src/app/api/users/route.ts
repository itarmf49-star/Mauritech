import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

type RoleInput = "ADMIN" | "EDITOR" | "CUSTOMER";
function isRoleInput(value: unknown): value is RoleInput {
  return value === "ADMIN" || value === "EDITOR" || value === "CUSTOMER";
}

type CreateUserBody = {
  email?: unknown;
  name?: unknown;
  role?: unknown;
};

export async function GET() {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(users);
  } catch (e) {
    console.error("[api/users GET]", e);
    return databaseUnavailableResponse();
  }
}

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { email, name, role } = (body ?? {}) as CreateUserBody;

  if (!isNonEmptyString(email)) {
    return new Response("Email is required", { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: isNonEmptyString(name) ? name.trim() : undefined,
        // create with empty password by default; admin should require password reset
        password: "",
        ...(isRoleInput(role) ? { role } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Ensure a ClientAccount exists for the new user
    try {
      await prisma.clientAccount.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id, company: null },
      });
    } catch {}

    return Response.json(user, { status: 201 });
  } catch (e) {
    console.error("[api/users POST]", e);
    return databaseUnavailableResponse();
  }
}
