import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0 0 0.2rem;
`;

const Subtitle = styled.p`
  margin: 0 0 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
`;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </>
  );
}
