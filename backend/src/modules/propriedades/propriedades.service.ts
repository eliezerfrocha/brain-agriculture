import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propriedade } from './entities/propriedade.entity';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';
import { areasSaoValidas } from '../../common/validators/valid-areas.validator';
import {
  isPostgresErrorCode,
  POSTGRES_FOREIGN_KEY_VIOLATION,
} from '../../common/database/postgres-error-codes';

@Injectable()
export class PropriedadesService {
  constructor(
    @InjectRepository(Propriedade)
    private readonly repository: Repository<Propriedade>,
  ) {}

  /**
   * Regra de negócio #3: areaAgricultavel + areaVegetacao <= areaTotal.
   * Reforça em runtime o que o DTO (@ValidAreas) já valida na entrada da API,
   * cobrindo também o merge de updates parciais feito em `update()`.
   */
  private validarAreas(input: {
    areaTotal: number;
    areaAgricultavel: number;
    areaVegetacao: number;
  }): void {
    if (!areasSaoValidas(input)) {
      throw new BadRequestException(
        'areaAgricultavel + areaVegetacao não pode ser maior que areaTotal',
      );
    }
  }

  async create(dto: CreatePropriedadeDto): Promise<Propriedade> {
    this.validarAreas(dto);
    const propriedade = this.repository.create(dto);
    try {
      return await this.repository.save(propriedade);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_FOREIGN_KEY_VIOLATION)) {
        throw new BadRequestException('Produtor informado não existe');
      }
      throw error;
    }
  }

  findAll(): Promise<Propriedade[]> {
    return this.repository.find({
      relations: ['produtor', 'culturasPlantadas'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Propriedade> {
    const propriedade = await this.repository.findOne({
      where: { id },
      relations: ['produtor', 'culturasPlantadas'],
    });
    if (!propriedade) {
      throw new NotFoundException(`Propriedade ${id} não encontrada`);
    }
    return propriedade;
  }

  async update(id: string, dto: UpdatePropriedadeDto): Promise<Propriedade> {
    const propriedade = await this.findOne(id);
    const merged = { ...propriedade, ...dto };
    this.validarAreas(merged);
    Object.assign(propriedade, dto);
    try {
      return await this.repository.save(propriedade);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_FOREIGN_KEY_VIOLATION)) {
        throw new BadRequestException('Produtor informado não existe');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const propriedade = await this.findOne(id);
    await this.repository.remove(propriedade);
  }
}
