import { NextResponse } from "next/server";

// Mock data - in production, this would come from a database
const categories = [
  { id: "all", nameFr: "Tous les produits", nameAr: "جميع المنتجات", slug: "all", order: 0, isActive: true },
  { id: "routers", nameFr: "Routeurs", nameAr: "الراوترات", slug: "routers", order: 1, isActive: true },
  { id: "access-points", nameFr: "Points d'accès", nameAr: "نقاط الوصول", slug: "access-points", order: 2, isActive: true },
  { id: "switches", nameFr: "Commutateurs", nameAr: "المبدلات", slug: "switches", order: 3, isActive: true },
  { id: "cabling", nameFr: "Câblage", nameAr: "الكابلات", slug: "cabling", order: 4, isActive: true },
  { id: "security", nameFr: "Sécurité", nameAr: "الأمن", slug: "security", order: 5, isActive: true },
];

export async function GET() {
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const body = await request.json();
  // In production, save to database
  return NextResponse.json({ success: true, category: body }, { status: 201 });
}
