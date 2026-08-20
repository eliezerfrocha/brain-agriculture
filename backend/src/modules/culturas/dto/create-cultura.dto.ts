import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCulturaDto {
  @ApiProperty({ example: 'Soja' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;
}
