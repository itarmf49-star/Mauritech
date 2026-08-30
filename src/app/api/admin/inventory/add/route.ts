import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const item = await prisma.networkEquipment.create({
      data: {
        nameFr: body.nameFr,
        nameAr: body.nameAr,
        manufacturer: body.manufacturer,
        deviceType: body.deviceType,
        model: body.model,
        priceMRU: body.priceMRU,
        priceUSD: body.priceUSD,
        stockQuantity: body.stockQuantity,
        stockStatus: body.stockStatus,
        isFeatured: body.isFeatured,
        imageUrl: body.imageUrl,
        discountPercent: body.discountPercent,
        isOnSale: body.isOnSale,
        saleEndDate: body.saleEndDate,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item" },
      { status: 500 }
    );
  }
}
