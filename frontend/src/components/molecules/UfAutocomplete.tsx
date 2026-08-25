import { useEffect, useMemo, useState } from 'react';
import { Input } from '../atoms/Input';
import { UF_NAMES, getUfName } from '../../utils/ufNames';
import { normalizeText } from '../../utils/normalizeText';
import {
  AutocompleteWrapper,
  AutocompleteList,
  AutocompleteOption,
  AutocompleteEmptyOption,
} from './AutocompletePanel';

const ufEntries = Object.entries(UF_NAMES).sort((a, b) => a[1].localeCompare(b[1]));

interface UfAutocompleteProps {
  id: string;
  /** Sigla da UF (ex.: "PR") — é o que o formulário guarda e envia pra API. */
  value: string;
  onChange: (uf: string) => void;
}

// Igual ao CityAutocomplete na interação (busca por nome ou sigla), mas a
// lista é fixa (27 UFs) em vez de vir de uma API, e só aceita seleção — não
// faz sentido salvar uma UF que não existe, então não permite texto livre.
export function UfAutocomplete({ id, value, onChange }: UfAutocompleteProps) {
  const [query, setQuery] = useState(value ? getUfName(value) : '');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(value ? getUfName(value) : '');
  }, [value]);

  const options = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return ufEntries;
    return ufEntries.filter(
      ([sigla, nome]) =>
        normalizeText(nome).includes(normalizedQuery) || normalizeText(sigla).includes(normalizedQuery),
    );
  }, [query]);

  function handleSelect(sigla: string, nome: string) {
    setQuery(nome);
    onChange(sigla);
    setIsOpen(false);
  }

  return (
    <AutocompleteWrapper>
      <Input
        id={id}
        value={query}
        autoComplete="off"
        placeholder="Digite para buscar"
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() =>
          setTimeout(() => {
            setIsOpen(false);
            setQuery(value ? getUfName(value) : '');
          }, 120)
        }
      />
      {isOpen && (
        <AutocompleteList>
          {options.length > 0 ? (
            options.map(([sigla, nome]) => (
              <AutocompleteOption key={sigla} onMouseDown={() => handleSelect(sigla, nome)}>
                {nome}
              </AutocompleteOption>
            ))
          ) : (
            <AutocompleteEmptyOption>Nenhum estado encontrado.</AutocompleteEmptyOption>
          )}
        </AutocompleteList>
      )}
    </AutocompleteWrapper>
  );
}
