import { useState } from 'react';
import styled from 'styled-components';
import { useGetPropriedadesQuery, useDeletePropriedadeMutation, Propriedade } from '../../app/api';
import { Button } from '../atoms/Button';
import { SectionLabel } from '../atoms/Text';
import { LoadingState, EmptyState } from '../molecules/StatusMessage';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { Modal } from '../templates/Modal';
import { PropertyMap } from '../molecules/PropertyMap';
import { AreaUsageBar } from '../molecules/AreaUsageBar';
import { PropertySummary } from '../molecules/PropertySummary';
import { PlantiosSummary } from '../molecules/PlantiosSummary';
import { ButtonRow } from '../atoms/FormLayout';
import { useToast } from '../../app/ToastProvider';
import { useLazyMount } from '../../utils/useLazyMount';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
`;

const PropertyCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: card-fade-in 0.25s ease-out;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-3px);
  }

  @keyframes card-fade-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

// Botão "invisível" por cima do mapa congelado (sem pan/zoom no card) — só
// pra abrir o mapa livre no modal. `all: unset` remove o estilo padrão de
// <button> e o próprio Leaflet cuida do cursor/visual por baixo.
const MapClickArea = styled.button`
  all: unset;
  display: block;
  width: 100%;
  cursor: pointer;
  position: relative;

  &:hover .map-badge {
    opacity: 1;
  }
`;

const MapBadge = styled.span`
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.55rem;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surfaceTranslucent};
  backdrop-filter: blur(4px);
  box-shadow: ${({ theme }) => theme.shadow.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
`;

const MapPlaceholder = styled.div`
  height: 180px;
  background: ${({ theme }) => theme.colors.background};
`;

const ModalDetails = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

interface PropertyCardItemProps {
  propriedade: Propriedade;
  onEdit: (propriedade: Propriedade) => void;
  onDelete: (propriedade: Propriedade) => void;
  onViewMap: (propriedade: Propriedade) => void;
}

// Card isolado num componente próprio pra poder usar `useLazyMount` por item
// (hooks não podem ser chamados dentro do `.map()` do componente pai).
function PropertyCardItem({ propriedade, onEdit, onDelete, onViewMap }: PropertyCardItemProps) {
  const [mapRef, shouldMountMap] = useLazyMount<HTMLButtonElement>();

  return (
    <PropertyCard>
      <MapClickArea
        ref={mapRef}
        type="button"
        onClick={() => onViewMap(propriedade)}
        aria-label={`Ver mapa de ${propriedade.nome}`}
      >
        {shouldMountMap ? (
          <PropertyMap
            propriedadeId={propriedade.id}
            nome={propriedade.nome}
            cidade={propriedade.cidade}
            estado={propriedade.estado}
            areaTotal={propriedade.areaTotal}
          />
        ) : (
          <MapPlaceholder />
        )}
        <MapBadge className="map-badge">Ver mapa</MapBadge>
      </MapClickArea>
      <CardBody>
        <PropertySummary propriedade={propriedade} />
        <AreaUsageBar
          areaAgricultavel={propriedade.areaAgricultavel}
          areaVegetacao={propriedade.areaVegetacao}
          areaTotal={propriedade.areaTotal}
        />
        <ButtonRow>
          <Button $variant="edit" onClick={() => onEdit(propriedade)}>
            Editar
          </Button>
          <Button $variant="danger" onClick={() => onDelete(propriedade)}>
            Remover
          </Button>
        </ButtonRow>
      </CardBody>
    </PropertyCard>
  );
}

interface PropriedadesTableProps {
  onEdit: (propriedade: Propriedade) => void;
}

export function PropriedadesTable({ onEdit }: PropriedadesTableProps) {
  const { data: propriedades, isLoading } = useGetPropriedadesQuery();
  const [deletePropriedade, { isLoading: isDeleting }] = useDeletePropriedadeMutation();
  const [toDelete, setToDelete] = useState<Propriedade | null>(null);
  const [viewingMap, setViewingMap] = useState<Propriedade | null>(null);
  const showToast = useToast();

  if (isLoading) return <LoadingState label="Carregando propriedades..." />;
  if (!propriedades?.length) return <EmptyState label="Nenhuma propriedade cadastrada ainda." />;

  async function confirmDelete() {
    if (!toDelete) return;
    try {
      await deletePropriedade(toDelete.id).unwrap();
      setToDelete(null);
      showToast('success', 'Propriedade removida com sucesso.');
    } catch {
      showToast('error', 'Não foi possível remover a propriedade.');
    }
  }

  return (
    <>
      <Grid>
        {propriedades.map((propriedade) => (
          <PropertyCardItem
            key={propriedade.id}
            propriedade={propriedade}
            onEdit={onEdit}
            onDelete={setToDelete}
            onViewMap={setViewingMap}
          />
        ))}
      </Grid>

      {toDelete && (
        <ConfirmDialog
          title="Remover propriedade"
          message={`Tem certeza que deseja remover "${toDelete.nome}"? Essa ação não pode ser desfeita.`}
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {viewingMap && (
        <Modal title={viewingMap.nome} onClose={() => setViewingMap(null)}>
          <PropertyMap
            propriedadeId={viewingMap.id}
            nome={viewingMap.nome}
            cidade={viewingMap.cidade}
            estado={viewingMap.estado}
            areaTotal={viewingMap.areaTotal}
            interactive
          />

          <ModalDetails>
            <PropertySummary propriedade={viewingMap} />
            <AreaUsageBar
              areaAgricultavel={viewingMap.areaAgricultavel}
              areaVegetacao={viewingMap.areaVegetacao}
              areaTotal={viewingMap.areaTotal}
            />
            <div>
              <SectionLabel>Plantios</SectionLabel>
              <PlantiosSummary propriedadeId={viewingMap.id} />
            </div>
          </ModalDetails>
        </Modal>
      )}
    </>
  );
}
