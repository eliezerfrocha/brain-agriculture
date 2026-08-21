import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { ErrorText } from '../atoms/Text';
import { extractErrorMessage } from '../../utils/extractErrorMessage';
import { useToast } from '../../app/ToastProvider';

// Formulário de uma linha só (rótulo + campo + botão) usado por Safras e
// Culturas — bem mais simples que os outros forms, por isso não usa o
// FormStack/FormRow compartilhado (que assume campos empilhados).
const InlineForm = styled.form`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const FieldWrap = styled.div`
  flex: 1;
  max-width: 360px;
`;

const FALLBACK_ERROR = 'Não foi possível concluir a operação.';

interface CatalogFormProps {
  label: string;
  placeholder: string;
  successMessage: string;
  onCreate: (nome: string) => Promise<unknown>;
}

export function CatalogForm({ label, placeholder, successMessage, onCreate }: CatalogFormProps) {
  const [nome, setNome] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const showToast = useToast();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!nome.trim()) {
      showToast('error', 'Preencha os campos obrigatórios.');
      return;
    }

    try {
      setError(null);
      await onCreate(nome.trim());
      setNome('');
      setSubmitted(false);
      showToast('success', successMessage);
    } catch (err) {
      setError(err);
      showToast('error', extractErrorMessage(err, FALLBACK_ERROR) ?? FALLBACK_ERROR);
    }
  }

  const errorMessage = extractErrorMessage(error, FALLBACK_ERROR);

  return (
    <div>
      <InlineForm onSubmit={handleSubmit}>
        <FieldWrap>
          <FormField
            label={label}
            htmlFor="catalog-nome"
            error={submitted && !nome.trim() ? 'Campo obrigatório' : undefined}
          >
            <Input
              id="catalog-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={placeholder}
            />
          </FormField>
        </FieldWrap>
        <Button type="submit">Adicionar</Button>
      </InlineForm>
      {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    </div>
  );
}
