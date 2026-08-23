// Mesmo texto sempre cai na mesma cor da paleta — usado pra dar variedade
// visual determinística (avatar por produtor, snapshot de mapa por
// propriedade) sem precisar guardar uma cor no banco.
export function colorFromString(value: string, palette: readonly string[]): string {
  const hash = [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}
