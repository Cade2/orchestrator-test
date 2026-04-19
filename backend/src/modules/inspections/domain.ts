import { DamageSeverity, InspectionStatus, VehicleArea } from '@prisma/client';

type EnumMap = Record<string, string>;

function enumValues<T extends EnumMap>(enumMap: T): readonly T[keyof T][] {
  return Object.freeze(Object.values(enumMap)) as readonly T[keyof T][];
}

export const inspectionStatuses = enumValues(InspectionStatus);
export const damageSeverities = enumValues(DamageSeverity);
export const vehicleAreas = enumValues(VehicleArea);

export interface InspectionSchema {
  statuses: readonly InspectionStatus[];
  severities: readonly DamageSeverity[];
  vehicleAreas: readonly VehicleArea[];
}

export function getInspectionSchema(): InspectionSchema {
  return {
    statuses: inspectionStatuses,
    severities: damageSeverities,
    vehicleAreas,
  };
}

