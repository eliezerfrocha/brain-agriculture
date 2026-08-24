import { ApiProperty } from '@nestjs/swagger';

export class DashboardPorCulturaDto {
  @ApiProperty({ example: 'Soja' })
  cultura: string;

  @ApiProperty({ example: 8, description: 'Quantidade de plantios registrados para essa cultura' })
  total: number;
}
