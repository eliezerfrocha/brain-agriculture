import { formatCpfCnpj, maskCpfCnpjInput } from './formatDocument';

describe('formatCpfCnpj', () => {
  it('formata CPF (11 dígitos) com máscara', () => {
    expect(formatCpfCnpj('71543620060')).toBe('715.436.200-60');
  });

  it('formata CNPJ (14 dígitos) com máscara', () => {
    expect(formatCpfCnpj('06882428217255')).toBe('06.882.428/2172-55');
  });

  it('retorna o valor original se não tiver 11 ou 14 dígitos', () => {
    expect(formatCpfCnpj('123')).toBe('123');
  });
});

describe('maskCpfCnpjInput', () => {
  it('aplica máscara progressiva de CPF enquanto digita', () => {
    expect(maskCpfCnpjInput('123')).toBe('123');
    expect(maskCpfCnpjInput('12345678901')).toBe('123.456.789-01');
  });

  it('aplica máscara progressiva de CNPJ a partir do 12º dígito', () => {
    expect(maskCpfCnpjInput('12345678901234')).toBe('12.345.678/9012-34');
  });

  it('ignora caracteres não numéricos e limita a 14 dígitos', () => {
    // 18 dígitos digitados, mas só os 14 primeiros contam (vira CNPJ)
    expect(maskCpfCnpjInput('123.456.789-01999')).toBe('12.345.678/9019-99');
  });
});
