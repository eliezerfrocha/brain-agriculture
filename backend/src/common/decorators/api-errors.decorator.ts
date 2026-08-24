import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

// Todo endpoint protegido pelo JwtAuthGuard global pode devolver 401
// (ver app.module.ts) — centralizado aqui pra não repetir o mesmo
// @ApiUnauthorizedResponse em cada método de cada controller.
export function ApiAuthErrors() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Token JWT ausente ou inválido', type: ErrorResponseDto }),
  );
}

// Todo endpoint com @Body() passa pelo ValidationPipe global e pode
// devolver 400 quando o DTO não valida.
export function ApiValidationErrors() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Corpo da requisição inválido', type: ErrorResponseDto }),
  );
}
