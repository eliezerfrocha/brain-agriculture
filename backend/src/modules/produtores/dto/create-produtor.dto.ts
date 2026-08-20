import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { IsCpfOuCnpj } from '../../../common/validators/cpf-cnpj.validator';

export class CreateProdutorDto {
  @ApiProperty({ example: '12345678901', description: 'CPF (11) ou CNPJ (14), somente dígitos' })
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/\D/g, '') : value))
  @IsString()
  @Length(11, 14)
  @IsCpfOuCnpj()
  cpfCnpj: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nome: string;
}
