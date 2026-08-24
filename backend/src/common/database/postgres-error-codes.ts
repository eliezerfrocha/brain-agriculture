import { QueryFailedError } from 'typeorm';

// Códigos de erro do Postgres (classe 23 — integrity constraint violation).
// Usado pelos services pra converter erro de banco em HttpException legível
// (409 em vez do 500 genérico que o driver devolveria por padrão).
export const POSTGRES_UNIQUE_VIOLATION = '23505';
export const POSTGRES_FOREIGN_KEY_VIOLATION = '23503';

export function isPostgresErrorCode(error: unknown, code: string): boolean {
  return error instanceof QueryFailedError && (error as unknown as { code?: string }).code === code;
}
