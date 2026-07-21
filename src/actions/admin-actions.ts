// src/actions/admin-actions.ts

export async function createProject(formData: FormData) {
  "use server"; // تأكد من وجود هذا السطر في الأعلى أو هنا
  
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;

  if (!slug) return; // ببساطة لا تفعل شيئاً إذا لم يوجد slug

  try {
    await prisma.project.create({
      data: { 
        slug, 
        category, 
        isPublished: false 
      },
    });
    revalidatePath("/[locale]/admin/projects", "page");
  } catch (e) {
    console.error("Failed to create project", e);
    // في TypeScript للـ form action، يفضل تسجيل الخطأ هنا 
    // أو استخدام useFormState للتعامل مع رسائل الخطأ في الواجهة
  }
}
