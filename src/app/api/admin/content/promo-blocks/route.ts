import { NextResponse } from "next/server";

const promoBlocks = [
  {
    id: "1",
    titleFr: "Installation Gratuite",
    titleAr: "تركيب مجاني",
    descriptionFr: "Pour tout achat supérieur à 100,000 MRU",
    descriptionAr: "لجميع المشتريات التي تزيد عن 100,000 أ.م.م",
    imageUrl: "",
    link: "/shop",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    titleFr: "Garantie 2 Ans",
    titleAr: "ضمان لعامين",
    descriptionFr: "Sur tous les équipements réseau",
    descriptionAr: "على جميع معدات الشبكات",
    imageUrl: "",
    link: "/shop",
    order: 2,
    isActive: true,
  },
];

export async function GET() {
  return NextResponse.json({ blocks: promoBlocks });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, block: body }, { status: 201 });
}
