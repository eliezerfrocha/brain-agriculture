import styled from 'styled-components';
import { numberFormatter } from '../../utils/formatters';

const Track = styled.div`
  display: flex;
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const Segment = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  transition: width 0.3s ease;
`;

const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Dot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  margin-right: 0.35rem;
`;

interface AreaUsageBarProps {
  areaAgricultavel: number;
  areaVegetacao: number;
  areaTotal: number;
}

export function AreaUsageBar({ areaAgricultavel, areaVegetacao, areaTotal }: AreaUsageBarProps) {
  const total = areaTotal || areaAgricultavel + areaVegetacao || 1;
  const agricultavelPct = (areaAgricultavel / total) * 100;
  const vegetacaoPct = (areaVegetacao / total) * 100;

  return (
    <div>
      <Track>
        <Segment $width={agricultavelPct} $color="#0071e3" />
        <Segment $width={vegetacaoPct} $color="#34c759" />
      </Track>
      <Legend>
        <span>
          <Dot $color="#0071e3" />
          Agricultável: {numberFormatter.format(areaAgricultavel)} ha
        </span>
        <span>
          <Dot $color="#34c759" />
          Vegetação: {numberFormatter.format(areaVegetacao)} ha
        </span>
      </Legend>
    </div>
  );
}
