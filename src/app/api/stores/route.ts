import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseUnavailableResponse } from "@/lib/api-db-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** قائمة عامة بالمتاجر النشطة — لتصفح "السوق" في الواجهة الأمامية. */
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        nameFr: true,
        nameAr: true,
        descriptionFr: true,
        descriptionAr: true,
        logoUrl: true,
        bannerUrl: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { nameFr: "asc" },
    });

    // بيانات نادرة التغيّر — التخزين المؤقت القصير يمنع إعادة الاستعلام في كل تنقّل
    // بين صفحات المتجر (كانت السلع/الفئات/المتاجر تُجلب من جديد عند كل عودة للصفحة
    // الرئيسية مثلاً، وهذا كان أحد أسباب بطء التنقل المُبلَّغ عنه).
    return NextResponse.json(
      { stores },
      { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" } },
    );
  } catch (e) {
    console.error("[api/stores GET]", e);
    return databaseUnavailableResponse();
  }
}
