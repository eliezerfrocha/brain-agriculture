import { registerDecorator, ValidationOptions } from 'class-validator';

function calcCheckDigit(base: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < base.length; i++) {
    sum += Number(base[i]) * weights[i];
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/**
 * Validação REAL de CPF (dígitos verificadores), aceitando entrada com ou
 * sem máscara. Rejeita sequências com todos os dígitos iguais
 * (ex.: "111.111.111-11"), que passariam no cálculo mas não são CPFs válidos.
 */
export function isValidCpf(cpf: string): boolean {
  const digits = (cpf ?? '').replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const base = digits.slice(0, 9);
  const weights1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit1 = calcCheckDigit(base, weights1);

  const weights2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit2 = calcCheckDigit(base + digit1, weights2);

  return digits === base + String(digit1) + String(digit2);
}

/**
 * Validação REAL de CNPJ (dígitos verificadores), aceitando entrada com ou
 * sem máscara. Rejeita sequências com todos os dígitos iguais.
 */
export function isValidCnpj(cnpj: string): boolean {
  const digits = (cnpj ?? '').replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const base = digits.slice(0, 12);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit1 = calcCheckDigit(base, weights1);

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const digit2 = calcCheckDigit(base + digit1, weights2);

  return digits === base + String(digit1) + String(digit2);
}

export function isValidCpfOuCnpj(value: string): boolean {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length === 11) return isValidCpf(digits);
  if (digits.length === 14) return isValidCnpj(digits);
  return false;
}

export function IsCpfOuCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOuCnpj',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isValidCpfOuCnpj(value);
        },
        defaultMessage() {
          return 'Informe um CPF ou CNPJ válido';
        },
      },
    });
  };
}
