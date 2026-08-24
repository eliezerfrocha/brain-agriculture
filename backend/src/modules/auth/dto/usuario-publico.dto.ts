import { ApiProperty } from '@nestjs/swagger';

// Subconjunto do Usuario exposto pela API — nunca inclui passwordHash.
export class UsuarioPublicoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'admin@brainagriculture.com' })
  email: string;

  @ApiProperty({ example: 'Administrador' })
  nome: string;
}
