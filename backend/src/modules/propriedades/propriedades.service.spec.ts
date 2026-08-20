import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { PropriedadesService } from './propriedades.service';
import { Propriedade } from './entities/propriedade.entity';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';

function foreignKeyViolation() {
  return new QueryFailedError('query', [], {
    name: 'error',
    message: 'insert or update on table violates foreign key constraint',
    code: '23503',
  } as unknown as Error);
}

describe('PropriedadesService', () => {
  let service: PropriedadesService;
  const repositoryMock = {
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ id: 'uuid-fake', ...entity })),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const baseDto: CreatePropriedadeDto = {
    produtorId: 'produtor-uuid',
    nome: 'Fazenda Teste',
    cidade: 'Uberlândia',
    estado: 'MG',
    areaTotal: 1000,
    areaAgricultavel: 700,
    areaVegetacao: 300,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropriedadesService,
        { provide: getRepositoryToken(Propriedade), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<PropriedadesService>(PropriedadesService);
  });

  it('deve aceitar quando areaAgricultavel + areaVegetacao == areaTotal', async () => {
    const dto = { ...baseDto, areaAgricultavel: 600, areaVegetacao: 400, areaTotal: 1000 };
    await expect(service.create(dto)).resolves.toBeDefined();
    expect(repositoryMock.save).toHaveBeenCalled();
  });

  it('deve aceitar quando areaAgricultavel + areaVegetacao < areaTotal', async () => {
    const dto = { ...baseDto, areaAgricultavel: 500, areaVegetacao: 300, areaTotal: 1000 };
    await expect(service.create(dto)).resolves.toBeDefined();
  });

  it('deve rejeitar quando areaAgricultavel + areaVegetacao > areaTotal', async () => {
    const dto = { ...baseDto, areaAgricultavel: 600, areaVegetacao: 401, areaTotal: 1000 };
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(repositoryMock.save).not.toHaveBeenCalled();
  });

  it('deve rejeitar cadastro com produtorId inexistente', async () => {
    repositoryMock.save.mockRejectedValueOnce(foreignKeyViolation());
    await expect(service.create(baseDto)).rejects.toThrow(BadRequestException);
  });

  it('deve rejeitar update que ultrapassa areaTotal existente', async () => {
    repositoryMock.findOne.mockResolvedValueOnce({
      id: 'prop-1',
      ...baseDto,
    });

    await expect(
      service.update('prop-1', { areaAgricultavel: 900 }),
    ).rejects.toThrow(BadRequestException);
  });
});
