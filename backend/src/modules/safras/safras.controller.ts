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
import { SafrasService } from './safras.service';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { Safra } from './entities/safra.entity';
import { ApiAuthErrors, ApiValidationErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('safras')
@ApiBearerAuth()
@Controller('safras')
export class SafrasController {
  constructor(private readonly service: SafrasService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar safra', description: 'Ex.: "Safra 2021". O nome é único.' })
  @ApiCreatedResponse({ description: 'Safra cadastrada', type: Safra })
  @ApiConflictResponse({ description: 'Já existe uma safra com esse nome' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  create(@Body() dto: CreateSafraDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as safras' })
  @ApiOkResponse({ description: 'Lista de safras', type: Safra, isArray: true })
  @ApiAuthErrors()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma safra pelo id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Safra encontrada', type: Safra })
  @ApiNotFoundResponse({ description: 'Safra não encontrada' })
  @ApiAuthErrors()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Renomear uma safra' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Safra atualizada', type: Safra })
  @ApiNotFoundResponse({ description: 'Safra não encontrada' })
  @ApiConflictResponse({ description: 'Já existe uma safra com esse nome' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  update(@Param('id') id: string, @Body() dto: UpdateSafraDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma safra' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Safra removida' })
  @ApiNotFoundResponse({ description: 'Safra não encontrada' })
  @ApiAuthErrors()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
