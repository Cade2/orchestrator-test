import type { InspectionStatus, PrismaClient } from '@prisma/client';

import { prisma } from '../../db/prisma';
import type { InspectionListItemDto } from './types';

function toInspectionListItemDto(record: {
  id: string;
  userId: string;
  title: string;
  status: InspectionStatus;
  vehicleVin: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
}): InspectionListItemDto {
  return {
    id: record.id,
    userId: record.userId,
    title: record.title,
    status: record.status,
    vehicleVin: record.vehicleVin,
    vehicleMake: record.vehicleMake,
    vehicleModel: record.vehicleModel,
    vehicleYear: record.vehicleYear,
    summary: record.summary,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export class InspectionRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async listByUserId(userId: string): Promise<InspectionListItemDto[]> {
    const normalizedUserId = userId.trim();

    if (normalizedUserId.length === 0) {
      throw new Error('userId must not be empty');
    }

    const inspections = await this.db.inspection.findMany({
      where: { userId: normalizedUserId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        status: true,
        vehicleVin: true,
        vehicleMake: true,
        vehicleModel: true,
        vehicleYear: true,
        summary: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return inspections.map(toInspectionListItemDto);
  }
}
