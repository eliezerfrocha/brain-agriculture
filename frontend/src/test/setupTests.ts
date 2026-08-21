import '@testing-library/jest-dom';

// jsdom não tem `fetch` global; os testes mockam os hooks do RTK Query
// diretamente (não fazem requisição real), então um stub simples basta pra
// silenciar o aviso do `fetchBaseQuery` ao montar os api slices.
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = jest.fn() as unknown as typeof fetch;
}
