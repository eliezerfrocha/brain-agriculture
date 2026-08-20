import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import { CulturaPlantada } from './entities/cultura-plantada.entity';
import { ApiAuthErrors, ApiValidationErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('culturas-plantadas')
@ApiBearerAuth()
@Controller()
export class CulturasPlantadasController {
  constructor(private readonly service: CulturasPlantadasService) {}

  @Post('culturas-plantadas')
  @ApiOperation({
    summary: 'Registrar o plantio de uma cultura em uma propriedade, numa safra',
    description: 'A combinação propriedade + safra + cultura é única (não é possível duplicar o mesmo plantio).',
  })
  @ApiCreatedResponse({ description: 'Plantio registrado', type: CulturaPlantada })
  @ApiConflictResponse({ description: 'Esse plantio já existe para essa propriedade/safra/cultura' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  create(@Body() dto: CreateCulturaPlantadaDto) {
    return this.service.create(dto);
  }

  @Get('propriedades/:propriedadeId/culturas-plantadas')
  @ApiOperation({ summary: 'Listar os plantios de uma propriedade' })
  @ApiParam({ name: 'propriedadeId', format: 'uuid' })
  @ApiOkResponse({ description: 'Lista de plantios da propriedade', type: CulturaPlantada, isArray: true })
  @ApiAuthErrors()
  findByPropriedade(@Param('propriedadeId') propriedadeId: string) {
    return this.service.findByPropriedade(propriedadeId);
  }

  @Delete('culturas-plantadas/:id')
  @ApiOperation({ summary: 'Remover um plantio' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Plantio removido' })
  @ApiAuthErrors()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
