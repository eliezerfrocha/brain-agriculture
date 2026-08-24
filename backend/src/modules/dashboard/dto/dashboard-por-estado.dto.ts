import { ApiProperty } from '@nestjs/swagger';

export class DashboardPorEstadoDto {
  @ApiProperty({ example: 'MG', description: 'Sigla do estado (UF)' })
  estado: string;

  @ApiProperty({ example: 12, description: 'Quantidade de propriedades cadastradas nesse estado' })
  total: number;
}
