import { ApiProperty } from '@nestjs/swagger';

export class MunicipioGeocodeDto {
  @ApiProperty({ example: -18.4472 })
  lat: number;

  @ApiProperty({ example: -50.4547 })
  lng: number;

  @ApiProperty({
    example: 0.1,
    description: 'Raio aproximado (graus) do território do município, derivado do bounding box.',
  })
  radiusDeg: number;
}
