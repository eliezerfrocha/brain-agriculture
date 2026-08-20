import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSafraDto {
  @ApiProperty({ example: 'Safra 2021' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;
}
