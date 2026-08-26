import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GeocodingService } from './geocoding.service';
import { MunicipioGeocodeDto } from './dto/municipio-geocode.dto';
import { ApiAuthErrors } from '../../common/decorators/api-errors.decorator';

@ApiTags('geocoding')
@ApiBearerAuth()
@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly service: GeocodingService) {}

  @Get('municipio')
  @ApiOperation({
    summary: 'Geocodificação aproximada de um município (via Nominatim/OpenStreetMap)',
    description:
      'Usada só para posicionar o talhão fictício de uma propriedade dentro do território real do município cadastrado (a propriedade em si é fictícia, mas a cidade é real). Devolve null quando o município não é encontrado. Chamada aqui pelo backend — o Nominatim não permite chamada direta do navegador (sem CORS).',
  })
  @ApiQuery({ name: 'cidade', example: 'Quirinópolis' })
  @ApiQuery({ name: 'uf', example: 'GO' })
  @ApiOkResponse({ type: MunicipioGeocodeDto })
  @ApiAuthErrors()
  getMunicipio(@Query('cidade') cidade: string, @Query('uf') uf: string) {
    return this.service.getMunicipioGeocode(cidade, uf);
  }
}
