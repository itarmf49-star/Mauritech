import { NextResponse } from "next/server";

// Mock data - in production, this would come from a database
const banners = [
  {
    id: "1",
    titleFr: "Offre Spéciale - Wi-Fi 6",
    titleAr: "عرض خاص - Wi-Fi 6",
    subtitleFr: "Jusqu'à -20% sur les routeurs Wi-Fi 6",
    subtitleAr: "خصم يصل إلى 20% على راوترات Wi-Fi 6",
    imageUrl: "",
    link: "/shop",
    order: 1,
    isActive: true,
  },
];

export async function GET() {
  return NextResponse.json({ banners });
}

export async function POST(request: Request) {
  const body = await request.json();
  // In production, save to database
  return NextResponse.json({ success: true, banner: body }, { status: 201 });
}
