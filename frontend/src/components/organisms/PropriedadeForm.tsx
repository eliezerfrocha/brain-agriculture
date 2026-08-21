import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  useCreatePropriedadeMutation,
  useUpdatePropriedadeMutation,
  useGetProdutoresQuery,
  useGetSafrasQuery,
  useGetCulturasQuery,
  useCreateCulturaPlantadaMutation,
  Propriedade,
} from '../../app/api';
import { FormField } from '../molecules/FormField';
import { Input, Select } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ErrorText, Muted, SectionLabel } from '../atoms/Text';
import { Chip, ChipList, ChipRemove } from '../atoms/Chip';
import { FormStack, FormRow, ButtonRow } from '../atoms/FormLayout';
import { AreaUsageBar } from '../molecules/AreaUsageBar';
import { CityAutocomplete } from '../molecules/CityAutocomplete';
import { UfAutocomplete } from '../molecules/UfAutocomplete';
import { PropertyPlantios } from './PropertyPlantios';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import { useToast } from '../../app/ToastProvider';

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
`;

const FALLBACK_ERROR = 'Não foi possível salvar a propriedade.';

const emptyForm = {
  produtorId: '',
  nome: '',
  cidade: '',
  estado: '',
  areaTotal: '',
  areaAgricultavel: '',
  areaVegetacao: '',
};

interface PlantioStaging {
  safraId: string;
  culturaId: string;
}

interface PropriedadeFormProps {
  /** Presente = editando uma propriedade existente; ausente = cadastro novo. */
  editing?: Propriedade | null;
  onDone?: () => void;
}

export function PropriedadeForm({ editing, onDone }: PropriedadeFormProps) {
  const { data: produtores } = useGetProdutoresQuery();
  const { data: safras } = useGetSafrasQuery();
  const { data: culturas } = useGetCulturasQuery();
  const [createPropriedade, { isLoading: isCreating, error: createError }] =
    useCreatePropriedadeMutation();
  const [updatePropriedade, { isLoading: isUpdating, error: updateError }] =
    useUpdatePropriedadeMutation();
  const [createCulturaPlantada] = useCreateCulturaPlantadaMutation();
  const showToast = useToast();

  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  // Plantios escolhidos ainda no cadastro — só existe quando não está editando
  // (a propriedade ainda não tem id; os plantios são persistidos logo depois
  // que ela é criada). Editar plantios depois continua sendo feito na
  // listagem, em "Ver plantios".
  const [plantiosStaging, setPlantiosStaging] = useState<PlantioStaging[]>([]);
  const [stagingSafraId, setStagingSafraId] = useState('');
  const [stagingCulturaId, setStagingCulturaId] = useState('');

  useEffect(() => {
    if (editing) {
      setForm({
        produtorId: editing.produtorId,
        nome: editing.nome,
        cidade: editing.cidade,
        estado: editing.estado,
        areaTotal: String(editing.areaTotal),
        areaAgricultavel: String(editing.areaAgricultavel),
        areaVegetacao: String(editing.areaVegetacao),
      });
      setSubmitted(false);
    } else {
      setForm(emptyForm);
      setPlantiosStaging([]);
    }
  }, [editing]);

  const somaAreas = Number(form.areaAgricultavel || 0) + Number(form.areaVegetacao || 0);
  const excedeArea = form.areaTotal !== '' && somaAreas > Number(form.areaTotal);
  const mostrarUso = Number(form.areaTotal) > 0;

  const camposObrigatoriosFaltando =
    !form.produtorId || !form.nome.trim() || !form.cidade.trim() || !form.estado || !form.areaTotal;

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addPlantioStaging() {
    if (!stagingSafraId || !stagingCulturaId) return;
    const jaExiste = plantiosStaging.some(
      (p) => p.safraId === stagingSafraId && p.culturaId === stagingCulturaId,
    );
    if (!jaExiste) {
      setPlantiosStaging((prev) => [...prev, { safraId: stagingSafraId, culturaId: stagingCulturaId }]);
    }
    setStagingSafraId('');
    setStagingCulturaId('');
  }

  function removePlantioStaging(index: number) {
    setPlantiosStaging((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (camposObrigatoriosFaltando) {
      showToast('error', 'Preencha os campos obrigatórios.');
      return;
    }
    if (excedeArea) {
      showToast('error', 'Área agricultável + vegetação não pode ser maior que a área total.');
      return;
    }

    const payload = {
      produtorId: form.produtorId,
      nome: form.nome,
      cidade: form.cidade,
      estado: form.estado,
      areaTotal: Number(form.areaTotal),
      areaAgricultavel: Number(form.areaAgricultavel || 0),
      areaVegetacao: Number(form.areaVegetacao || 0),
    };

    try {
      if (editing) {
        await updatePropriedade({ id: editing.id, ...payload }).unwrap();
        showToast('success', 'Propriedade atualizada com sucesso.');
      } else {
        const novaPropriedade = await createPropriedade(payload).unwrap();
        showToast('success', 'Propriedade cadastrada com sucesso.');

        if (plantiosStaging.length > 0) {
          try {
            for (const plantio of plantiosStaging) {
              await createCulturaPlantada({
                propriedadeId: novaPropriedade.id,
                safraId: plantio.safraId,
                culturaId: plantio.culturaId,
              }).unwrap();
            }
          } catch {
            showToast(
              'error',
              'Propriedade cadastrada, mas houve um problema ao salvar os plantios — adicione-os na listagem.',
            );
          }
        }
      }
      setForm(emptyForm);
      setPlantiosStaging([]);
      setSubmitted(false);
      onDone?.();
    } catch (err) {
      showToast('error', extractErrorMessage(err, FALLBACK_ERROR) ?? FALLBACK_ERROR);
    }
  }

  const isLoading = isCreating || isUpdating;
  const error = editing ? updateError : createError;
  const errorMessage = extractErrorMessage(error, FALLBACK_ERROR);

  return (
    <FormStack onSubmit={handleSubmit}>
      {!editing && <SectionTitle>Nova propriedade</SectionTitle>}

      <FormRow $columns="1fr 2fr">
        <FormField
          label="Produtor"
          htmlFor="produtorId"
          error={submitted && !form.produtorId ? 'Campo obrigatório' : undefined}
        >
          <Select
            id="produtorId"
            value={form.produtorId}
            onChange={(e) => setField('produtorId', e.target.value)}
          >
            <option value="">Selecione um produtor</option>
            {produtores?.map((produtor) => (
              <option key={produtor.id} value={produtor.id}>
                {produtor.nome}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label="Nome da propriedade"
          htmlFor="nome"
          error={submitted && !form.nome.trim() ? 'Campo obrigatório' : undefined}
        >
          <Input id="nome" value={form.nome} onChange={(e) => setField('nome', e.target.value)} />
        </FormField>
      </FormRow>

      <FormRow $columns="1fr 2fr">
        <FormField
          label="UF"
          htmlFor="estado"
          error={submitted && !form.estado ? 'Campo obrigatório' : undefined}
        >
          <UfAutocomplete
            id="estado"
            value={form.estado}
            onChange={(uf) => {
              setField('estado', uf);
              setField('cidade', '');
            }}
          />
        </FormField>
        <FormField
          label="Cidade"
          htmlFor="cidade"
          error={submitted && !form.cidade.trim() ? 'Campo obrigatório' : undefined}
        >
          <CityAutocomplete
            id="cidade"
            uf={form.estado}
            value={form.cidade}
            onChange={(value) => setField('cidade', value)}
          />
        </FormField>
      </FormRow>

      <FormRow $columns="1fr 1fr 1fr">
        <FormField
          label="Área total (ha)"
          htmlFor="areaTotal"
          error={submitted && !form.areaTotal ? 'Campo obrigatório' : undefined}
        >
          <Input
            id="areaTotal"
            type="number"
            min={0}
            step="0.01"
            value={form.areaTotal}
            onChange={(e) => setField('areaTotal', e.target.value)}
          />
        </FormField>
        <FormField label="Área agricultável (ha)" htmlFor="areaAgricultavel">
          <Input
            id="areaAgricultavel"
            type="number"
            min={0}
            step="0.01"
            value={form.areaAgricultavel}
            onChange={(e) => setField('areaAgricultavel', e.target.value)}
          />
        </FormField>
        <FormField label="Área de vegetação (ha)" htmlFor="areaVegetacao">
          <Input
            id="areaVegetacao"
            type="number"
            min={0}
            step="0.01"
            value={form.areaVegetacao}
            onChange={(e) => setField('areaVegetacao', e.target.value)}
          />
        </FormField>
      </FormRow>

      {mostrarUso && (
        <AreaUsageBar
          areaAgricultavel={Number(form.areaAgricultavel || 0)}
          areaVegetacao={Number(form.areaVegetacao || 0)}
          areaTotal={Number(form.areaTotal)}
        />
      )}

      {excedeArea && (
        <ErrorText>
          Área agricultável + vegetação ({somaAreas}) não pode ser maior que a área total (
          {form.areaTotal}).
        </ErrorText>
      )}
      {!editing && (
        <div>
          <SectionLabel>Plantios (opcional)</SectionLabel>
          <Muted>Pode adicionar mais de um — safra e cultura, um plantio por vez.</Muted>
          <FormRow $columns="1fr 1fr auto" style={{ marginTop: '0.5rem' }}>
            <Select value={stagingSafraId} onChange={(e) => setStagingSafraId(e.target.value)}>
              <option value="">Safra</option>
              {safras?.map((safra) => (
                <option key={safra.id} value={safra.id}>
                  {safra.nome}
                </option>
              ))}
            </Select>
            <Select value={stagingCulturaId} onChange={(e) => setStagingCulturaId(e.target.value)}>
              <option value="">Cultura</option>
              {culturas?.map((cultura) => (
                <option key={cultura.id} value={cultura.id}>
                  {cultura.nome}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              onClick={addPlantioStaging}
              disabled={!stagingSafraId || !stagingCulturaId}
            >
              +
            </Button>
          </FormRow>
          {plantiosStaging.length > 0 && (
            <ChipList style={{ marginTop: '0.6rem' }}>
              {plantiosStaging.map((plantio, index) => (
                <Chip key={`${plantio.safraId}-${plantio.culturaId}`}>
                  {culturas?.find((c) => c.id === plantio.culturaId)?.nome} ·{' '}
                  {safras?.find((s) => s.id === plantio.safraId)?.nome}
                  <ChipRemove
                    type="button"
                    onClick={() => removePlantioStaging(index)}
                    aria-label="Remover plantio"
                  >
                    ×
                  </ChipRemove>
                </Chip>
              ))}
            </ChipList>
          )}
        </div>
      )}

      {editing && (
        <div>
          <SectionLabel>Plantios</SectionLabel>
          <PropertyPlantios propriedadeId={editing.id} defaultExpanded />
        </div>
      )}

      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

      <ButtonRow>
        <Button type="submit" disabled={isLoading || (submitted && excedeArea)}>
          {isLoading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar propriedade'}
        </Button>
        {editing && (
          <Button type="button" $variant="ghost" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </ButtonRow>
    </FormStack>
  );
}
