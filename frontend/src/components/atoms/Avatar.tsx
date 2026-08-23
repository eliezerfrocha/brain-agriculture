import styled, { useTheme } from 'styled-components';
import { colorFromString } from '../../utils/colorFromString';

const Circle = styled.div<{ $size: number; $color: string }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: ${({ $size }) => $size * 0.4}px;
  font-weight: 600;
`;

function getInitials(nome: string): string {
  const words = nome.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  nome: string;
  size?: number;
}

export function Avatar({ nome, size = 32 }: AvatarProps) {
  const theme = useTheme();
  return (
    <Circle $size={size} $color={colorFromString(nome, theme.chartColors)}>
      {getInitials(nome)}
    </Circle>
  );
}
