import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultura } from './entities/cultura.entity';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import {
  isPostgresErrorCode,
  POSTGRES_FOREIGN_KEY_VIOLATION,
  POSTGRES_UNIQUE_VIOLATION,
} from '../../common/database/postgres-error-codes';

@Injectable()
export class CulturasService {
  constructor(
    @InjectRepository(Cultura) private readonly repository: Repository<Cultura>,
  ) {}

  async create(dto: CreateCulturaDto): Promise<Cultura> {
    try {
      return await this.repository.save(this.repository.create(dto));
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException('Já existe uma cultura com esse nome');
      }
      throw error;
    }
  }

  findAll(): Promise<Cultura[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Cultura> {
    const cultura = await this.repository.findOne({ where: { id } });
    if (!cultura) {
      throw new NotFoundException(`Cultura ${id} não encontrada`);
    }
    return cultura;
  }

  async update(id: string, dto: UpdateCulturaDto): Promise<Cultura> {
    const cultura = await this.findOne(id);
    Object.assign(cultura, dto);
    try {
      return await this.repository.save(cultura);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException('Já existe uma cultura com esse nome');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const cultura = await this.findOne(id);
    try {
      await this.repository.remove(cultura);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException(
          'Essa cultura está em uso por alguma cultura plantada e não pode ser removida',
        );
      }
      throw error;
    }
  }
}
