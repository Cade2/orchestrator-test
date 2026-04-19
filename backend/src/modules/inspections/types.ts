import type { DamageSeverity, InspectionStatus, VehicleArea } from '@prisma/client';

export interface InspectionSchemaResponseDto {
  statuses: readonly InspectionStatus[];
  severities: readonly DamageSeverity[];
  vehicleAreas: readonly VehicleArea[];
}

export interface InspectionListItemDto {
  id: string;
  userId: string;
  title: string;
  status: InspectionStatus;
  vehicleVin: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
}
