"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- 1. إجراءات المشاريع ---

export async function createProject(formData: FormData) {
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;

  if (!slug) return { error: "Slug is required" };

  try {
    await prisma.project.create({
      data: { slug, category, isPublished: false },
    });
    revalidatePath("/[locale]/admin/projects", "page");
    return { success: true };
  } catch (e) {
    return { error: "Failed to create project" };
  }
}

export async function toggleProjectStatus(id: string, currentStatus: boolean) {
  await prisma.project.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });
  revalidatePath("/[locale]/admin/projects", "page");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/[locale]/admin/projects", "page");
}

// --- 2. إجراءات الرسائل ---

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/[locale]/admin", "page");
}

export async function markMessageAsRead(id: string) {
  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/[locale]/admin", "page");
}

// --- 3. إجراءات عامة للمستقبل (مساحة للتوسع) ---
// يمكنك إضافة أي Entity جديدة هنا (مثل Billing, Users) بنفس النمط:
// export async function deleteEntity(id: string, model: any) { ... }
