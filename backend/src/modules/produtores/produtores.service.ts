import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produtor } from './entities/produtor.entity';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { isPostgresErrorCode, POSTGRES_UNIQUE_VIOLATION } from '../../common/database/postgres-error-codes';

@Injectable()
export class ProdutoresService {
  constructor(
    @InjectRepository(Produtor)
    private readonly repository: Repository<Produtor>,
  ) {}

  // cpfCnpj é validado no DTO via @IsCpfOuCnpj (common/validators/cpf-cnpj.validator)
  // antes de chegar aqui — dígito verificador real, não regex de formato.

  async create(dto: CreateProdutorDto): Promise<Produtor> {
    const produtor = this.repository.create(dto);
    try {
      return await this.repository.save(produtor);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException('Já existe um produtor cadastrado com esse CPF/CNPJ');
      }
      throw error;
    }
  }

  findAll(): Promise<Produtor[]> {
    return this.repository.find({
      relations: ['propriedades'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Produtor> {
    const produtor = await this.repository.findOne({
      where: { id },
      relations: ['propriedades'],
    });
    if (!produtor) {
      throw new NotFoundException(`Produtor ${id} não encontrado`);
    }
    return produtor;
  }

  async update(id: string, dto: UpdateProdutorDto): Promise<Produtor> {
    const produtor = await this.findOne(id);
    Object.assign(produtor, dto);
    try {
      return await this.repository.save(produtor);
    } catch (error) {
      if (isPostgresErrorCode(error, POSTGRES_UNIQUE_VIOLATION)) {
        throw new ConflictException('Já existe um produtor cadastrado com esse CPF/CNPJ');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const produtor = await this.findOne(id);
    await this.repository.remove(produtor);
  }
}
