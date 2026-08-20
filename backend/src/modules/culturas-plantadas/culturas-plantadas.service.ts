import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaPlantada } from './entities/cultura-plantada.entity';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import {
  isPostgresErrorCode,
  POSTGRES_FOREIGN_KEY_VIOLATION,
  POSTGRES_UNIQUE_VIOLATION,
} from '../../common/database/postgres-error-codes';

@Injectable()
export class CulturasPlantadasService {
  constructor(
    @InjectRepository(CulturaPlantada)
    private readonly repository: Repository<CulturaPlantada>,
  ) {}

  async create(dto: CreateCulturaPlantadaDto): Promise<CulturaPlantada> {
    try {
      return await this.repository.save(this.repository.create(dto));
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException(
          'Essa cultura já está plantada nessa propriedade e safra',
        );
      }
      if (isPostgresErrorCode(error, POSTGRES_FOREIGN_KEY_VIOLATION)) {
        throw new BadRequestException(
          'Propriedade, safra ou cultura informada não existe',
        );
      }
      throw error;
    }
  }

  findByPropriedade(propriedadeId: string): Promise<CulturaPlantada[]> {
    return this.repository.find({ where: { propriedadeId }, order: { createdAt: 'DESC' } });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
