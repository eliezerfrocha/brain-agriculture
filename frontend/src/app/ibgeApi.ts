import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Municipio {
  id: number;
  nome: string;
}

/**
 * API pública do IBGE (localidades) — usada só para sugerir cidades ao
 * escolher a UF no cadastro de propriedade. Não tem relação com o backend
 * da aplicação; se ficar indisponível, o campo de cidade continua editável
 * como texto livre (ver CityAutocomplete).
 */
export const ibgeApi = createApi({
  reducerPath: 'ibgeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://servicodados.ibge.gov.br/api/v1/localidades' }),
  endpoints: (builder) => ({
    getMunicipiosPorUf: builder.query<Municipio[], string>({
      query: (uf) => `/estados/${uf}/municipios`,
    }),
  }),
});

export const { useGetMunicipiosPorUfQuery } = ibgeApi;
