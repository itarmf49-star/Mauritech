import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const items = await prisma.networkEquipment.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      items: items.map(item => ({
        id: item.id,
        nameFr: item.nameFr || "",
        nameAr: item.nameAr || "",
        manufacturer: item.manufacturer || "",
        deviceType: item.deviceType || "ROUTER",
        model: item.model || "",
        priceMRU: item.priceMRU || 0,
        priceUSD: item.priceUSD || 0,
        stockQuantity: item.stockQuantity || 0,
        stockStatus: item.stockStatus || "AVAILABLE",
        isFeatured: item.isFeatured || false,
        imageUrl: item.imageUrl || "",
        discountPercent: item.discountPercent || 0,
        isOnSale: item.isOnSale || false,
        saleEndDate: item.saleEndDate || "",
      })),
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

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
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
