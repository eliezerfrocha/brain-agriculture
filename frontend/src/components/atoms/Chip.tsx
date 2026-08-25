import styled from 'styled-components';

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  animation: chip-pop-in 0.18s ease-out;

  @keyframes chip-pop-in {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const ChipRemove = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  line-height: 1;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;
