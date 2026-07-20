"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// حذف رسالة
export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/fr/admin");
}

// نشر/إلغاء نشر مشروع
export async function toggleProjectStatus(id: string, isPublished: boolean) {
  await prisma.project.update({
    where: { id },
    data: { isPublished: !isPublished },
  });
  revalidatePath("/fr/admin");
  revalidatePath("/fr/admin/projects");
}

// حذف مشروع
export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/fr/admin/projects");
}
