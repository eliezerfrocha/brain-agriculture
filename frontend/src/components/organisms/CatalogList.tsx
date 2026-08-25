import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { LoadingState, EmptyState } from '../molecules/StatusMessage';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { ButtonRow } from '../atoms/FormLayout';
import { useToast } from '../../app/ToastProvider';

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 320px;
  table-layout: fixed;
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

  /* Largura fixa pra coluna de ações — sem isso, o <Input> da linha em edição
     alarga a coluna do nome e empurra os botões (posição diferente de
     Editar/Remover pra Salvar/Cancelar). Com table-layout:fixed a largura
     nunca muda, edite ou não. */
  th:last-child,
  td:last-child {
    width: 230px;
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

interface CatalogItem {
  id: string;
  nome: string;
}

interface CatalogListProps {
  items: CatalogItem[] | undefined;
  isLoading: boolean;
  emptyLabel: string;
  /** Rótulo da coluna na tabela, ex.: "Safra", "Cultura". */
  columnLabel: string;
  /** Nome do item em minúsculo pras mensagens de feedback, ex.: "safra", "cultura".
   * Assume concordância feminina ("a safra", "a cultura") — os dois únicos usos
   * de hoje são substantivos femininos; se um terceiro masculino aparecer, isso
   * precisa virar uma mensagem passada de fora, como já é no CatalogForm. */
  itemLabel: string;
  onUpdate: (id: string, nome: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
}

export function CatalogList({
  items,
  isLoading,
  emptyLabel,
  columnLabel,
  itemLabel,
  onUpdate,
  onDelete,
}: CatalogListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNome, setEditingNome] = useState('');
  const [toDelete, setToDelete] = useState<CatalogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const showToast = useToast();

  if (isLoading) return <LoadingState />;
  if (!items?.length) return <EmptyState label={emptyLabel} />;

  function startEdit(item: CatalogItem) {
    setEditingId(item.id);
    setEditingNome(item.nome);
  }

  async function confirmEdit(id: string) {
    if (!editingNome.trim()) return;
    try {
      await onUpdate(id, editingNome.trim());
      setEditingId(null);
      showToast('success', `${capitalize(itemLabel)} atualizada com sucesso.`);
    } catch {
      showToast('error', `Não foi possível atualizar a ${itemLabel}.`);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(toDelete.id);
      setToDelete(null);
      showToast('success', `${capitalize(itemLabel)} removida com sucesso.`);
    } catch {
      showToast('error', `Não foi possível remover a ${itemLabel}.`);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <th>{columnLabel}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td>
                      <Input
                        value={editingNome}
                        onChange={(e) => setEditingNome(e.target.value)}
                        autoFocus
                      />
                    </td>
                    <td>
                      <ButtonRow>
                        <Button onClick={() => confirmEdit(item.id)}>Salvar</Button>
                        <Button $variant="ghost" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </ButtonRow>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.nome}</td>
                    <td>
                      <ButtonRow>
                        <Button $variant="edit" onClick={() => startEdit(item)}>
                          Editar
                        </Button>
                        <Button $variant="danger" onClick={() => setToDelete(item)}>
                          Remover
                        </Button>
                      </ButtonRow>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>

      {toDelete && (
        <ConfirmDialog
          title={`Remover ${itemLabel}`}
          message={`Tem certeza que deseja remover a ${itemLabel} "${toDelete.nome}"? Essa ação não pode ser desfeita.`}
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
