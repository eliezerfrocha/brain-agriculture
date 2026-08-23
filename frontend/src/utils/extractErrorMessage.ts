interface ApiErrorShape {
  data?: {
    errors?: string[];
    message?: string;
  };
}

function isApiErrorShape(error: unknown): error is ApiErrorShape {
  return typeof error === 'object' && error !== null && 'data' in error;
}

/**
 * Lê o formato de erro que o backend sempre devolve (ver HttpExceptionFilter):
 * `errors` quando é validação de campos (class-validator), `message` pros
 * demais casos (ex.: 401, 409). Usado por todo formulário/lista que chama a API.
 */
export function extractErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (isApiErrorShape(error)) {
    if (error.data?.errors?.length) return error.data.errors.join(', ');
    if (error.data?.message) return error.data.message;
  }
  return fallback;
}
