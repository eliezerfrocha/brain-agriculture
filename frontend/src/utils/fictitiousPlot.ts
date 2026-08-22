import { getUfCoordinates, getUfRegionRadiusDeg } from './ufCoordinates';

// Hash determinístico (cyrb53) — mesma entrada sempre gera o mesmo número.
function hashSeed(input: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FictitiousPlot {
  /** Centro aproximado (dentro do território do município + deslocamento determinístico). */
  center: [number, number];
  /** Vértices do polígono ilustrativo, em [lat, lng]. */
  polygon: [number, number][];
}

/** Centro + raio (graus) real do município, vindo de geocodificação (ver app/geocodingApi.ts). */
export interface CityRegion {
  lat: number;
  lng: number;
  radiusDeg: number;
}

/**
 * Gera um talhão fictício, porém estável (mesma propriedade => mesmo desenho),
 * dentro do território do município informado. Não representa a localização
 * real da fazenda — o cadastro não coleta latitude/longitude —, mas o
 * município em si é real: quando `cityRegion` vem de uma geocodificação bem
 * sucedida, o talhão fica dentro do território de verdade daquela cidade.
 *
 * Sem `cityRegion` (geocodificação ainda carregando, indisponível, ou cidade
 * não encontrada), cai de volta numa região aproximada dentro do estado,
 * proporcional à área real da UF — pra nunca ficar preso perto da capital
 * quando a cidade é longe dela.
 */
export function buildFictitiousPlot(
  propriedadeId: string,
  uf: string,
  cidade: string,
  areaTotal: number,
  cityRegion?: CityRegion | null,
): FictitiousPlot {
  const propertyRandom = mulberry32(hashSeed(propriedadeId));

  let cityLat: number;
  let cityLng: number;
  let cityRadiusDeg: number;

  if (cityRegion) {
    cityLat = cityRegion.lat;
    cityLng = cityRegion.lng;
    cityRadiusDeg = cityRegion.radiusDeg;
  } else {
    const cityRandom = mulberry32(hashSeed(`${uf.toUpperCase()}|${cidade.trim().toLowerCase()}`));
    const [baseLat, baseLng] = getUfCoordinates(uf);
    cityRadiusDeg = getUfRegionRadiusDeg(uf);
    const cityAngle = cityRandom() * Math.PI * 2;
    const cityDistance = cityRadiusDeg * Math.sqrt(cityRandom());
    cityLat = baseLat + cityDistance * Math.sin(cityAngle);
    cityLng = baseLng + cityDistance * Math.cos(cityAngle);
  }

  // Deslocamento por propriedade dentro do território da cidade — nos
  // arredores, não em cima do centro/malha urbana (uma fazenda não fica no
  // meio da cidade): a distância nunca fica abaixo de 55% do raio da região.
  const propertyOffsetRadius = cityRadiusDeg;
  const propertyAngle = propertyRandom() * Math.PI * 2;
  const propertyDistance = propertyOffsetRadius * (0.55 + 0.45 * propertyRandom());
  const centerLat = cityLat + propertyDistance * Math.sin(propertyAngle);
  const centerLng = cityLng + propertyDistance * Math.cos(propertyAngle);

  // Raio do talhão cresce com a área total (visual, não uma conversão real de ha).
  const baseRadiusDeg = 0.01 + Math.min(Math.sqrt(areaTotal) / 4000, 0.035);
  const latCorrection = Math.cos((centerLat * Math.PI) / 180);

  const vertexCount = 6 + Math.floor(propertyRandom() * 3); // 6 a 8 vértices
  const angleStep = (Math.PI * 2) / vertexCount;

  const polygon: [number, number][] = Array.from({ length: vertexCount }, (_, i) => {
    const jitterAngle = angleStep * i + (propertyRandom() - 0.5) * angleStep * 0.4;
    const radius = baseRadiusDeg * (0.7 + propertyRandom() * 0.6);
    const lat = centerLat + radius * Math.sin(jitterAngle);
    const lng = centerLng + (radius * Math.cos(jitterAngle)) / latCorrection;
    return [lat, lng];
  });

  return { center: [centerLat, centerLng], polygon };
}
