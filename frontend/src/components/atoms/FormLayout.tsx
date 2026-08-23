import styled from 'styled-components';
import { media } from '../../styles/breakpoints';

// Layout compartilhado por todos os formulários do sistema (Produtor, Propriedade,
// Login) — existia repetido em cada arquivo com espaçamentos levemente diferentes
// (0.5rem vs 0.75rem entre botões, por exemplo); ficou centralizado aqui.

/** Empilha os campos de um formulário verticalmente. */
export const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;

/** Linha de campos lado a lado, que colapsa para 1 coluna em telas pequenas. */
export const FormRow = styled.div<{ $columns?: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns ?? '1fr 1fr'};
  gap: 0.75rem;

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

/** Linha de botões (salvar/cancelar, editar/remover etc.). */
export const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;
