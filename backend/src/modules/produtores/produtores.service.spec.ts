import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { ProdutoresService } from './produtores.service';
import { Produtor } from './entities/produtor.entity';

function uniqueViolation() {
  return new QueryFailedError('query', [], {
    name: 'error',
    message: 'duplicate key value violates unique constraint',
    code: '23505',
  } as unknown as Error);
}

describe('ProdutoresService', () => {
  let service: ProdutoresService;
  const repositoryMock = {
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ id: 'uuid-fake', ...entity })),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoresService,
        { provide: getRepositoryToken(Produtor), useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<ProdutoresService>(ProdutoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('cria um produtor delegando persistência ao repositório', async () => {
    const dto = { cpfCnpj: '71543620060', nome: 'João da Silva' };
    const result = await service.create(dto);
    expect(repositoryMock.create).toHaveBeenCalledWith(dto);
    expect(repositoryMock.save).toHaveBeenCalled();
    expect(result).toMatchObject(dto);
  });

  it('lança ConflictException ao cadastrar produtor com CPF/CNPJ já existente', async () => {
    repositoryMock.save.mockRejectedValueOnce(uniqueViolation());
    const dto = { cpfCnpj: '71543620060', nome: 'João da Silva' };
    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('lança ConflictException ao atualizar produtor para um CPF/CNPJ já usado por outro', async () => {
    repositoryMock.findOne.mockResolvedValueOnce({ id: 'id-1', cpfCnpj: '71543620060', nome: 'João' });
    repositoryMock.save.mockRejectedValueOnce(uniqueViolation());
    await expect(
      service.update('id-1', { cpfCnpj: '52998224725' }),
    ).rejects.toThrow(ConflictException);
  });

  it('lança NotFoundException quando findOne não encontra o produtor', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne('id-inexistente')).rejects.toThrow(NotFoundException);
  });

  it('lança NotFoundException ao tentar atualizar produtor inexistente', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null);
    await expect(
      service.update('id-inexistente', { nome: 'Novo nome' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('lança NotFoundException ao tentar remover produtor inexistente', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null);
    await expect(service.remove('id-inexistente')).rejects.toThrow(NotFoundException);
    expect(repositoryMock.remove).not.toHaveBeenCalled();
  });
});
