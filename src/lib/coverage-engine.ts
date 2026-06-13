import type {
  ApPlacement,
  CoverageInput,
  CoverageResult,
  EquipmentRecord,
  FloorPlan,
  PricingRecord,
  RoomRect,
  WallType,
} from "@/lib/coverage-types";

const DEFAULT_EQUIPMENT: EquipmentRecord[] = [
  { id: "default-router", name: "UniFi Dream Router", manufacturer: "Ubiquiti", deviceType: "ROUTER", price: 45000, coverageRadiusM: 15, maxUsers: 50 },
  { id: "default-ap", name: "UniFi U6 Lite", manufacturer: "Ubiquiti", deviceType: "ACCESS_POINT", price: 28000, coverageRadiusM: 12, maxUsers: 32 },
  { id: "default-mesh", name: "UniFi U6 Mesh", manufacturer: "Ubiquiti", deviceType: "MESH_NODE", price: 32000, coverageRadiusM: 10, maxUsers: 24 },
];

const DEFAULT_PRICING: PricingRecord[] = [
  { unit: "ap", basePrice: 8000 },
  { unit: "router", basePrice: 12000 },
  { unit: "outlet", basePrice: 3500 },
  { unit: "sqm", basePrice: 150 },
  { unit: "hour", basePrice: 5000 },
];

function wallLossDb(wallType: WallType) {
  return wallType === "reinforced_concrete" ? 12 : 6;
}

function coverageQualityScore(apCount: number, rooms: number, deviceCount: number, maxUsersPerAp: number) {
  const capacity = apCount * maxUsersPerAp;
  const density = deviceCount / Math.max(rooms, 1);
  if (capacity >= deviceCount * 1.5 && density <= 8) return "excellent" as const;
  if (capacity >= deviceCount) return "good" as const;
  return "fair" as const;
}

function generateRooms(areaSqm: number, rooms: number, floorIndex: number): RoomRect[] {
  const areaPerFloor = areaSqm / Math.max(1, Math.ceil(areaSqm / 200));
  const floorArea = areaSqm / Math.max(1, Math.ceil(areaSqm / (areaPerFloor || areaSqm)));
  const cols = Math.ceil(Math.sqrt(rooms));
  const rows = Math.ceil(rooms / cols);
  const planW = 400;
  const planH = 300;
  const cellW = planW / cols;
  const cellH = planH / rows;
  const padding = 6;

  const result: RoomRect[] = [];
  for (let i = 0; i < rooms; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    result.push({
      id: `f${floorIndex}-r${i + 1}`,
      x: col * cellW + padding,
      y: row * cellH + padding,
      width: cellW - padding * 2,
      height: cellH - padding * 2,
      label: `R${i + 1}`,
    });
  }
  return result;
}

function placeAps(rooms: RoomRect[], apCount: number, floor: number, equipment: EquipmentRecord[]): ApPlacement[] {
  const apEquip = equipment.find((e) => e.deviceType === "ACCESS_POINT") ?? equipment[0];
  const radiusPx = Math.min(80, apEquip.coverageRadiusM * 4);
  const placements: ApPlacement[] = [];

  if (apCount <= 0 || rooms.length === 0) return placements;

  const step = Math.max(1, Math.floor(rooms.length / apCount));
  for (let i = 0; i < apCount; i++) {
    const room = rooms[Math.min(i * step, rooms.length - 1)];
    placements.push({
      id: `ap-f${floor}-${i + 1}`,
      floor,
      x: room.x + room.width / 2,
      y: room.y + room.height / 2,
      radius: radiusPx,
      equipmentId: apEquip.id,
      equipmentName: apEquip.name,
    });
  }
  return placements;
}

function estimateApCount(input: CoverageInput, wallLoss: number, equip: EquipmentRecord[]) {
  const apEquip = equip.find((e) => e.deviceType === "ACCESS_POINT") ?? equip[0];
  const effectiveArea = input.areaSqm * Math.sqrt(input.floors);
  const apCoverageSqm = Math.PI * apEquip.coverageRadiusM * apEquip.coverageRadiusM * 0.6;
  const base = Math.ceil(effectiveArea / Math.max(apCoverageSqm, 40));
  const lossPenalty = Math.max(0, Math.round((wallLoss - 6) / 3));
  const devicePenalty = Math.max(0, Math.ceil(input.deviceCount / apEquip.maxUsers) - 1);
  return Math.min(64, Math.max(1, base + lossPenalty + devicePenalty));
}

function priceForUnit(pricing: PricingRecord[], unit: string) {
  return pricing.find((p) => p.unit === unit)?.basePrice ?? 0;
}

export function computeCoverageEstimate(
  input: CoverageInput,
  equipment: EquipmentRecord[] = DEFAULT_EQUIPMENT,
  pricing: PricingRecord[] = DEFAULT_PRICING,
): CoverageResult {
  const activeEquipment = equipment.length > 0 ? equipment : DEFAULT_EQUIPMENT;
  const wallLoss = wallLossDb(input.wallType);
  const apCount = estimateApCount(input, wallLoss, activeEquipment);
  const switches = Math.max(1, Math.ceil(apCount / 24));
  const outlets = input.rooms + input.floors;

  const router = activeEquipment.find((e) => e.deviceType === "ROUTER") ?? activeEquipment[0];
  const ap = activeEquipment.find((e) => e.deviceType === "ACCESS_POINT") ?? activeEquipment[0];

  const apsPerFloor = Math.ceil(apCount / input.floors);
  const floorPlans: FloorPlan[] = [];

  for (let f = 0; f < input.floors; f++) {
    const roomsOnFloor = Math.ceil(input.rooms / input.floors);
    const rooms = generateRooms(input.areaSqm / input.floors, roomsOnFloor, f + 1);
    const aps = placeAps(rooms, f === input.floors - 1 ? apCount - apsPerFloor * (input.floors - 1) : apsPerFloor, f + 1, activeEquipment);
    floorPlans.push({ width: 400, height: 300, rooms, aps });
  }

  const equipmentLines = [
    {
      equipmentId: router.id,
      name: router.name,
      manufacturer: router.manufacturer,
      deviceType: router.deviceType,
      quantity: 1,
      unitPrice: router.price,
      totalPrice: router.price,
      coverageRadiusM: router.coverageRadiusM,
      maxUsers: router.maxUsers,
    },
    {
      equipmentId: ap.id,
      name: ap.name,
      manufacturer: ap.manufacturer,
      deviceType: ap.deviceType,
      quantity: apCount,
      unitPrice: ap.price,
      totalPrice: ap.price * apCount,
      coverageRadiusM: ap.coverageRadiusM,
      maxUsers: ap.maxUsers,
    },
  ];

  const equipmentCost = equipmentLines.reduce((sum, line) => sum + line.totalPrice, 0);
  const installCost =
    priceForUnit(pricing, "router") +
    apCount * priceForUnit(pricing, "ap") +
    outlets * priceForUnit(pricing, "outlet") +
    Math.round(input.areaSqm * priceForUnit(pricing, "sqm"));

  const quality = coverageQualityScore(apCount, input.rooms, input.deviceCount, ap.maxUsers);

  return {
    input,
    wallLossDb: wallLoss,
    recommendedAps: apCount,
    recommendedSwitches: switches,
    recommendedOutlets: outlets,
    coverageQuality: quality,
    equipment: equipmentLines,
    equipmentCost,
    installCost,
    totalCost: equipmentCost + installCost,
    floorPlans,
    currency: "MRU",
  };
}

export { DEFAULT_EQUIPMENT, DEFAULT_PRICING };
