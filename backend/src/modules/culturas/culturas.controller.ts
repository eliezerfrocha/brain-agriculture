import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CulturasService } from './culturas.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { Cultura } from './entities/cultura.entity';
import { ApiAuthErrors, ApiValidationErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('culturas')
@ApiBearerAuth()
@Controller('culturas')
export class CulturasController {
  constructor(private readonly service: CulturasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar cultura', description: 'Ex.: "Soja", "Milho". O nome é único.' })
  @ApiCreatedResponse({ description: 'Cultura cadastrada', type: Cultura })
  @ApiConflictResponse({ description: 'Já existe uma cultura com esse nome' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  create(@Body() dto: CreateCulturaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as culturas' })
  @ApiOkResponse({ description: 'Lista de culturas', type: Cultura, isArray: true })
  @ApiAuthErrors()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma cultura pelo id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Cultura encontrada', type: Cultura })
  @ApiNotFoundResponse({ description: 'Cultura não encontrada' })
  @ApiAuthErrors()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Renomear uma cultura' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Cultura atualizada', type: Cultura })
  @ApiNotFoundResponse({ description: 'Cultura não encontrada' })
  @ApiConflictResponse({ description: 'Já existe uma cultura com esse nome' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  update(@Param('id') id: string, @Body() dto: UpdateCulturaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma cultura' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Cultura removida' })
  @ApiNotFoundResponse({ description: 'Cultura não encontrada' })
  @ApiAuthErrors()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
