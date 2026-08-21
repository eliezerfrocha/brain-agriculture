import styled, { css } from 'styled-components';

export const Button = styled.button<{ $variant?: 'primary' | 'edit' | 'danger' | 'ghost'; $fullWidth?: boolean }>`
  padding: 0.65rem 1.4rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  transition: background-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.97) translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ theme, $variant = 'primary' }) => {
    if ($variant === 'danger') {
      return css`
        background: ${theme.colors.dangerBg};
        color: ${theme.colors.danger};

        &:hover:not(:disabled) {
          background: ${theme.colors.danger};
          color: white;
        }
      `;
    }
    if ($variant === 'edit') {
      return css`
        background: ${theme.colors.primarySoft};
        color: ${theme.colors.primary};

        &:hover:not(:disabled) {
          background: ${theme.colors.primary};
          color: white;
        }
      `;
    }
    if ($variant === 'ghost') {
      return css`
        background: transparent;
        color: ${theme.colors.text};
        border-color: ${theme.colors.borderStrong};

        &:hover:not(:disabled) {
          background: ${theme.colors.background};
        }
      `;
    }
    return css`
      background: ${theme.colors.primary};
      color: white;

      &:hover:not(:disabled) {
        background: ${theme.colors.primaryHover};
        box-shadow: 0 4px 12px ${theme.colors.primarySoft};
      }

      &:active:not(:disabled) {
        background: ${theme.colors.primaryActive};
      }
    `;
  }}
`;
