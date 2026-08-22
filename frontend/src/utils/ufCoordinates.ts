// Coordenadas aproximadas das capitais de cada UF — usadas apenas para centralizar
// o mapa da propriedade num ponto plausível do estado (não é geolocalização real
// da fazenda, já que o cadastro não coleta latitude/longitude).
export const UF_COORDINATES: Record<string, [number, number]> = {
  AC: [-9.97499, -67.8243],
  AL: [-9.66599, -35.735],
  AP: [0.034934, -51.0694],
  AM: [-3.10194, -60.025],
  BA: [-12.9714, -38.5014],
  CE: [-3.71722, -38.5433],
  DF: [-15.7797, -47.9297],
  ES: [-20.3155, -40.3128],
  GO: [-16.6869, -49.2648],
  MA: [-2.53874, -44.2825],
  MT: [-15.601, -56.0974],
  MS: [-20.4697, -54.6201],
  MG: [-19.9167, -43.9345],
  PA: [-1.45502, -48.5024],
  PB: [-7.11509, -34.8641],
  PR: [-25.4284, -49.2733],
  PE: [-8.04756, -34.877],
  PI: [-5.08921, -42.8016],
  RJ: [-22.9068, -43.1729],
  RN: [-5.79448, -35.211],
  RS: [-30.0346, -51.2177],
  RO: [-8.76116, -63.9039],
  RR: [2.81954, -60.6733],
  SC: [-27.5954, -48.548],
  SP: [-23.5505, -46.6333],
  SE: [-10.9472, -37.0731],
  TO: [-10.1753, -48.2982],
};

const DEFAULT_COORDINATES: [number, number] = UF_COORDINATES.DF;

export function getUfCoordinates(uf: string): [number, number] {
  return UF_COORDINATES[uf.toUpperCase()] ?? DEFAULT_COORDINATES;
}

// Área oficial de cada UF (km², fonte IBGE, arredondada) — usada só pra
// calcular um raio de dispersão proporcional ao tamanho real do estado
// (sem isso, uma cidade distante da capital, tipo Quirinópolis/GO, sempre
// caía "dentro" de Goiânia, já que o raio era fixo e pequeno).
const UF_AREA_KM2: Record<string, number> = {
  AC: 164124,
  AL: 27848,
  AP: 142829,
  AM: 1559168,
  BA: 564733,
  CE: 148895,
  DF: 5760,
  ES: 46095,
  GO: 340086,
  MA: 331937,
  MT: 903207,
  MS: 357145,
  MG: 586522,
  PA: 1245759,
  PB: 56469,
  PR: 199308,
  PE: 98312,
  PI: 251577,
  RJ: 43750,
  RN: 52809,
  RS: 281731,
  RO: 237591,
  RR: 224301,
  SC: 95346,
  SP: 248219,
  SE: 21915,
  TO: 277720,
};

const KM_PER_DEGREE = 111;
const MIN_REGION_RADIUS_DEG = 0.35;
const MAX_REGION_RADIUS_DEG = 4;

/** Raio (em graus) de uma região "equivalente" ao tamanho do estado, pra
 * espalhar cidades distantes da capital pelo estado todo, não só perto dela. */
export function getUfRegionRadiusDeg(uf: string): number {
  const areaKm2 = UF_AREA_KM2[uf.toUpperCase()] ?? UF_AREA_KM2.DF;
  const radiusKm = Math.sqrt(areaKm2 / Math.PI);
  const radiusDeg = radiusKm / KM_PER_DEGREE;
  return Math.min(Math.max(radiusDeg, MIN_REGION_RADIUS_DEG), MAX_REGION_RADIUS_DEG);
}
