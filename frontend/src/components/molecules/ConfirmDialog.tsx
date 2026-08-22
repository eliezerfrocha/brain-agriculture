import styled from 'styled-components';
import { Modal } from '../templates/Modal';
import { Button } from '../atoms/Button';
import { ButtonRow } from '../atoms/FormLayout';

const Message = styled.p`
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Remover',
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <Message>{message}</Message>
      <ButtonRow>
        <Button $variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Removendo...' : confirmLabel}
        </Button>
        <Button type="button" $variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </ButtonRow>
    </Modal>
  );
}
