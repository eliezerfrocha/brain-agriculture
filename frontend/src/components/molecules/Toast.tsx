import styled from 'styled-components';
import { CloseIcon } from '../atoms/CloseIcon';

export type ToastType = 'success' | 'error';

const ToastCard = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid
    ${({ theme, $type }) => ($type === 'success' ? theme.chartColors[1] : theme.colors.danger)};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  min-width: 260px;
  max-width: 360px;
  animation: toast-in 0.2s ease-out;

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const IconWrap = styled.div<{ $type: ToastType }>`
  color: ${({ theme, $type }) => ($type === 'success' ? theme.chartColors[1] : theme.colors.danger)};
  flex-shrink: 0;
  display: flex;
`;

const Message = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0;
  line-height: 0;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

function SuccessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5v5.5M12 16.3v.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  return (
    <ToastCard $type={type} role="status">
      <IconWrap $type={type}>{type === 'success' ? <SuccessIcon /> : <ErrorIcon />}</IconWrap>
      <Message>{message}</Message>
      <CloseButton type="button" onClick={onClose} aria-label="Fechar">
        <CloseIcon size={14} />
      </CloseButton>
    </ToastCard>
  );
}
