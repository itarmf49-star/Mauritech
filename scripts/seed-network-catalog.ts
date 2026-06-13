/**
 * Seed default network equipment and installation pricing.
 * Run: npx tsx scripts/seed-network-catalog.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const equipment = [
    { name: "UniFi Dream Router", manufacturer: "Ubiquiti", deviceType: "ROUTER" as const, price: 45000, coverageRadiusM: 15, maxUsers: 50 },
    { name: "UniFi U6 Lite", manufacturer: "Ubiquiti", deviceType: "ACCESS_POINT" as const, price: 28000, coverageRadiusM: 12, maxUsers: 32 },
    { name: "UniFi U6 Mesh", manufacturer: "Ubiquiti", deviceType: "MESH_NODE" as const, price: 32000, coverageRadiusM: 10, maxUsers: 24 },
    { name: "TP-Link Archer AX73", manufacturer: "TP-Link", deviceType: "ROUTER" as const, price: 22000, coverageRadiusM: 12, maxUsers: 40 },
    { name: "MikroTik hAP ax3", manufacturer: "MikroTik", deviceType: "ACCESS_POINT" as const, price: 18000, coverageRadiusM: 10, maxUsers: 24 },
  ];

  for (const item of equipment) {
    const existing = await prisma.networkEquipment.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.networkEquipment.create({ data: { ...item, isActive: true } });
    }
  }

  const pricing = [
    { name: "AP installation", unit: "ap", basePrice: 8000 },
    { name: "Router setup", unit: "router", basePrice: 12000 },
    { name: "Network outlet", unit: "outlet", basePrice: 3500 },
    { name: "Cabling per m²", unit: "sqm", basePrice: 150 },
    { name: "Technician hour", unit: "hour", basePrice: 5000 },
  ];

  for (const item of pricing) {
    const existing = await prisma.installationPricing.findFirst({ where: { name: item.name } });
    if (!existing) {
      await prisma.installationPricing.create({ data: { ...item, currency: "MRU", isActive: true } });
    }
  }

  console.log("Network catalog seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
