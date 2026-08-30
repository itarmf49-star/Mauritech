import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const item = await prisma.networkEquipment.update({
      where: { id },
      data: {
        nameFr: updateData.nameFr,
        nameAr: updateData.nameAr,
        manufacturer: updateData.manufacturer,
        deviceType: updateData.deviceType,
        model: updateData.model,
        priceMRU: updateData.priceMRU,
        priceUSD: updateData.priceUSD,
        stockQuantity: updateData.stockQuantity,
        stockStatus: updateData.stockStatus,
        isFeatured: updateData.isFeatured,
        imageUrl: updateData.imageUrl,
        discountPercent: updateData.discountPercent,
        isOnSale: updateData.isOnSale,
        saleEndDate: updateData.saleEndDate,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update item" },
      { status: 500 }
    );
  }
}
