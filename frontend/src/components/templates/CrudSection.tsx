import { ReactNode } from 'react';
import styled from 'styled-components';
import { Card } from '../atoms/Card';
import { PageHeader } from '../molecules/PageHeader';

const FormCard = styled(Card)`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
`;

const SectionNote = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface CrudSectionProps {
  title: string;
  subtitle: string;
  form: ReactNode;
  listTitle: string;
  listNote?: string;
  list: ReactNode;
}

/**
 * Layout padrão das telas de cadastro: cabeçalho + card de formulário no topo,
 * seguido da listagem em largura total. Usado por Produtores, Propriedades,
 * Safras e Culturas pra manter a mesma estrutura visual entre as telas.
 */
export function CrudSection({ title, subtitle, form, listTitle, listNote, list }: CrudSectionProps) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <FormCard>{form}</FormCard>
      <SectionTitle style={{ marginBottom: listNote ? '0.25rem' : '1rem' }}>{listTitle}</SectionTitle>
      {listNote && <SectionNote>{listNote}</SectionNote>}
      {list}
    </div>
  );
}
