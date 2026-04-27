/**
 * Forward-safe repair for Prisma migration drift on `20260425133200_portal_extensions`:
 * - Removes stuck `_prisma_migrations` rows where the migration never finished (failed apply / rolled back).
 * - Updates the checksum on the successful row to match the current `migration.sql` on disk
 *   (Prisma uses SHA-256 of the migration script bytes).
 *
 * Run against each environment that reports "migration was modified after it was applied":
 *   node scripts/repair-portal-extensions-migration-metadata.mjs
 *
 * Requires DIRECT_DATABASE_URL or DATABASE_URL (direct Postgres, not Accelerate).
 */
import fs from "node:fs";
import crypto from "node:crypto";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const MIGRATION_NAME = "20260425133200_portal_extensions";
const MIGRATION_FILE = new URL(
  "../prisma/migrations/20260425133200_portal_extensions/migration.sql",
  import.meta.url,
);

const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
if (!url.startsWith("postgres")) {
  console.error("Set DIRECT_DATABASE_URL or DATABASE_URL to a direct postgres:// URL.");
  process.exit(1);
}

const sql = fs.readFileSync(MIGRATION_FILE);
const checksum = crypto.createHash("sha256").update(sql).digest("hex");

console.log(`Computed checksum for ${MIGRATION_FILE.pathname}: ${checksum}`);

const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  await client.query("BEGIN");

  const del = await client.query(
    `DELETE FROM "_prisma_migrations"
     WHERE migration_name = $1 AND finished_at IS NULL`,
    [MIGRATION_NAME],
  );
  console.log(`Removed unfinished migration rows: ${del.rowCount ?? 0}`);

  const upd = await client.query(
    `UPDATE "_prisma_migrations"
     SET checksum = $1
     WHERE migration_name = $2 AND finished_at IS NOT NULL`,
    [checksum, MIGRATION_NAME],
  );
  console.log(`Updated checksum on finished migration rows: ${upd.rowCount ?? 0}`);

  await client.query("COMMIT");
  console.log("Repair committed successfully.");
} catch (e) {
  await client.query("ROLLBACK");
  console.error(e);
  process.exit(1);
} finally {
  await client.end();
}
