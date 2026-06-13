-- Network infrastructure repositioning schema

CREATE TYPE "EquipmentType" AS ENUM ('ROUTER', 'ACCESS_POINT', 'MESH_NODE');
CREATE TYPE "RequestType" AS ENUM ('SITE_SURVEY', 'INSTALLATION', 'CONSULTATION');
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'CONTACTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "rooms" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "wallType" TEXT;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "desiredSpeedMbps" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "deviceCount" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "recommendedOutlets" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "floorPlanJson" JSONB;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "recommendationsJson" JSONB;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "equipmentCost" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "installCost" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "totalCost" INTEGER;
ALTER TABLE "CoveragePlan" ADD COLUMN IF NOT EXISTS "coverageQuality" TEXT;

CREATE TABLE IF NOT EXISTS "NetworkEquipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "deviceType" "EquipmentType" NOT NULL,
    "price" INTEGER NOT NULL,
    "coverageRadiusM" DOUBLE PRECISION NOT NULL,
    "maxUsers" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "specs" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "NetworkEquipment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "NetworkEquipment_isActive_idx" ON "NetworkEquipment"("isActive");
CREATE INDEX IF NOT EXISTS "NetworkEquipment_deviceType_idx" ON "NetworkEquipment"("deviceType");

CREATE TABLE IF NOT EXISTS "InstallationPricing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MRU',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InstallationPricing_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "InstallationPricing_isActive_idx" ON "InstallationPricing"("isActive");
CREATE INDEX IF NOT EXISTS "InstallationPricing_unit_idx" ON "InstallationPricing"("unit");

CREATE TABLE IF NOT EXISTS "ServiceRequest" (
    "id" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "estimateId" TEXT,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ServiceRequest_type_idx" ON "ServiceRequest"("type");
CREATE INDEX IF NOT EXISTS "ServiceRequest_status_idx" ON "ServiceRequest"("status");
CREATE INDEX IF NOT EXISTS "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");
