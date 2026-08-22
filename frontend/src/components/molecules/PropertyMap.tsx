import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import styled, { useTheme } from 'styled-components';
import 'leaflet/dist/leaflet.css';
import { buildFictitiousPlot } from '../../utils/fictitiousPlot';
import { useGetCityGeocodeQuery } from '../../app/api';

const MapWrapper = styled.div<{ $interactive: boolean }>`
  position: relative;
  z-index: 0;
  isolation: isolate;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  .leaflet-container {
    height: ${({ $interactive }) => ($interactive ? '440px' : '180px')};
    width: 100%;
    background: ${({ theme }) => theme.colors.background};
    font-family: ${({ theme }) => theme.font};
    /* "Congelado" (card): sem pan/zoom, então o cursor de mão do Leaflet
       só confundiria — mantém o ponteiro normal nesse modo. */
    cursor: ${({ $interactive }) => ($interactive ? 'grab' : 'default')};
  }

  .plot-glow {
    animation: plot-glow-pulse 2.6s ease-in-out infinite;
  }

  @keyframes plot-glow-pulse {
    0%,
    100% {
      filter: drop-shadow(0 0 1px ${({ theme }) => theme.colors.primary})
        drop-shadow(0 0 2px ${({ theme }) => theme.colors.primary});
    }
    50% {
      filter: drop-shadow(0 0 5px ${({ theme }) => theme.colors.primary})
        drop-shadow(0 0 10px ${({ theme }) => theme.colors.primary});
    }
  }
`;

const LoadingPlaceholder = styled.div<{ $interactive: boolean }>`
  height: ${({ $interactive }) => ($interactive ? '440px' : '180px')};
  background: ${({ theme }) => theme.colors.background};
`;

interface PropertyMapProps {
  propriedadeId: string;
  nome: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  /** true = pan/zoom livres (modal). false (padrão) = mapa "congelado", usado no card da listagem. */
  interactive?: boolean;
}

export function PropertyMap({
  propriedadeId,
  nome,
  cidade,
  estado,
  areaTotal,
  interactive = false,
}: PropertyMapProps) {
  const theme = useTheme();
  const { data: cityGeocode, isLoading: isGeocoding } = useGetCityGeocodeQuery(
    { cidade, uf: estado },
    { skip: !cidade || !estado },
  );

  // O `bounds` do MapContainer só é aplicado na montagem do mapa (Leaflet
  // não reajusta a câmera sozinho se ele mudar depois) — por isso espera a
  // geocodificação terminar antes de montar: montar cedo com o palpite
  // aproximado e trocar o polígono de lugar depois deixava a marcação fora
  // da área visível da câmera.
  if (isGeocoding) {
    return <LoadingPlaceholder $interactive={interactive} />;
  }

  const { polygon } = buildFictitiousPlot(propriedadeId, estado, cidade, areaTotal, cityGeocode);
  const bounds = polygon as LatLngBoundsExpression;

  return (
    <MapWrapper $interactive={interactive}>
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: [24, 24] }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Polygon
          positions={polygon}
          pathOptions={{
            className: 'plot-glow',
            color: theme.colors.primary,
            weight: 2,
            fillColor: theme.colors.primary,
            fillOpacity: 0.25,
            dashArray: '6 4',
          }}
        >
          <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent>
            {nome}
          </Tooltip>
        </Polygon>
      </MapContainer>
    </MapWrapper>
  );
}
