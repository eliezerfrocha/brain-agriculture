import { useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import type { PieCustomLayerProps, PieTooltipProps } from '@nivo/pie';
import styled, { useTheme } from 'styled-components';
import { Card } from '../atoms/Card';
import { Muted } from '../atoms/Text';
import { numberFormatter } from '../../utils/formatters';

const Title = styled.h3`
  margin: 0 0 1rem;
  font-size: 1rem;
`;

const ChartArea = styled.div<{ $clickable: boolean }>`
  height: 220px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
`;

const LegendRow = styled.div<{ $active?: boolean; $clickable?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.8rem;
  padding: 0.3rem 0.4rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  background: ${({ theme, $active }) => ($active ? theme.colors.background : 'transparent')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: background-color 0.12s ease;
`;

const LegendLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Dot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const LegendValue = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  flex-shrink: 0;
`;

const TooltipBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

export interface PieChartDatum {
  name: string;
  value: number;
  /** Valor "cru" usado pra filtrar (ex.: sigla da UF) — quando presente, a fatia vira clicável. */
  filterKey?: string;
}

interface NivoDatum {
  id: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title: string;
  data: PieChartDatum[];
  /** Unidade exibida no rótulo central e na legenda, ex.: "ha", "fazendas". */
  unit?: string;
  /** Presente quando as fatias filtram outros gráficos (ver DashboardCharts). */
  onSliceClick?: (filterKey: string) => void;
  /** filterKey da fatia selecionada externamente, pra destacá-la mesmo sem hover. */
  selectedFilterKey?: string | null;
}

export function PieChartCard({
  title,
  data,
  unit,
  onSliceClick,
  selectedFilterKey,
}: PieChartCardProps) {
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = total > 0;
  const isClickable = Boolean(onSliceClick) && data.some((d) => d.filterKey);

  const selectedName = selectedFilterKey
    ? data.find((d) => d.filterKey === selectedFilterKey)?.name
    : undefined;
  const activeId = hoveredId ?? selectedName ?? null;

  const nivoData: NivoDatum[] = data.map((item, index) => ({
    id: item.name,
    value: item.value,
    color: theme.chartColors[index % theme.chartColors.length],
  }));

  function handleSliceSelect(name: string) {
    const item = data.find((d) => d.name === name);
    if (item?.filterKey && onSliceClick) onSliceClick(item.filterKey);
  }

  function CenteredMetric({ centerX, centerY }: PieCustomLayerProps<NivoDatum>) {
    return (
      <g>
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 22, fontWeight: 700, fill: theme.colors.text }}
        >
          {numberFormatter.format(total)}
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 11, fill: theme.colors.textMuted }}
        >
          {unit ?? 'total'}
        </text>
      </g>
    );
  }

  function ChartTooltip({ datum }: PieTooltipProps<NivoDatum>) {
    return (
      <TooltipBox>
        <strong>{datum.id}</strong>: {datum.value.toLocaleString('pt-BR')}
      </TooltipBox>
    );
  }

  return (
    <Card>
      <Title>{title}</Title>
      {hasData ? (
        <>
          <ChartArea $clickable={isClickable}>
            <ResponsivePie
              data={nivoData}
              colors={{ datum: 'data.color' }}
              margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              innerRadius={0.65}
              padAngle={2}
              cornerRadius={6}
              borderWidth={2}
              borderColor={theme.colors.surface}
              activeId={activeId}
              onActiveIdChange={(id) => setHoveredId(id as string | null)}
              onClick={(datum) => handleSliceSelect(datum.id as string)}
              activeOuterRadiusOffset={6}
              enableArcLabels={false}
              enableArcLinkLabels={false}
              legends={[]}
              tooltip={ChartTooltip}
              layers={['arcs', CenteredMetric]}
              animate
              motionConfig="gentle"
            />
          </ChartArea>
          <LegendList>
            {data.map((item, index) => (
              <LegendRow
                key={item.name}
                $active={activeId === item.name}
                $clickable={Boolean(item.filterKey && onSliceClick)}
                onMouseEnter={() => setHoveredId(item.name)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSliceSelect(item.name)}
              >
                <LegendLabel>
                  <Dot $color={theme.chartColors[index % theme.chartColors.length]} />
                  {item.name}
                </LegendLabel>
                <LegendValue>
                  {numberFormatter.format(item.value)}
                  {unit ? ` ${unit}` : ''} · {((item.value / total) * 100).toFixed(0)}%
                </LegendValue>
              </LegendRow>
            ))}
          </LegendList>
        </>
      ) : (
        <Muted>Sem dados suficientes ainda.</Muted>
      )}
    </Card>
  );
}
