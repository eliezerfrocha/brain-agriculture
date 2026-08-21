import { ReactNode } from 'react';
import styled from 'styled-components';
import { Label, ErrorText } from '../atoms/Text';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FieldSlot = styled.div<{ $invalid?: boolean }>`
  ${({ $invalid, theme }) =>
    $invalid &&
    `
      animation: field-shake 0.4s ease-in-out;

      & input,
      & select,
      & textarea {
        border-color: ${theme.colors.danger} !important;
        box-shadow: 0 0 0 3px ${theme.colors.dangerBg} !important;
      }
    `}

  @keyframes field-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(3px);
    }
  }
`;

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <Wrapper>
      <Label htmlFor={htmlFor}>{label}</Label>
      <FieldSlot $invalid={!!error}>{children}</FieldSlot>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
