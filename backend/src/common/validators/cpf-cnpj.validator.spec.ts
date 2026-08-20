import { isValidCpf, isValidCnpj, isValidCpfOuCnpj } from './cpf-cnpj.validator';

describe('isValidCpf', () => {
  it('aceita CPF válido sem máscara', () => {
    expect(isValidCpf('71543620060')).toBe(true);
    expect(isValidCpf('75021936778')).toBe(true);
  });

  it('aceita CPF válido com máscara', () => {
    expect(isValidCpf('715.436.200-60')).toBe(true);
  });

  it('rejeita CPF com dígito verificador incorreto', () => {
    expect(isValidCpf('71543620061')).toBe(false);
  });

  it('rejeita sequências com todos os dígitos iguais', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('00000000000')).toBe(false);
  });

  it('rejeita CPF com quantidade de dígitos incorreta', () => {
    expect(isValidCpf('123456789')).toBe(false);
    expect(isValidCpf('')).toBe(false);
  });
});

describe('isValidCnpj', () => {
  it('aceita CNPJ válido sem máscara', () => {
    expect(isValidCnpj('06882428217255')).toBe(true);
    expect(isValidCnpj('98225779874628')).toBe(true);
  });

  it('aceita CNPJ válido com máscara', () => {
    expect(isValidCnpj('06.882.428/2172-55')).toBe(true);
  });

  it('rejeita CNPJ com dígito verificador incorreto', () => {
    expect(isValidCnpj('06882428217256')).toBe(false);
  });

  it('rejeita sequências com todos os dígitos iguais', () => {
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false);
    expect(isValidCnpj('00000000000000')).toBe(false);
  });

  it('rejeita CNPJ com quantidade de dígitos incorreta', () => {
    expect(isValidCnpj('123456789')).toBe(false);
    expect(isValidCnpj('')).toBe(false);
  });
});

describe('isValidCpfOuCnpj', () => {
  it('roteia para isValidCpf quando há 11 dígitos', () => {
    expect(isValidCpfOuCnpj('715.436.200-60')).toBe(true);
  });

  it('roteia para isValidCnpj quando há 14 dígitos', () => {
    expect(isValidCpfOuCnpj('06.882.428/2172-55')).toBe(true);
  });

  it('rejeita quantidade de dígitos que não é nem CPF nem CNPJ', () => {
    expect(isValidCpfOuCnpj('123')).toBe(false);
  });
});
