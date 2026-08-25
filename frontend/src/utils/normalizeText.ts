// Remove acentos (marcas diacríticas Unicode) depois do normalize('NFD')
// separá-los das letras — assim "Paraná"/"parana" e "Uberlândia"/"uberlandia"
// casam na busca. Compartilhado pelos campos de autocomplete (UF, cidade).
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
