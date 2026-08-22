import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CloseIcon } from '../atoms/CloseIcon';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 100;
  animation: overlay-fade-in 0.15s ease-out;

  @keyframes overlay-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  width: 100%;
  max-width: 640px;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  animation: panel-in 0.18s ease-out;

  @keyframes panel-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.05rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.25rem;
  line-height: 0;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Body = styled.div`
  padding: 1.5rem;
`;

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <Overlay onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <Panel role="dialog" aria-modal="true" aria-label={title}>
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Overlay>,
    document.body,
  );
}
