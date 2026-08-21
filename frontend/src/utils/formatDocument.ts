// Aplica a máscara de exibição de CPF/CNPJ a partir dos dígitos armazenados
// (o backend já normaliza e persiste só os dígitos).
export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return value;
}

// Máscara progressiva aplicada enquanto o usuário digita (CPF até 11 dígitos,
// CNPJ a partir do 12º). O backend recebe e persiste apenas os dígitos.
export function maskCpfCnpjInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}
