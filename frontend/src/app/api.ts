import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { logout, selectToken, AuthUser } from './authSlice';
import { API_BASE_URL } from '../config/apiBaseUrl';

export interface Produtor {
  id: string;
  cpfCnpj: string;
  nome: string;
  propriedades?: Propriedade[];
}

export interface Propriedade {
  id: string;
  produtorId: string;
  nome: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
  produtor?: Produtor;
}

export interface Safra {
  id: string;
  nome: string;
}

export interface Cultura {
  id: string;
  nome: string;
}

export interface CulturaPlantada {
  id: string;
  propriedadeId: string;
  safraId: string;
  culturaId: string;
  safra?: Safra;
  cultura?: Cultura;
}

export interface DashboardResumo {
  totalFazendas: number;
  totalHectares: number;
}

export interface DistribuicaoPorEstado {
  estado: string;
  total: number;
}

export interface DistribuicaoPorCultura {
  cultura: string;
  total: number;
}

export interface UsoDoSolo {
  areaAgricultavel: number;
  areaVegetacao: number;
}

export interface CityGeocode {
  lat: number;
  lng: number;
  radiusDeg: number;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectToken(getState() as RootState);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Produtor', 'Propriedade', 'Safra', 'Cultura', 'CulturaPlantada', 'Dashboard'],
  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string; usuario: AuthUser }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),

    getProdutores: builder.query<Produtor[], void>({
      query: () => '/produtores',
      providesTags: ['Produtor'],
    }),
    createProdutor: builder.mutation<Produtor, { cpfCnpj: string; nome: string }>({
      query: (body) => ({ url: '/produtores', method: 'POST', body }),
      invalidatesTags: ['Produtor'],
    }),
    updateProdutor: builder.mutation<Produtor, { id: string; cpfCnpj: string; nome: string }>({
      query: ({ id, ...body }) => ({ url: `/produtores/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Produtor'],
    }),
    deleteProdutor: builder.mutation<void, string>({
      query: (id) => ({ url: `/produtores/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Produtor'],
    }),

    getPropriedades: builder.query<Propriedade[], void>({
      query: () => '/propriedades',
      providesTags: ['Propriedade'],
    }),
    createPropriedade: builder.mutation<
      Propriedade,
      {
        produtorId: string;
        nome: string;
        cidade: string;
        estado: string;
        areaTotal: number;
        areaAgricultavel: number;
        areaVegetacao: number;
      }
    >({
      query: (body) => ({ url: '/propriedades', method: 'POST', body }),
      invalidatesTags: ['Propriedade', 'Dashboard'],
    }),
    updatePropriedade: builder.mutation<
      Propriedade,
      {
        id: string;
        produtorId: string;
        nome: string;
        cidade: string;
        estado: string;
        areaTotal: number;
        areaAgricultavel: number;
        areaVegetacao: number;
      }
    >({
      query: ({ id, ...body }) => ({ url: `/propriedades/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Propriedade', 'Dashboard'],
    }),
    deletePropriedade: builder.mutation<void, string>({
      query: (id) => ({ url: `/propriedades/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Propriedade', 'Dashboard'],
    }),

    getSafras: builder.query<Safra[], void>({
      query: () => '/safras',
      providesTags: ['Safra'],
    }),
    createSafra: builder.mutation<Safra, { nome: string }>({
      query: (body) => ({ url: '/safras', method: 'POST', body }),
      invalidatesTags: ['Safra'],
    }),
    updateSafra: builder.mutation<Safra, { id: string; nome: string }>({
      query: ({ id, ...body }) => ({ url: `/safras/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Safra'],
    }),
    deleteSafra: builder.mutation<void, string>({
      query: (id) => ({ url: `/safras/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Safra'],
    }),

    getCulturas: builder.query<Cultura[], void>({
      query: () => '/culturas',
      providesTags: ['Cultura'],
    }),
    createCultura: builder.mutation<Cultura, { nome: string }>({
      query: (body) => ({ url: '/culturas', method: 'POST', body }),
      invalidatesTags: ['Cultura'],
    }),
    updateCultura: builder.mutation<Cultura, { id: string; nome: string }>({
      query: ({ id, ...body }) => ({ url: `/culturas/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Cultura'],
    }),
    deleteCultura: builder.mutation<void, string>({
      query: (id) => ({ url: `/culturas/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Cultura'],
    }),

    getCulturasPlantadas: builder.query<CulturaPlantada[], string>({
      query: (propriedadeId) => `/propriedades/${propriedadeId}/culturas-plantadas`,
      providesTags: ['CulturaPlantada'],
    }),
    createCulturaPlantada: builder.mutation<
      CulturaPlantada,
      { propriedadeId: string; safraId: string; culturaId: string }
    >({
      query: (body) => ({ url: '/culturas-plantadas', method: 'POST', body }),
      invalidatesTags: ['CulturaPlantada', 'Dashboard'],
    }),
    deleteCulturaPlantada: builder.mutation<void, string>({
      query: (id) => ({ url: `/culturas-plantadas/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CulturaPlantada', 'Dashboard'],
    }),

    // `estado` filtra o recorte (cross-filtering: clicar numa fatia de
    // "por estado" recorta os outros gráficos) — `por-estado` em si nunca
    // filtra, é sempre a visão completa de onde o filtro é escolhido.
    getDashboardResumo: builder.query<DashboardResumo, string | void>({
      query: (estado) => ({ url: '/dashboard/resumo', params: estado ? { estado } : undefined }),
      providesTags: ['Dashboard'],
    }),
    getDashboardPorEstado: builder.query<DistribuicaoPorEstado[], void>({
      query: () => '/dashboard/por-estado',
      providesTags: ['Dashboard'],
    }),
    getDashboardPorCultura: builder.query<DistribuicaoPorCultura[], string | void>({
      query: (estado) => ({ url: '/dashboard/por-cultura', params: estado ? { estado } : undefined }),
      providesTags: ['Dashboard'],
    }),
    getDashboardUsoDoSolo: builder.query<UsoDoSolo, string | void>({
      query: (estado) => ({ url: '/dashboard/uso-do-solo', params: estado ? { estado } : undefined }),
      providesTags: ['Dashboard'],
    }),

    // Geocodificação aproximada do município (via backend, que repassa ao
    // Nominatim) — usada só pra posicionar o talhão fictício da propriedade
    // dentro do território real da cidade cadastrada.
    getCityGeocode: builder.query<CityGeocode | null, { cidade: string; uf: string }>({
      query: ({ cidade, uf }) => ({ url: '/geocoding/municipio', params: { cidade, uf } }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProdutoresQuery,
  useCreateProdutorMutation,
  useUpdateProdutorMutation,
  useDeleteProdutorMutation,
  useGetPropriedadesQuery,
  useCreatePropriedadeMutation,
  useUpdatePropriedadeMutation,
  useDeletePropriedadeMutation,
  useGetSafrasQuery,
  useCreateSafraMutation,
  useUpdateSafraMutation,
  useDeleteSafraMutation,
  useGetCulturasQuery,
  useCreateCulturaMutation,
  useUpdateCulturaMutation,
  useDeleteCulturaMutation,
  useGetCulturasPlantadasQuery,
  useCreateCulturaPlantadaMutation,
  useDeleteCulturaPlantadaMutation,
  useGetDashboardResumoQuery,
  useGetDashboardPorEstadoQuery,
  useGetDashboardPorCulturaQuery,
  useGetDashboardUsoDoSoloQuery,
  useGetCityGeocodeQuery,
} = api;
