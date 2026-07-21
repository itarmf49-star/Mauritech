"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

// --- دالة حذف مشروع ---
export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/[locale]/admin/projects", "page");
  } catch (error) {
    console.error("Error deleting project:", error);
  }
}

// --- دالة إنشاء مشروع ---
export async function createProject(formData: FormData) {
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;

  if (!slug) return;

  try {
    await prisma.project.create({
      data: { slug, category, isPublished: false },
    });
    revalidatePath("/[locale]/admin/projects", "page");
  } catch (e) {
    console.error("Failed to create project", e);
  }
}

// --- دالة رفع الصور (MauriStudio) ---
// ملاحظة لمستخدمي Vercel: بما أن نظام ملفات Vercel للقراءة فقط،
// هذا الحل يعمل محلياً. للإنتاج (Production) يفضل ربط Cloudinary 
// أو خدمة تخزين سحابية لتخزين الرابط في قاعدة البيانات.
export async function uploadImageAction(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) return;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // حفظ الصورة في مجلد public/images
  const filename = file.name.replaceAll(" ", "_");
  const filePath = path.join(process.cwd(), "public/images", filename);
  
  await writeFile(filePath, buffer);

  // تحديث قاعدة البيانات برابط الصورة
  await prisma.globalSettings.update({
    where: { id: "singleton" },
    data: { bannerImage: `/images/${filename}` }
  });
  
  revalidatePath("/[locale]/admin");
}
