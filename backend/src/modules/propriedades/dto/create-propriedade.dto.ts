import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { ValidAreas } from '../../../common/validators/valid-areas.validator';

export class CreatePropriedadeDto {
  @ApiProperty()
  @IsUUID()
  produtorId: string;

  @ApiProperty({ example: 'Fazenda Boa Esperança' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nome: string;

  @ApiProperty({ example: 'Uberlândia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  cidade: string;

  @ApiProperty({ example: 'MG', description: 'Sigla do estado (UF)' })
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsPositive()
  areaTotal: number;

  @ApiProperty({ example: 600 })
  @IsNumber()
  @Min(0)
  areaAgricultavel: number;

  @ApiProperty({ example: 300 })
  @IsNumber()
  @Min(0)
  @ValidAreas({
    message: 'areaAgricultavel + areaVegetacao não pode ser maior que areaTotal',
  })
  areaVegetacao: number;
}
