import { useEffect, useMemo, useState } from 'react';
import { Input } from '../atoms/Input';
import { useGetMunicipiosPorUfQuery } from '../../app/ibgeApi';
import { normalizeText } from '../../utils/normalizeText';
import {
  AutocompleteWrapper,
  AutocompleteList,
  AutocompleteOption,
  AutocompleteEmptyOption,
} from './AutocompletePanel';

interface CityAutocompleteProps {
  id: string;
  uf: string;
  value: string;
  onChange: (value: string) => void;
}

export function CityAutocomplete({ id, uf, value, onChange }: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const { data: municipios } = useGetMunicipiosPorUfQuery(uf, { skip: !uf });

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const options = useMemo(() => {
    if (!municipios) return [];
    const normalizedQuery = normalizeText(query);
    const filtered = normalizedQuery
      ? municipios.filter((m) => normalizeText(m.nome).includes(normalizedQuery))
      : municipios;
    return filtered.slice(0, 8);
  }, [municipios, query]);

  function handleSelect(nome: string) {
    setQuery(nome);
    onChange(nome);
    setIsOpen(false);
  }

  return (
    <AutocompleteWrapper>
      <Input
        id={id}
        value={query}
        autoComplete="off"
        placeholder={uf ? 'Digite para buscar' : 'Selecione a UF primeiro'}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
      />
      {isOpen && uf && (
        <AutocompleteList>
          {options.length > 0 ? (
            options.map((municipio) => (
              <AutocompleteOption key={municipio.id} onMouseDown={() => handleSelect(municipio.nome)}>
                {municipio.nome}
              </AutocompleteOption>
            ))
          ) : (
            <AutocompleteEmptyOption>
              Nenhuma cidade encontrada — pode digitar livremente.
            </AutocompleteEmptyOption>
          )}
        </AutocompleteList>
      )}
    </AutocompleteWrapper>
  );
}
