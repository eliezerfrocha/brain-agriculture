import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCreateProdutorMutation, useUpdateProdutorMutation, Produtor } from '../../app/api';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ErrorText } from '../atoms/Text';
import { FormStack, FormRow, ButtonRow } from '../atoms/FormLayout';
import { maskCpfCnpjInput, formatCpfCnpj } from '../../utils/formatDocument';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import { useToast } from '../../app/ToastProvider';

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
`;

const FALLBACK_ERROR = 'Não foi possível salvar o produtor.';

interface ProdutorFormProps {
  /** Presente = editando um produtor existente; ausente = cadastro novo. */
  editing?: Produtor | null;
  onDone?: () => void;
}

export function ProdutorForm({ editing, onDone }: ProdutorFormProps) {
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [nome, setNome] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [createProdutor, { isLoading: isCreating, error: createError }] = useCreateProdutorMutation();
  const [updateProdutor, { isLoading: isUpdating, error: updateError }] = useUpdateProdutorMutation();
  const showToast = useToast();

  useEffect(() => {
    if (editing) {
      setCpfCnpj(formatCpfCnpj(editing.cpfCnpj));
      setNome(editing.nome);
      setSubmitted(false);
    } else {
      setCpfCnpj('');
      setNome('');
    }
  }, [editing]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!cpfCnpj.trim() || !nome.trim()) {
      showToast('error', 'Preencha os campos obrigatórios.');
      return;
    }

    try {
      const payload = { cpfCnpj: cpfCnpj.replace(/\D/g, ''), nome };
      if (editing) {
        await updateProdutor({ id: editing.id, ...payload }).unwrap();
        showToast('success', 'Produtor atualizado com sucesso.');
      } else {
        await createProdutor(payload).unwrap();
        showToast('success', 'Produtor cadastrado com sucesso.');
      }
      setCpfCnpj('');
      setNome('');
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
      {!editing && <SectionTitle>Novo produtor</SectionTitle>}
      <FormRow $columns="1fr 2fr">
        <FormField
          label="CPF ou CNPJ"
          htmlFor="cpfCnpj"
          error={submitted && !cpfCnpj.trim() ? 'Campo obrigatório' : undefined}
        >
          <Input
            id="cpfCnpj"
            inputMode="numeric"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(maskCpfCnpjInput(e.target.value))}
            placeholder="000.000.000-00"
          />
        </FormField>
        <FormField
          label="Nome"
          htmlFor="nome"
          error={submitted && !nome.trim() ? 'Campo obrigatório' : undefined}
        >
          <Input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do produtor"
          />
        </FormField>
      </FormRow>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      <ButtonRow>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Cadastrar produtor'}
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
