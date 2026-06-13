import type {
  CableRun,
  CoverageInput,
  CoverageResult,
  DevicePlacement,
  EquipmentRecord,
  FloorPlan,
  HeatmapGrid,
  PricingRecord,
  RoomRect,
  WallType,
} from "@/lib/coverage-types";

const PLAN_W = 560;
const PLAN_H = 400;
const HEATMAP_COLS = 56;
const HEATMAP_ROWS = 40;

const DEFAULT_EQUIPMENT: EquipmentRecord[] = [
  { id: "default-router", name: "UniFi Dream Router", manufacturer: "Ubiquiti", deviceType: "ROUTER", price: 45000, coverageRadiusM: 15, maxUsers: 50 },
  { id: "default-ap", name: "UniFi U6 Lite", manufacturer: "Ubiquiti", deviceType: "ACCESS_POINT", price: 28000, coverageRadiusM: 12, maxUsers: 32 },
  { id: "default-mesh", name: "UniFi U6 Mesh", manufacturer: "Ubiquiti", deviceType: "MESH_NODE", price: 32000, coverageRadiusM: 10, maxUsers: 24 },
  { id: "default-switch", name: "UniFi Switch 24 PoE", manufacturer: "Ubiquiti", deviceType: "SWITCH", price: 52000, coverageRadiusM: 0, maxUsers: 0 },
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

function wallAttenuationFactor(wallType: WallType) {
  return wallType === "reinforced_concrete" ? 0.72 : 0.92;
}

function pickEquipment(active: EquipmentRecord[], deviceType: string) {
  return active.find((e) => e.deviceType === deviceType) ?? active[0];
}

function coverageQualityScore(apCount: number, rooms: number, deviceCount: number, maxUsersPerAp: number) {
  const capacity = apCount * maxUsersPerAp;
  const density = deviceCount / Math.max(rooms, 1);
  if (capacity >= deviceCount * 1.5 && density <= 8) return "excellent" as const;
  if (capacity >= deviceCount) return "good" as const;
  return "fair" as const;
}

function estimateApCount(input: CoverageInput, wallLoss: number, apEquip: EquipmentRecord) {
  const speedFactor = input.desiredSpeedMbps >= 500 ? 1.2 : input.desiredSpeedMbps >= 200 ? 1.1 : 1;
  const effectiveArea = input.areaSqm * Math.sqrt(input.floors) * speedFactor;
  const apCoverageSqm = Math.PI * apEquip.coverageRadiusM * apEquip.coverageRadiusM * 0.55;
  const base = Math.ceil(effectiveArea / Math.max(apCoverageSqm, 40));
  const lossPenalty = Math.max(0, Math.round((wallLoss - 6) / 3));
  const devicePenalty = Math.max(0, Math.ceil(input.deviceCount / apEquip.maxUsers) - 1);
  return Math.min(64, Math.max(1, base + lossPenalty + devicePenalty));
}

function priceForUnit(pricing: PricingRecord[], unit: string) {
  return pricing.find((p) => p.unit === unit)?.basePrice ?? 0;
}

function buildFloorLayout(livingRooms: number, floorIndex: number): RoomRect[] {
  const rooms: RoomRect[] = [];
  const pad = 8;

  rooms.push({
    id: `f${floorIndex}-tech`,
    x: pad,
    y: PLAN_H - 88 - pad,
    width: 96,
    height: 72,
    label: "TECH",
    kind: "tech",
  });

  rooms.push({
    id: `f${floorIndex}-storage`,
    x: pad + 104,
    y: PLAN_H - 72 - pad,
    width: 64,
    height: 56,
    label: "STORE",
    kind: "storage",
  });

  rooms.push({
    id: `f${floorIndex}-hall-h`,
    x: pad,
    y: PLAN_H / 2 - 22,
    width: PLAN_W - pad * 2,
    height: 44,
    label: "HALL",
    kind: "hallway",
  });

  rooms.push({
    id: `f${floorIndex}-hall-v`,
    x: PLAN_W / 2 - 22,
    y: pad + 20,
    width: 44,
    height: PLAN_H - 180,
    label: "",
    kind: "hallway",
  });

  const gridTop = pad + 16;
  const gridBottom = PLAN_H / 2 - 32;
  const gridLeft = pad + 16;
  const gridRight = PLAN_W - pad - 16;
  const cols = Math.ceil(Math.sqrt(livingRooms));
  const rows = Math.ceil(livingRooms / cols);
  const cellW = (gridRight - gridLeft) / cols;
  const cellH = (gridBottom - gridTop) / rows;

  for (let i = 0; i < livingRooms; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    rooms.push({
      id: `f${floorIndex}-r${i + 1}`,
      x: gridLeft + col * cellW + 4,
      y: gridTop + row * cellH + 4,
      width: cellW - 8,
      height: cellH - 8,
      label: `R${i + 1}`,
      kind: "room",
    });
  }

  return rooms;
}

function livingRoomCenters(rooms: RoomRect[]) {
  return rooms.filter((r) => r.kind === "room").map((r) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2, room: r }));
}

function techCenter(rooms: RoomRect[]) {
  const tech = rooms.find((r) => r.kind === "tech");
  if (!tech) return { x: 60, y: PLAN_H - 60 };
  return { x: tech.x + tech.width / 2, y: tech.y + tech.height / 2 };
}

function routeCable(from: { x: number; y: number }, to: { x: number; y: number }): { x: number; y: number }[] {
  const midY = (from.y + to.y) / 2;
  return [
    from,
    { x: from.x, y: midY },
    { x: to.x, y: midY },
    to,
  ];
}

function placeDevices(
  rooms: RoomRect[],
  apCount: number,
  floor: number,
  routerEquip: EquipmentRecord,
  apEquip: EquipmentRecord,
  meshEquip: EquipmentRecord,
  switchEquip: EquipmentRecord,
  useMesh: boolean,
): DevicePlacement[] {
  const devices: DevicePlacement[] = [];
  const tech = techCenter(rooms);
  const radiusPx = Math.min(95, apEquip.coverageRadiusM * 5);

  devices.push({
    id: `router-f${floor}`,
    floor,
    x: tech.x,
    y: tech.y,
    radius: Math.min(70, routerEquip.coverageRadiusM * 4),
    equipmentId: routerEquip.id,
    equipmentName: routerEquip.name,
    deviceType: "ROUTER",
  });

  devices.push({
    id: `switch-f${floor}`,
    floor,
    x: tech.x + 28,
    y: tech.y - 8,
    radius: 0,
    equipmentId: switchEquip.id,
    equipmentName: switchEquip.name,
    deviceType: "SWITCH",
  });

  const centers = livingRoomCenters(rooms);
  if (centers.length === 0) return devices;

  const step = Math.max(1, Math.floor(centers.length / apCount));
  for (let i = 0; i < apCount; i++) {
    const target = centers[Math.min(i * step, centers.length - 1)];
    const equip = useMesh && i % 3 === 2 ? meshEquip : apEquip;
    const type = useMesh && i % 3 === 2 ? "MESH_NODE" : "ACCESS_POINT";
    devices.push({
      id: `ap-f${floor}-${i + 1}`,
      floor,
      x: target.x,
      y: target.y,
      radius: Math.min(95, equip.coverageRadiusM * 5),
      equipmentId: equip.id,
      equipmentName: equip.name,
      deviceType: type as DevicePlacement["deviceType"],
    });
  }

  return devices;
}

function buildCables(devices: DevicePlacement[], floor: number, tech: { x: number; y: number }): CableRun[] {
  const cables: CableRun[] = [];
  const endpoints = devices.filter((d) => d.deviceType === "ACCESS_POINT" || d.deviceType === "MESH_NODE");

  endpoints.forEach((d, i) => {
    cables.push({
      id: `cable-f${floor}-${i + 1}`,
      floor,
      points: routeCable(tech, { x: d.x, y: d.y }),
      label: `Cat6 → ${d.equipmentName}`,
    });
  });

  if (floor > 1) {
    cables.push({
      id: `riser-f${floor}`,
      floor,
      points: [
        { x: tech.x, y: tech.y },
        { x: tech.x - 20, y: tech.y },
        { x: tech.x - 20, y: 20 },
      ],
      label: "Vertical riser",
    });
  }

  return cables;
}

function computeHeatmap(devices: DevicePlacement[], wallType: WallType): HeatmapGrid {
  const attenuation = wallAttenuationFactor(wallType);
  const values: number[] = [];

  for (let row = 0; row < HEATMAP_ROWS; row++) {
    for (let col = 0; col < HEATMAP_COLS; col++) {
      const cx = ((col + 0.5) / HEATMAP_COLS) * PLAN_W;
      const cy = ((row + 0.5) / HEATMAP_ROWS) * PLAN_H;
      let best = 0;

      for (const device of devices) {
        if (device.radius <= 0) continue;
        const dx = cx - device.x;
        const dy = cy - device.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= device.radius) continue;
        const raw = 1 - dist / device.radius;
        const signal = raw * attenuation * (device.deviceType === "ROUTER" ? 0.95 : 1);
        best = Math.max(best, signal);
      }

      values.push(Math.min(1, best));
    }
  }

  return { cols: HEATMAP_COLS, rows: HEATMAP_ROWS, values };
}

function buildFloorPlan(
  input: CoverageInput,
  floorIndex: number,
  apCountOnFloor: number,
  equipment: EquipmentRecord[],
  useMesh: boolean,
): FloorPlan {
  const livingRooms = Math.max(1, Math.ceil(input.rooms / input.floors));
  const rooms = buildFloorLayout(livingRooms, floorIndex);
  const routerEquip = pickEquipment(equipment, "ROUTER");
  const apEquip = pickEquipment(equipment, "ACCESS_POINT");
  const meshEquip = pickEquipment(equipment, "MESH_NODE");
  const switchEquip = pickEquipment(equipment, "SWITCH");

  const devices = placeDevices(rooms, apCountOnFloor, floorIndex, routerEquip, apEquip, meshEquip, switchEquip, useMesh);
  const tech = techCenter(rooms);
  const cables = buildCables(devices, floorIndex, tech);
  const heatmap = computeHeatmap(devices, input.wallType);

  return {
    width: PLAN_W,
    height: PLAN_H,
    rooms,
    devices,
    cables,
    heatmap,
    aps: devices.filter((d) => d.deviceType === "ACCESS_POINT" || d.deviceType === "MESH_NODE"),
  };
}

export function computeCoverageEstimate(
  input: CoverageInput,
  equipment: EquipmentRecord[] = DEFAULT_EQUIPMENT,
  pricing: PricingRecord[] = DEFAULT_PRICING,
): CoverageResult {
  const activeEquipment = equipment.length > 0 ? equipment : DEFAULT_EQUIPMENT;
  const wallLoss = wallLossDb(input.wallType);
  const apEquip = pickEquipment(activeEquipment, "ACCESS_POINT");
  const router = pickEquipment(activeEquipment, "ROUTER");
  const mesh = pickEquipment(activeEquipment, "MESH_NODE");
  const switchEquip = pickEquipment(activeEquipment, "SWITCH");

  const apCount = estimateApCount(input, wallLoss, apEquip);
  const switches = Math.max(1, Math.ceil(apCount / 24));
  const outlets = input.rooms + input.floors;
  const useMesh = input.floors > 1 || input.areaSqm > 280;

  const apsPerFloor = Math.ceil(apCount / input.floors);
  const floorPlans: FloorPlan[] = [];

  for (let f = 0; f < input.floors; f++) {
    const countOnFloor = f === input.floors - 1 ? apCount - apsPerFloor * (input.floors - 1) : apsPerFloor;
    floorPlans.push(buildFloorPlan(input, f + 1, Math.max(1, countOnFloor), activeEquipment, useMesh));
  }

  const meshCount = useMesh ? Math.min(Math.floor(apCount / 3), 2) : 0;
  const pureApCount = apCount - meshCount;

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
      equipmentId: switchEquip.id,
      name: switchEquip.name,
      manufacturer: switchEquip.manufacturer,
      deviceType: "SWITCH",
      quantity: switches,
      unitPrice: switchEquip.price,
      totalPrice: switchEquip.price * switches,
      coverageRadiusM: 0,
      maxUsers: 0,
    },
    {
      equipmentId: apEquip.id,
      name: apEquip.name,
      manufacturer: apEquip.manufacturer,
      deviceType: apEquip.deviceType,
      quantity: pureApCount,
      unitPrice: apEquip.price,
      totalPrice: apEquip.price * pureApCount,
      coverageRadiusM: apEquip.coverageRadiusM,
      maxUsers: apEquip.maxUsers,
    },
  ];

  if (meshCount > 0) {
    equipmentLines.push({
      equipmentId: mesh.id,
      name: mesh.name,
      manufacturer: mesh.manufacturer,
      deviceType: mesh.deviceType,
      quantity: meshCount,
      unitPrice: mesh.price,
      totalPrice: mesh.price * meshCount,
      coverageRadiusM: mesh.coverageRadiusM,
      maxUsers: mesh.maxUsers,
    });
  }

  const equipmentCost = equipmentLines.reduce((sum, line) => sum + line.totalPrice, 0);
  const installCost =
    priceForUnit(pricing, "router") +
    apCount * priceForUnit(pricing, "ap") +
    outlets * priceForUnit(pricing, "outlet") +
    Math.round(input.areaSqm * priceForUnit(pricing, "sqm"));

  const quality = coverageQualityScore(apCount, input.rooms, input.deviceCount, apEquip.maxUsers);

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
