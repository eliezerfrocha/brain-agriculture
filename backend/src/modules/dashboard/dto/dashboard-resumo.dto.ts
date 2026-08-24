import { ApiProperty } from '@nestjs/swagger';

export class DashboardResumoDto {
  @ApiProperty({ example: 42 })
  totalFazendas: number;

  @ApiProperty({ example: 15320.5, description: 'Soma da área total (ha) de todas as propriedades' })
  totalHectares: number;
}
