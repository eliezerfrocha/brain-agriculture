import { ApiProperty } from '@nestjs/swagger';
import { UsuarioPublicoDto } from './usuario-publico.dto';

export class LoginResponseDto {
  @ApiProperty({ description: 'Token JWT a ser enviado em `Authorization: Bearer <token>`' })
  accessToken: string;

  @ApiProperty({ type: () => UsuarioPublicoDto })
  usuario: UsuarioPublicoDto;
}
