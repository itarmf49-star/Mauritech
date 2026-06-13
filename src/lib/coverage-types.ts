export type WallType = "standard" | "reinforced_concrete";

export type CoverageInput = {
  areaSqm: number;
  rooms: number;
  floors: number;
  wallType: WallType;
  desiredSpeedMbps: number;
  deviceCount: number;
};

export type RoomRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
};

export type ApPlacement = {
  id: string;
  floor: number;
  x: number;
  y: number;
  radius: number;
  equipmentId: string;
  equipmentName: string;
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

export type FloorPlan = {
  width: number;
  height: number;
  rooms: RoomRect[];
  aps: ApPlacement[];
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
