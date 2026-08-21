import { useState } from 'react';
import styled from 'styled-components';
import { useGetProdutoresQuery, useDeleteProdutorMutation, Produtor } from '../../app/api';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { LoadingState, EmptyState } from '../molecules/StatusMessage';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { ButtonRow } from '../atoms/FormLayout';
import { formatCpfCnpj } from '../../utils/formatDocument';
import { useToast } from '../../app/ToastProvider';

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 480px;
  border-collapse: collapse;

  th,
  td {
    text-align: left;
    padding: 0.6rem 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.9rem;
  }

  th {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  tbody tr {
    transition: background-color 0.15s ease;
    animation: row-fade-in 0.2s ease-out;
  }

  @keyframes row-fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  tbody tr:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const NomeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const Documento = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface ProdutoresTableProps {
  onEdit: (produtor: Produtor) => void;
}

export function ProdutoresTable({ onEdit }: ProdutoresTableProps) {
  const { data: produtores, isLoading } = useGetProdutoresQuery();
  const [deleteProdutor, { isLoading: isDeleting }] = useDeleteProdutorMutation();
  const [toDelete, setToDelete] = useState<Produtor | null>(null);
  const showToast = useToast();

  if (isLoading) return <LoadingState label="Carregando produtores..." />;
  if (!produtores?.length) return <EmptyState label="Nenhum produtor cadastrado ainda." />;

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deleteProdutor(toDelete.id).unwrap();
      setToDelete(null);
      showToast('success', 'Produtor removido com sucesso.');
    } catch {
      showToast('error', 'Não foi possível remover o produtor.');
    }
  }

  return (
    <>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Propriedades</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {produtores.map((produtor) => (
              <tr key={produtor.id}>
                <td>
                  <NomeCell>
                    <Avatar nome={produtor.nome} />
                    {produtor.nome}
                  </NomeCell>
                </td>
                <td>
                  <Documento>{formatCpfCnpj(produtor.cpfCnpj)}</Documento>
                </td>
                <td>{produtor.propriedades?.length ?? 0}</td>
                <td>
                  <ButtonRow>
                    <Button $variant="edit" onClick={() => onEdit(produtor)}>
                      Editar
                    </Button>
                    <Button $variant="danger" onClick={() => setToDelete(produtor)}>
                      Remover
                    </Button>
                  </ButtonRow>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>

      {toDelete && (
        <ConfirmDialog
          title="Remover produtor"
          message={`Tem certeza que deseja remover "${toDelete.nome}"? Essa ação não pode ser desfeita.`}
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
