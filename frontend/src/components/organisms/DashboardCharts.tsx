import { useState } from 'react';
import styled from 'styled-components';
import {
  useGetDashboardResumoQuery,
  useGetDashboardPorEstadoQuery,
  useGetDashboardPorCulturaQuery,
  useGetDashboardUsoDoSoloQuery,
} from '../../app/api';
import { StatTile } from '../molecules/StatTile';
import { PieChartCard } from '../molecules/PieChartCard';
import { LoadingState } from '../molecules/StatusMessage';
import { getUfName } from '../../utils/ufNames';
import { numberFormatter } from '../../utils/formatters';
import { theme } from '../../styles/theme';
import { media } from '../../styles/breakpoints';

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FilterChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const ClearFilterButton = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const VerticalDivider = styled.div`
  align-self: stretch;
  width: 1px;
  background: ${({ theme }) => theme.colors.border};

  ${media.tablet} {
    display: none;
  }
`;

const Layout = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  ${media.tablet} {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const ChartsArea = styled.div`
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
  align-items: start;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const StatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 240px;
  min-width: 0;
  flex-shrink: 0;

  ${media.tablet} {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

function FarmIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 12h17M12 3.5v17" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function RatioIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 18L18 6M8 6h1M15 18h1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BroomIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M18 3L10 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path
        d="M10 11L4 20h10l1.5-3.5L10 11z"
        fill="currentColor"
        fillOpacity={0.85}
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M7 20l0.6-2.5M13 20l0.6-2.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardCharts() {
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);

  const { data: resumo, isLoading: loadingResumo } = useGetDashboardResumoQuery(
    estadoFiltro ?? undefined,
  );
  const { data: porEstado, isLoading: loadingEstado } = useGetDashboardPorEstadoQuery();
  const { data: porCultura, isLoading: loadingCultura } = useGetDashboardPorCulturaQuery(
    estadoFiltro ?? undefined,
  );
  const { data: usoDoSolo, isLoading: loadingUso } = useGetDashboardUsoDoSoloQuery(
    estadoFiltro ?? undefined,
  );

  const isLoading = loadingResumo || loadingEstado || loadingCultura || loadingUso;

  if (isLoading) {
    return <LoadingState label="Carregando dashboard..." />;
  }

  const totalFazendas = resumo?.totalFazendas ?? 0;
  const totalHectares = resumo?.totalHectares ?? 0;
  const mediaPorFazenda = totalFazendas > 0 ? totalHectares / totalFazendas : 0;

  function toggleEstadoFiltro(estado: string) {
    setEstadoFiltro((prev) => (prev === estado ? null : estado));
  }

  return (
    <>
      {estadoFiltro && (
        <FilterBar>
          Filtrando por:
          <FilterChip>{getUfName(estadoFiltro)}</FilterChip>
          <ClearFilterButton type="button" onClick={() => setEstadoFiltro(null)}>
            <BroomIcon />
            Limpar
          </ClearFilterButton>
        </FilterBar>
      )}
      <Layout>
        <ChartsArea>
          <PieChartCard
            title="Fazendas por estado"
            unit="fazendas"
            data={(porEstado ?? []).map((item) => ({
              name: getUfName(item.estado),
              value: item.total,
              filterKey: item.estado,
            }))}
            onSliceClick={toggleEstadoFiltro}
            selectedFilterKey={estadoFiltro}
          />
          <PieChartCard
            title="Plantios por cultura"
            unit="plantios"
            data={(porCultura ?? []).map((item) => ({ name: item.cultura, value: item.total }))}
          />
          <PieChartCard
            title="Uso do solo"
            unit="ha"
            data={[
              { name: 'Agricultável', value: usoDoSolo?.areaAgricultavel ?? 0 },
              { name: 'Vegetação', value: usoDoSolo?.areaVegetacao ?? 0 },
            ]}
          />
        </ChartsArea>
        <VerticalDivider />
        <StatsColumn>
          <StatTile
            label="Fazendas cadastradas"
            value={numberFormatter.format(totalFazendas)}
            icon={<FarmIcon />}
            accent={theme.chartColors[0]}
          />
          <StatTile
            label="Área total sob gestão"
            value={`${numberFormatter.format(totalHectares)} ha`}
            icon={<LandIcon />}
            accent={theme.chartColors[1]}
          />
          <StatTile
            label="Média por fazenda"
            value={`${numberFormatter.format(mediaPorFazenda)} ha`}
            icon={<RatioIcon />}
            accent={theme.chartColors[2]}
          />
        </StatsColumn>
      </Layout>
    </>
  );
}
