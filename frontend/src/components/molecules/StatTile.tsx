import { ReactNode } from 'react';
import styled from 'styled-components';
import { Card } from '../atoms/Card';

const Tile = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const IconWrap = styled.div<{ $accent: string }>`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $accent }) => `${$accent}1a`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $accent }) => $accent};
  flex-shrink: 0;
`;

const LabelText = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Value = styled.div`
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

interface StatTileProps {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
}

export function StatTile({ label, value, icon, accent }: StatTileProps) {
  return (
    <Tile>
      <Header>
        <IconWrap $accent={accent}>{icon}</IconWrap>
        <LabelText>{label}</LabelText>
      </Header>
      <Value>{value}</Value>
    </Tile>
  );
}
