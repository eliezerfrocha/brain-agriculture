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
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProdutoresService } from './produtores.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { Produtor } from './entities/produtor.entity';
import { ApiAuthErrors, ApiValidationErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('produtores')
@ApiBearerAuth()
@Controller('produtores')
export class ProdutoresController {
  constructor(private readonly service: ProdutoresService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar produtor rural' })
  @ApiCreatedResponse({ description: 'Produtor cadastrado', type: Produtor })
  @ApiConflictResponse({ description: 'Já existe um produtor cadastrado com esse CPF/CNPJ' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  create(@Body() dto: CreateProdutorDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores, com suas propriedades' })
  @ApiOkResponse({ description: 'Lista de produtores', type: Produtor, isArray: true })
  @ApiAuthErrors()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produtor pelo id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Produtor encontrado', type: Produtor })
  @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
  @ApiAuthErrors()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar campos de um produtor' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Produtor atualizado', type: Produtor })
  @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
  @ApiConflictResponse({ description: 'Já existe um produtor cadastrado com esse CPF/CNPJ' })
  @ApiValidationErrors()
  @ApiAuthErrors()
  update(@Param('id') id: string, @Body() dto: UpdateProdutorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover um produtor',
    description: 'Remove em cascata as propriedades desse produtor (ver Propriedade.produtor).',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Produtor removido' })
  @ApiNotFoundResponse({ description: 'Produtor não encontrado' })
  @ApiAuthErrors()
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
