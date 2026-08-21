import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const usuario = await this.usuarioRepo.findOne({ where: { email } });

    // Mesma mensagem para "usuário não existe" e "senha errada" — evita
    // vazar quais e-mails estão cadastrados (enumeration attack).
    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload: JwtPayload = { sub: usuario.id, email: usuario.email, nome: usuario.nome };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: { id: usuario.id, email: usuario.email, nome: usuario.nome },
    };
  }
}
