// Formatador único de números em pt-BR (usado em hectares, contagens e %
// nos gráficos/cards do dashboard e nas listagens de propriedades).
export const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
