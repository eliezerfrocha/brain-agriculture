import { ApiProperty } from '@nestjs/swagger';

// Formato único de erro devolvido pelo HttpExceptionFilter (ver
// common/filters/http-exception.filter.ts) — documentado aqui pra ser
// referenciado nas respostas de erro de todos os endpoints.
export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: '2026-08-26T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/produtores' })
  path: string;

  @ApiProperty({ example: 'Dados inválidos' })
  message: string;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['nome should not be empty'],
    description: 'Presente quando o erro vem do ValidationPipe (um item por campo inválido).',
  })
  errors?: string[];
}
