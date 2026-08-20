import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PropriedadesService } from './propriedades.service';
import { CreatePropriedadeDto } from './dto/create-propriedade.dto';
import { UpdatePropriedadeDto } from './dto/update-propriedade.dto';
import { Propriedade } from './entities/propriedade.entity';
import { ApiAuthErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('propriedades')
@ApiBearerAuth()
@Controller('propriedades')
export class PropriedadesController {
  constructor(private readonly service: PropriedadesService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar propriedade rural',
    description: 'Regra de negócio: areaAgricultavel + areaVegetacao não pode exceder areaTotal.',
  })
  @ApiCreatedResponse({ description: 'Propriedade cadastrada', type: Propriedade })
  @ApiBadRequestResponse({
    description: 'Dados inválidos, soma de áreas maior que a área total, ou produtorId inexistente',
  })
  @ApiAuthErrors()
  create(@Body() dto: CreatePropriedadeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as propriedades, com produtor e culturas plantadas' })
  @ApiOkResponse({ description: 'Lista de propriedades', type: Propriedade, isArray: true })
  @ApiAuthErrors()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma propriedade pelo id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Propriedade encontrada', type: Propriedade })
  @ApiNotFoundResponse({ description: 'Propriedade não encontrada' })
  @ApiAuthErrors()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar campos de uma propriedade',
    description: 'A regra areaAgricultavel + areaVegetacao <= areaTotal é revalidada com os valores já mesclados.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Propriedade atualizada', type: Propriedade })
  @ApiNotFoundResponse({ description: 'Propriedade não encontrada' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos, soma de áreas maior que a área total, ou produtorId inexistente',
  })
  @ApiAuthErrors()
  update(@Param('id') id: string, @Body() dto: UpdatePropriedadeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover uma propriedade',
    description: 'Remove em cascata os plantios (culturas plantadas) associados a ela.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Propriedade removida' })
  @ApiNotFoundResponse({ description: 'Propriedade não encontrada' })
  @ApiAuthErrors()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
