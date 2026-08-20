import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateCulturaPlantadaDto {
  @ApiProperty()
  @IsUUID()
  propriedadeId: string;

  @ApiProperty()
  @IsUUID()
  safraId: string;

  @ApiProperty()
  @IsUUID()
  culturaId: string;
}
