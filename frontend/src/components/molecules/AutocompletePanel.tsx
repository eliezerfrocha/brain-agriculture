import styled from 'styled-components';

// Peças visuais compartilhadas por todo campo de busca-com-sugestões
// (UF, cidade) — só a lista de opções muda entre eles.
export const AutocompleteWrapper = styled.div`
  position: relative;
`;

export const AutocompleteList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  z-index: 20;
  animation: autocomplete-in 0.15s ease-out;

  @keyframes autocomplete-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const AutocompleteOption = styled.li`
  padding: 0.5rem 0.6rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const AutocompleteEmptyOption = styled.li`
  padding: 0.5rem 0.6rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
