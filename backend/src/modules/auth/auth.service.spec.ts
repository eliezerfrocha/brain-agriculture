import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Usuario } from '../usuarios/entities/usuario.entity';

describe('AuthService', () => {
  let service: AuthService;
  const usuarioRepoMock = { findOne: jest.fn() };
  const jwtServiceMock = { sign: jest.fn(() => 'token-fake') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepoMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('retorna accessToken e usuario quando as credenciais estão corretas', async () => {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    usuarioRepoMock.findOne.mockResolvedValueOnce({
      id: 'user-1',
      email: 'admin@brainagriculture.com',
      nome: 'Administrador',
      passwordHash,
    });

    const result = await service.login('admin@brainagriculture.com', 'Admin@123');

    expect(result.accessToken).toBe('token-fake');
    expect(result.usuario).toEqual({
      id: 'user-1',
      email: 'admin@brainagriculture.com',
      nome: 'Administrador',
    });
  });

  it('lança UnauthorizedException quando a senha está incorreta', async () => {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    usuarioRepoMock.findOne.mockResolvedValueOnce({
      id: 'user-1',
      email: 'admin@brainagriculture.com',
      nome: 'Administrador',
      passwordHash,
    });

    await expect(service.login('admin@brainagriculture.com', 'senha-errada')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('lança UnauthorizedException quando o usuário não existe', async () => {
    usuarioRepoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.login('ninguem@example.com', 'qualquer')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
