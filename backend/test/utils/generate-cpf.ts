function calcCheckDigit(base: string, weights: number[]): number {
  let sum = 0;
  for (let i = 0; i < base.length; i++) sum += Number(base[i]) * weights[i];
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** Gera um CPF válido (dígitos verificadores reais) e diferente a cada chamada. */
export function generateValidCpf(): string {
  let base: string;
  do {
    base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  } while (/^(\d)\1{8}$/.test(base));

  const digit1 = calcCheckDigit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digit2 = calcCheckDigit(base + digit1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return `${base}${digit1}${digit2}`;
}
