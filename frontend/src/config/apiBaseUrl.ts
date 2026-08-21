// Isolado num módulo próprio de propósito: é o único lugar do código que usa
// `import.meta.env` (sintaxe só válida em ESM). Nos testes (Jest, rodando em
// CommonJS), esse arquivo é substituído por um mock via `moduleNameMapper`
// (ver jest.config.cjs) — assim o resto da suíte não precisa lidar com ESM.
export const API_BASE_URL: string = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000';
