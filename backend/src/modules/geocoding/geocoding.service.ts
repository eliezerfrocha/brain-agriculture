import { Injectable, Logger } from '@nestjs/common';
import { MunicipioGeocodeDto } from './dto/municipio-geocode.dto';

interface NominatimResult {
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
}

const MIN_RADIUS_DEG = 0.015; // ~1.6km — município minúsculo não vira um ponto só
const MAX_RADIUS_DEG = 0.6; // ~66km — trava bounding box anormalmente grande

// Nome por extenso ajuda o Nominatim a casar o estado com mais confiança do
// que a sigla sozinha.
const UF_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
  SE: 'Sergipe', TO: 'Tocantins',
};

// Nominatim pede uma identificação válida no User-Agent pra uso não-comercial
// (ver https://operations.osmfoundation.org/policies/nominatim/).
const NOMINATIM_USER_AGENT = 'BrainAgricultureTechTest/1.0 (uso educacional, baixo volume)';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  /**
   * Cache simples em memória — o município não muda de lugar entre requests,
   * e evita bater no Nominatim de novo pra cada card que reaparece na tela
   * (política deles pede uso comedido: nada de repetir a mesma consulta à toa).
   */
  private readonly cache = new Map<string, MunicipioGeocodeDto | null>();

  async getMunicipioGeocode(cidade: string, uf: string): Promise<MunicipioGeocodeDto | null> {
    const cacheKey = `${uf.toUpperCase()}|${cidade.trim().toLowerCase()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) ?? null;
    }

    const result = await this.fetchFromNominatim(cidade, uf);
    this.cache.set(cacheKey, result);
    return result;
  }

  private async fetchFromNominatim(cidade: string, uf: string): Promise<MunicipioGeocodeDto | null> {
    const params = new URLSearchParams({
      city: cidade,
      state: UF_NAMES[uf.toUpperCase()] ?? uf,
      countrycodes: 'br',
      format: 'json',
      limit: '1',
    });

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
        headers: { 'User-Agent': NOMINATIM_USER_AGENT },
      });
      if (!response.ok) return null;

      const results = (await response.json()) as NominatimResult[];
      const first = results[0];
      if (!first) return null;

      const [south, north, west, east] = first.boundingbox.map(Number);
      const rawRadiusDeg = (north - south + (east - west)) / 4;
      const radiusDeg = Math.min(Math.max(rawRadiusDeg, MIN_RADIUS_DEG), MAX_RADIUS_DEG);

      return { lat: Number(first.lat), lng: Number(first.lon), radiusDeg };
    } catch (error) {
      this.logger.warn(`Falha ao geocodificar "${cidade}/${uf}": ${(error as Error).message}`);
      return null;
    }
  }
}
