import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardResumoDto } from './dto/dashboard-resumo.dto';
import { DashboardPorEstadoDto } from './dto/dashboard-por-estado.dto';
import { DashboardPorCulturaDto } from './dto/dashboard-por-cultura.dto';
import { DashboardUsoDoSoloDto } from './dto/dashboard-uso-do-solo.dto';
import { ApiAuthErrors } from '../../common/decorators/api-errors.decorator';

const ESTADO_QUERY = {
  name: 'estado',
  required: false,
  description: 'Sigla do estado (UF) para recortar o resultado. Omitido = todos os estados.',
  example: 'MG',
};

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('resumo')
  @ApiOperation({ summary: 'Total de fazendas e de hectares cadastrados' })
  @ApiQuery(ESTADO_QUERY)
  @ApiOkResponse({ type: DashboardResumoDto })
  @ApiAuthErrors()
  getResumo(@Query('estado') estado?: string) {
    return this.service.getResumo(estado);
  }

  @Get('por-estado')
  @ApiOperation({ summary: 'Quantidade de propriedades agrupadas por estado (UF)' })
  @ApiOkResponse({ type: DashboardPorEstadoDto, isArray: true })
  @ApiAuthErrors()
  getDistribuicaoPorEstado() {
    return this.service.getDistribuicaoPorEstado();
  }

  @Get('por-cultura')
  @ApiOperation({ summary: 'Quantidade de plantios agrupados por cultura' })
  @ApiQuery(ESTADO_QUERY)
  @ApiOkResponse({ type: DashboardPorCulturaDto, isArray: true })
  @ApiAuthErrors()
  getDistribuicaoPorCultura(@Query('estado') estado?: string) {
    return this.service.getDistribuicaoPorCultura(estado);
  }

  @Get('uso-do-solo')
  @ApiOperation({ summary: 'Soma de área agricultável x área de vegetação' })
  @ApiQuery(ESTADO_QUERY)
  @ApiOkResponse({ type: DashboardUsoDoSoloDto })
  @ApiAuthErrors()
  getUsoDoSolo(@Query('estado') estado?: string) {
    return this.service.getUsoDoSolo(estado);
  }
}
