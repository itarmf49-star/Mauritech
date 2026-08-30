import { NextResponse } from "next/server";

const categoryShowcases = [
  { id: "1", nameFr: "High-Tech", nameAr: "هاي تك", slug: "high-tech", imageUrl: "", order: 1, isActive: true },
  { id: "2", nameFr: "Maison", nameAr: "المنزل", slug: "maison", imageUrl: "", order: 2, isActive: true },
  { id: "3", nameFr: "Jardin", nameAr: "الحديقة", slug: "jardin", imageUrl: "", order: 3, isActive: true },
  { id: "4", nameFr: "Réseau", nameAr: "الشبكات", slug: "reseau", imageUrl: "", order: 4, isActive: true },
  { id: "5", nameFr: "Sécurité", nameAr: "الأمن", slug: "securite", imageUrl: "", order: 5, isActive: true },
  { id: "6", nameFr: "Smart Home", nameAr: "المنزل الذكي", slug: "smart-home", imageUrl: "", order: 6, isActive: true },
];

export async function GET() {
  return NextResponse.json({ showcases: categoryShowcases });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, showcase: body }, { status: 201 });
}
