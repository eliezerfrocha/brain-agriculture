import styled from 'styled-components';

// Acento de cor no nome da marca ("Brain Agriculture") — mesmo verde em toda
// tela que exibe o wordmark (sidebar e login), sem depender de um ícone.
export const BrandAccent = styled.span`
  color: ${({ theme }) => theme.chartColors[1]};
`;
