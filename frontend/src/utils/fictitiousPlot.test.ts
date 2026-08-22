import { buildFictitiousPlot } from './fictitiousPlot';
import { getUfRegionRadiusDeg } from './ufCoordinates';

describe('buildFictitiousPlot', () => {
  it('é determinístico: mesmo id sempre gera o mesmo traçado', () => {
    const a = buildFictitiousPlot('propriedade-1', 'MG', 'Uberlândia', 1000);
    const b = buildFictitiousPlot('propriedade-1', 'MG', 'Uberlândia', 1000);
    expect(a).toEqual(b);
  });

  it('gera traçados diferentes para propriedades diferentes', () => {
    const a = buildFictitiousPlot('propriedade-1', 'MG', 'Uberlândia', 1000);
    const b = buildFictitiousPlot('propriedade-2', 'MG', 'Uberlândia', 1000);
    expect(a.center).not.toEqual(b.center);
  });

  it('gera um polígono com pelo menos 6 vértices', () => {
    const { polygon } = buildFictitiousPlot('propriedade-1', 'GO', 'Goiânia', 2000);
    expect(polygon.length).toBeGreaterThanOrEqual(6);
  });

  it('centraliza próximo às coordenadas do estado informado', () => {
    const mg = buildFictitiousPlot('propriedade-1', 'MG', 'Uberlândia', 1000);
    const sp = buildFictitiousPlot('propriedade-1', 'SP', 'Campinas', 1000);
    expect(mg.center).not.toEqual(sp.center);
  });

  it('propriedades da mesma cidade ficam dentro da mesma região (arredores), nunca fora dela', () => {
    const a = buildFictitiousPlot('propriedade-1', 'MG', 'Uberlândia', 1000);
    const b = buildFictitiousPlot('propriedade-2', 'MG', 'Uberlândia', 1500);
    const distanciaGraus = Math.hypot(a.center[0] - b.center[0], a.center[1] - b.center[1]);
    // mesma cidade: os dois ficam espalhados nos arredores do mesmo ponto,
    // então a distância entre eles nunca passa do diâmetro dessa região
    const raioRegiaoMG = getUfRegionRadiusDeg('MG');
    expect(distanciaGraus).toBeLessThan(2 * raioRegiaoMG + 0.1);
  });

  it('propriedade fica nos arredores da cidade, não em cima do centro dela', () => {
    const cidade = { lat: -18.4467, lng: -50.4527, radiusDeg: 0.2 };
    const { center } = buildFictitiousPlot('propriedade-1', 'GO', 'Quirinópolis', 1000, cidade);
    const distanciaDoCentro = Math.hypot(center[0] - cidade.lat, center[1] - cidade.lng);
    // nunca mais perto do centro do que 55% do raio da região (malha urbana)
    expect(distanciaDoCentro).toBeGreaterThanOrEqual(cidade.radiusDeg * 0.55 - 1e-9);
  });

  it('cidades diferentes no mesmo estado caem em sub-regiões diferentes', () => {
    const a = buildFictitiousPlot('propriedade-1', 'MG', 'Uberlândia', 1000);
    const b = buildFictitiousPlot('propriedade-1', 'MG', 'Juiz de Fora', 1000);
    expect(a.center).not.toEqual(b.center);
  });

  it('usa o centro/raio real do município (geocodificação) quando informado, mesmo longe da capital', () => {
    // Quirinópolis/GO fica bem longe de Goiânia — com a região real do
    // município, o resultado precisa ficar perto de Quirinópolis, não da capital.
    const quirinopolis = { lat: -18.4467, lng: -50.4527, radiusDeg: 0.1 };
    const { center } = buildFictitiousPlot('propriedade-1', 'GO', 'Quirinópolis', 1000, quirinopolis);
    const distanciaDoMunicipio = Math.hypot(
      center[0] - quirinopolis.lat,
      center[1] - quirinopolis.lng,
    );
    expect(distanciaDoMunicipio).toBeLessThan(0.15);
  });
});
