import styled from 'styled-components';
import { Propriedade } from '../../app/api';
import { numberFormatter } from '../../utils/formatters';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.5rem;
`;

const Nome = styled.h3`
  margin: 0;
  font-size: 0.95rem;
`;

const Local = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const AreaTotal = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
`;

interface PropertySummaryProps {
  propriedade: Pick<Propriedade, 'nome' | 'areaTotal' | 'cidade' | 'estado' | 'produtor'>;
}

/**
 * Cabeçalho de identificação da propriedade (nome, produtor, local, área) —
 * usado tanto no card da listagem quanto no modal de detalhes, garantindo o
 * mesmo alinhamento/visual nos dois lugares.
 */
export function PropertySummary({ propriedade }: PropertySummaryProps) {
  return (
    <Header>
      <div>
        <Nome>{propriedade.nome}</Nome>
        <Local>
          {propriedade.produtor?.nome ?? '—'} · {propriedade.cidade}/{propriedade.estado}
        </Local>
      </div>
      <AreaTotal>{numberFormatter.format(propriedade.areaTotal)} ha</AreaTotal>
    </Header>
  );
}
