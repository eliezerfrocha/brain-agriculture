import { getUfName, UF_NAMES } from './ufNames';

describe('getUfName', () => {
  it('retorna o nome completo do estado a partir da sigla', () => {
    expect(getUfName('MG')).toBe('Minas Gerais');
    expect(getUfName('sp')).toBe('São Paulo');
  });

  it('retorna a própria sigla se não encontrar correspondência', () => {
    expect(getUfName('XX')).toBe('XX');
  });

  it('cobre as 27 unidades federativas', () => {
    expect(Object.keys(UF_NAMES)).toHaveLength(27);
  });
});
