import { ReactNode } from 'react';
import styled from 'styled-components';

export const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorRow = styled.p`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
  animation: error-fade-in 0.2s ease-out;

  @keyframes error-fade-in {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function WarningIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M12 3.5l9.5 16.5H2.5L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <ErrorRow>
      <WarningIcon />
      {children}
    </ErrorRow>
  );
}

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
`;

/** Título de subseção discreto (ex.: "Plantios" dentro de um form/modal) —
 * mesmo estilo em qualquer lugar que precise agrupar um bloco de conteúdo. */
export const SectionLabel = styled.h3`
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;
