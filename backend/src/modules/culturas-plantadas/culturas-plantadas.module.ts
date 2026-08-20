import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaPlantada } from './entities/cultura-plantada.entity';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CulturasPlantadasController } from './culturas-plantadas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaPlantada])],
  controllers: [CulturasPlantadasController],
  providers: [CulturasPlantadasService],
  exports: [CulturasPlantadasService],
})
export class CulturasPlantadasModule {}
