import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propriedade } from '../propriedades/entities/propriedade.entity';
import { CulturaPlantada } from '../culturas-plantadas/entities/cultura-plantada.entity';
import { DashboardResumoDto } from './dto/dashboard-resumo.dto';
import { DashboardPorEstadoDto } from './dto/dashboard-por-estado.dto';
import { DashboardPorCulturaDto } from './dto/dashboard-por-cultura.dto';
import { DashboardUsoDoSoloDto } from './dto/dashboard-uso-do-solo.dto';

/**
 * Requisito de negócio #7: totais + 3 gráficos de pizza (estado, cultura, uso do solo).
 * Toda agregação roda no banco (GROUP BY / SUM / COUNT via query builder) —
 * nunca carregamos as linhas inteiras pra memória e somamos em JS.
 *
 * `estado` é opcional em resumo/por-cultura/uso-do-solo: é o filtro de
 * cross-filtering do dashboard (clicar numa fatia de "por estado" recorta
 * os outros gráficos pra aquele estado). `por-estado` em si nunca filtra —
 * é sempre a visão completa, de onde o filtro é escolhido.
 */
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Propriedade)
    private readonly propriedadeRepo: Repository<Propriedade>,
    @InjectRepository(CulturaPlantada)
    private readonly culturaPlantadaRepo: Repository<CulturaPlantada>,
  ) {}

  async getResumo(estado?: string): Promise<DashboardResumoDto> {
    const query = this.propriedadeRepo
      .createQueryBuilder('propriedade')
      .select('COUNT(propriedade.id)', 'totalFazendas')
      .addSelect('COALESCE(SUM(propriedade.areaTotal), 0)', 'totalHectares');

    if (estado) {
      query.where('propriedade.estado = :estado', { estado });
    }

    const raw = await query.getRawOne<{ totalFazendas: string; totalHectares: string }>();

    return {
      totalFazendas: Number(raw?.totalFazendas ?? 0),
      totalHectares: Number(raw?.totalHectares ?? 0),
    };
  }

  async getDistribuicaoPorEstado(): Promise<DashboardPorEstadoDto[]> {
    const rows = await this.propriedadeRepo
      .createQueryBuilder('propriedade')
      .select('propriedade.estado', 'estado')
      .addSelect('COUNT(propriedade.id)', 'total')
      .groupBy('propriedade.estado')
      .orderBy('total', 'DESC')
      .getRawMany<{ estado: string; total: string }>();

    return rows.map((row) => ({ estado: row.estado, total: Number(row.total) }));
  }

  async getDistribuicaoPorCultura(estado?: string): Promise<DashboardPorCulturaDto[]> {
    const query = this.culturaPlantadaRepo
      .createQueryBuilder('culturaPlantada')
      .innerJoin('culturaPlantada.cultura', 'cultura')
      .innerJoin('culturaPlantada.propriedade', 'propriedade')
      .select('cultura.nome', 'cultura')
      .addSelect('COUNT(culturaPlantada.id)', 'total')
      .groupBy('cultura.nome')
      .orderBy('total', 'DESC');

    if (estado) {
      query.andWhere('propriedade.estado = :estado', { estado });
    }

    const rows = await query.getRawMany<{ cultura: string; total: string }>();

    return rows.map((row) => ({ cultura: row.cultura, total: Number(row.total) }));
  }

  async getUsoDoSolo(estado?: string): Promise<DashboardUsoDoSoloDto> {
    const query = this.propriedadeRepo
      .createQueryBuilder('propriedade')
      .select('COALESCE(SUM(propriedade.areaAgricultavel), 0)', 'areaAgricultavel')
      .addSelect('COALESCE(SUM(propriedade.areaVegetacao), 0)', 'areaVegetacao');

    if (estado) {
      query.where('propriedade.estado = :estado', { estado });
    }

    const raw = await query.getRawOne<{ areaAgricultavel: string; areaVegetacao: string }>();

    return {
      areaAgricultavel: Number(raw?.areaAgricultavel ?? 0),
      areaVegetacao: Number(raw?.areaVegetacao ?? 0),
    };
  }
}
