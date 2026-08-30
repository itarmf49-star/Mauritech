import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminEmail = "admin@mauritech.tech";
  const adminPassword = await bcrypt.hash("admin123", 12);

  try {
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminPassword,
        role: "ADMIN",
        name: "Admin User",
      },
      create: {
        email: adminEmail,
        password: adminPassword,
        role: "ADMIN",
        name: "Admin User",
      },
    });

    console.log("✅ Admin user created/updated:", admin.email);

    // Create demo user
    const demoEmail = "demo@mauritech.tech";
    const demoPassword = await bcrypt.hash("demo123", 12);

    const demo = await prisma.user.upsert({
      where: { email: demoEmail },
      update: {
        password: demoPassword,
        role: "CUSTOMER",
        name: "Demo User",
      },
      create: {
        email: demoEmail,
        password: demoPassword,
        role: "CUSTOMER",
        name: "Demo User",
      },
    });

    console.log("✅ Demo user created/updated:", demo.email);

    // Create client account for demo user
    await prisma.clientAccount.upsert({
      where: { userId: (await prisma.user.findUnique({ where: { email: demoEmail } }))!.id },
      update: {},
      create: { userId: (await prisma.user.findUnique({ where: { email: demoEmail } }))!.id },
    });

    console.log("✅ Client account created for demo user");

    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });