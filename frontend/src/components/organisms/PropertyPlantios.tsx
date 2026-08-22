import { useState } from 'react';
import styled from 'styled-components';
import {
  useGetCulturasPlantadasQuery,
  useCreateCulturaPlantadaMutation,
  useDeleteCulturaPlantadaMutation,
  useGetSafrasQuery,
  useGetCulturasQuery,
} from '../../app/api';
import { Select } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ErrorText, Muted } from '../atoms/Text';
import { Chip, ChipList, ChipRemove } from '../atoms/Chip';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { CulturaPlantada } from '../../app/api';
import { useToast } from '../../app/ToastProvider';
import { extractErrorMessage } from '../../utils/extractErrorMessage';

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-align: left;
`;

const Chevron = styled.svg<{ $expanded: boolean }>`
  transition: transform 0.2s ease;
  transform: rotate(${({ $expanded }) => ($expanded ? 180 : 0)}deg);
`;

const Panel = styled.div`
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  animation: panel-drop-in 0.2s ease-out;

  @keyframes panel-drop-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// `div`, não `form` — este componente é embutido dentro do form de edição
// de propriedade (ver PropriedadeForm), e um <form> aninhado dentro de outro
// faz o evento de submit borbulhar e disparar o submit do form de fora
// também (fechando o modal sem avisar nada). O botão de adicionar usa
// onClick em vez de type="submit" por causa disso.
const InlineForm = styled.div`
  display: flex;
  gap: 0.4rem;
`;

interface PropertyPlantiosProps {
  propriedadeId: string;
  /** true = já abre expandido (ex.: dentro do modal de detalhes). */
  defaultExpanded?: boolean;
}

export function PropertyPlantios({ propriedadeId, defaultExpanded = false }: PropertyPlantiosProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [safraId, setSafraId] = useState('');
  const [culturaId, setCulturaId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: plantios, isLoading } = useGetCulturasPlantadasQuery(propriedadeId, {
    skip: !expanded,
  });
  const { data: safras } = useGetSafrasQuery(undefined, { skip: !expanded });
  const { data: culturas } = useGetCulturasQuery(undefined, { skip: !expanded });
  const [createPlantio, { isLoading: isCreating, error }] = useCreateCulturaPlantadaMutation();
  const [deletePlantio, { isLoading: isDeleting }] = useDeleteCulturaPlantadaMutation();
  const [toDelete, setToDelete] = useState<CulturaPlantada | null>(null);
  const showToast = useToast();

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deletePlantio(toDelete.id).unwrap();
      setToDelete(null);
      showToast('success', 'Plantio removido com sucesso.');
    } catch {
      showToast('error', 'Não foi possível remover o plantio.');
    }
  }

  async function handleAdd() {
    setSubmitted(true);
    if (!safraId || !culturaId) {
      showToast('error', 'Selecione safra e cultura.');
      return;
    }

    try {
      await createPlantio({ propriedadeId, safraId, culturaId }).unwrap();
      setSafraId('');
      setCulturaId('');
      setSubmitted(false);
      showToast('success', 'Plantio registrado com sucesso.');
    } catch (err) {
      showToast(
        'error',
        extractErrorMessage(err, 'Não foi possível salvar o plantio.') ?? 'Não foi possível salvar o plantio.',
      );
    }
  }

  return (
    <div>
      <Toggle type="button" onClick={() => setExpanded((v) => !v)}>
        {expanded ? 'Ocultar plantios' : 'Ver plantios'}
        <Chevron $expanded={expanded} width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </Chevron>
      </Toggle>

      {expanded && (
        <Panel>
          {isLoading && <Muted>Carregando plantios...</Muted>}

          {!isLoading && (
            <ChipList>
              {!plantios?.length && <Muted>Nenhuma cultura plantada ainda.</Muted>}
              {plantios?.map((plantio) => (
                <Chip key={plantio.id}>
                  {plantio.cultura?.nome} · {plantio.safra?.nome}
                  <ChipRemove type="button" onClick={() => setToDelete(plantio)} aria-label="Remover plantio">
                    ×
                  </ChipRemove>
                </Chip>
              ))}
            </ChipList>
          )}

          <InlineForm>
            <Select value={safraId} onChange={(e) => setSafraId(e.target.value)}>
              <option value="">Safra</option>
              {safras?.map((safra) => (
                <option key={safra.id} value={safra.id}>
                  {safra.nome}
                </option>
              ))}
            </Select>
            <Select value={culturaId} onChange={(e) => setCulturaId(e.target.value)}>
              <option value="">Cultura</option>
              {culturas?.map((cultura) => (
                <option key={cultura.id} value={cultura.id}>
                  {cultura.nome}
                </option>
              ))}
            </Select>
            <Button type="button" onClick={handleAdd} disabled={isCreating}>
              +
            </Button>
          </InlineForm>
          {submitted && (!safraId || !culturaId) && (
            <ErrorText>Selecione safra e cultura.</ErrorText>
          )}
          {extractErrorMessage(error, 'Não foi possível salvar o plantio.') && (
            <ErrorText>{extractErrorMessage(error, 'Não foi possível salvar o plantio.')}</ErrorText>
          )}
        </Panel>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Remover plantio"
          message={`Remover o plantio de "${toDelete.cultura?.nome}" na "${toDelete.safra?.nome}"?`}
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
