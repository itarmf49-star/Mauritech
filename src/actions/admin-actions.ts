"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- دالة الحذف (تأكد من وجود export قبلها) ---
export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/[locale]/admin/projects", "page");
  } catch (error) {
    console.error("Error deleting project:", error);
  }
}

// --- دالة الإنشاء (تأكد من وجود export قبلها) ---
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
