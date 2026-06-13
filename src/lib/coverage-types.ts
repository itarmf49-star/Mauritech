export type WallType = "standard" | "reinforced_concrete";

export type CoverageInput = {
  areaSqm: number;
  rooms: number;
  floors: number;
  wallType: WallType;
  desiredSpeedMbps: number;
  deviceCount: number;
};

export type RoomKind = "room" | "hallway" | "tech" | "storage";

export type RoomRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  kind: RoomKind;
};

export type DeviceKind = "ROUTER" | "ACCESS_POINT" | "MESH_NODE" | "SWITCH";

export type DevicePlacement = {
  id: string;
  floor: number;
  x: number;
  y: number;
  radius: number;
  equipmentId: string;
  equipmentName: string;
  deviceType: DeviceKind;
};

/** @deprecated Use DevicePlacement */
export type ApPlacement = DevicePlacement;

export type CableRun = {
  id: string;
  floor: number;
  points: { x: number; y: number }[];
  label?: string;
};

export type HeatmapGrid = {
  cols: number;
  rows: number;
  /** Normalized signal strength 0–1 per cell, row-major */
  values: number[];
};

export type FloorPlan = {
  width: number;
  height: number;
  rooms: RoomRect[];
  devices: DevicePlacement[];
  cables: CableRun[];
  heatmap: HeatmapGrid;
  /** @deprecated */
  aps?: DevicePlacement[];
};

export type EquipmentRecommendation = {
  equipmentId: string;
  name: string;
  manufacturer: string;
  deviceType: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  coverageRadiusM: number;
  maxUsers: number;
};

export type CoverageResult = {
  input: CoverageInput;
  wallLossDb: number;
  recommendedAps: number;
  recommendedSwitches: number;
  recommendedOutlets: number;
  coverageQuality: "excellent" | "good" | "fair";
  equipment: EquipmentRecommendation[];
  equipmentCost: number;
  installCost: number;
  totalCost: number;
  floorPlans: FloorPlan[];
  currency: string;
};

export type EquipmentRecord = {
  id: string;
  name: string;
  manufacturer: string;
  deviceType: string;
  price: number;
  coverageRadiusM: number;
  maxUsers: number;
};

export type PricingRecord = {
  unit: string;
  basePrice: number;
};
