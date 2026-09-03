import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { databaseUnavailableResponse } from "@/lib/api-db-response";
import { getStaffSession } from "@/lib/staff-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

export async function POST(req: Request) {
  const staff = await getStaffSession();
  if (!staff.ok) return staff.response;

  try {
    const form = await req.formData().catch(() => null);
    if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Only image or video uploads are allowed" }, { status: 400 });
    }
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `File too large (max ${Math.round(maxBytes / (1024 * 1024))}MB)` }, { status: 413 });
    }

    const safeName = (file.name || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);

    const rawFolder = String(form.get("folder") || "misc");
    const folder = /^[a-z0-9-]{1,40}$/.test(rawFolder) ? rawFolder : "misc";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    // نُخزّن التخزين السحابي (Vercel Blob) فقط إن كان مضبوطاً فعلياً — وإلا نرفع
    // الملف محلياً إلى public/uploads، وهذا هو المسار الافتراضي في التطوير المحلي
    // ويتجنّب رسالة "Blob storage is not configured" التي كانت تمنع رفع أي صورة.
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    if (blobToken) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${folder}/${filename}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
        token: blobToken,
      });
      return NextResponse.json({ url: blob.url });
    }

    const uploadsRoot = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadsRoot, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsRoot, filename), bytes);

    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } catch (e) {
    console.error("[api/upload POST]", e);
    return databaseUnavailableResponse();
  }
}
