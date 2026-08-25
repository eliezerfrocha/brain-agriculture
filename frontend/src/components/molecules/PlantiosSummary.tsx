import { useGetCulturasPlantadasQuery } from '../../app/api';
import { Chip, ChipList } from '../atoms/Chip';
import { Muted } from '../atoms/Text';

interface PlantiosSummaryProps {
  propriedadeId: string;
}

/**
 * Lista só de leitura dos plantios da propriedade — usada no modal de
 * detalhes (map). Adicionar/remover plantio é feito no modal de edição
 * (ver PropertyPlantios, embutido no PropriedadeForm).
 */
export function PlantiosSummary({ propriedadeId }: PlantiosSummaryProps) {
  const { data: plantios, isLoading } = useGetCulturasPlantadasQuery(propriedadeId);

  if (isLoading) return <Muted>Carregando plantios...</Muted>;
  if (!plantios?.length) return <Muted>Nenhuma cultura plantada ainda.</Muted>;

  return (
    <ChipList>
      {plantios.map((plantio) => (
        <Chip key={plantio.id}>
          {plantio.cultura?.nome} · {plantio.safra?.nome}
        </Chip>
      ))}
    </ChipList>
  );
}
