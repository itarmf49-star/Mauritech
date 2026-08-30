-- Migration: Add discount fields to NetworkEquipment
-- This migration adds discountPercent, isOnSale, and converts saleEndDate to DateTime

-- Add discountPercent column with default 0
ALTER TABLE "NetworkEquipment" ADD COLUMN "discountPercent" INTEGER NOT NULL DEFAULT 0;

-- Add isOnSale column with default false
ALTER TABLE "NetworkEquipment" ADD COLUMN "isOnSale" BOOLEAN NOT NULL DEFAULT false;

-- Convert saleEndDate from TEXT to TIMESTAMP (drop and recreate)
-- Note: This will lose existing saleEndDate data
ALTER TABLE "NetworkEquipment" DROP COLUMN IF EXISTS "saleEndDate";
ALTER TABLE "NetworkEquipment" ADD COLUMN "saleEndDate" TIMESTAMP;

-- Update discountPercent for existing records (set to 0)
UPDATE "NetworkEquipment" SET "discountPercent" = 0 WHERE "discountPercent" IS NULL;

-- Update isOnSale for existing records (set to false)
UPDATE "NetworkEquipment" SET "isOnSale" = false WHERE "isOnSale" IS NULL;