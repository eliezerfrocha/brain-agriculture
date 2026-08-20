import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Safra } from './entities/safra.entity';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import {
  isPostgresErrorCode,
  POSTGRES_FOREIGN_KEY_VIOLATION,
  POSTGRES_UNIQUE_VIOLATION,
} from '../../common/database/postgres-error-codes';

@Injectable()
export class SafrasService {
  constructor(
    @InjectRepository(Safra) private readonly repository: Repository<Safra>,
  ) {}

  async create(dto: CreateSafraDto): Promise<Safra> {
    try {
      return await this.repository.save(this.repository.create(dto));
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException('Já existe uma safra com esse nome');
      }
      throw error;
    }
  }

  findAll(): Promise<Safra[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Safra> {
    const safra = await this.repository.findOne({ where: { id } });
    if (!safra) {
      throw new NotFoundException(`Safra ${id} não encontrada`);
    }
    return safra;
  }

  async update(id: string, dto: UpdateSafraDto): Promise<Safra> {
    const safra = await this.findOne(id);
    Object.assign(safra, dto);
    try {
      return await this.repository.save(safra);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException('Já existe uma safra com esse nome');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const safra = await this.findOne(id);
    try {
      await this.repository.remove(safra);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_FOREIGN_KEY_VIOLATION)) {
        throw new ConflictException(
          'Essa safra está em uso por alguma cultura plantada e não pode ser removida',
        );
      }
      throw error;
    }
  }
}
