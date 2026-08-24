import { ApiProperty } from '@nestjs/swagger';

export class DashboardUsoDoSoloDto {
  @ApiProperty({ example: 9800.3, description: 'Soma da área agricultável (ha) de todas as propriedades' })
  areaAgricultavel: number;

  @ApiProperty({ example: 5520.2, description: 'Soma da área de vegetação (ha) de todas as propriedades' })
  areaVegetacao: number;
}
