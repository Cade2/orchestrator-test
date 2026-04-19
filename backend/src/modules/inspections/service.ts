import { getInspectionSchema } from './domain';
import { InspectionRepository } from './repository';
import { InspectionListItemDto, InspectionSchemaResponseDto } from './types';

export class InspectionService {
  constructor(private readonly repository: InspectionRepository = new InspectionRepository()) {}

  getSchema(): InspectionSchemaResponseDto {
    return getInspectionSchema();
  }

  async listByUserId(userId: string): Promise<InspectionListItemDto[]> {
    const normalizedUserId = userId.trim();

    if (normalizedUserId.length === 0) {
      throw new Error('userId must not be empty');
    }

    return this.repository.listByUserId(normalizedUserId);
  }
}

