import { NextResponse } from "next/server";

const flashDeals = [
  {
    id: "1",
    nameFr: "Huawei AX3 Pro Wi-Fi 6",
    nameAr: "هواوي AX3 Pro Wi-Fi 6",
    originalPrice: 45000,
    discountPrice: 31500,
    discountPercent: 30,
    imageUrl: "",
    endTime: "23:59:59",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    nameFr: "Ubiquiti UniFi AP LR",
    nameAr: "أوبيكيتي UniFi AP LR",
    originalPrice: 32000,
    discountPrice: 22400,
    discountPercent: 30,
    imageUrl: "",
    endTime: "23:59:59",
    order: 2,
    isActive: true,
  },
  {
    id: "3",
    nameFr: "TP-Link Omada Mesh",
    nameAr: "تي-لينك Omada Mesh",
    originalPrice: 18000,
    discountPrice: 12600,
    discountPercent: 30,
    imageUrl: "",
    endTime: "23:59:59",
    order: 3,
    isActive: true,
  },
];

export async function GET() {
  return NextResponse.json({ deals: flashDeals });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, deal: body }, { status: 201 });
}
