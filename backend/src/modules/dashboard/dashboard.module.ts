import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Propriedade } from '../propriedades/entities/propriedade.entity';
import { CulturaPlantada } from '../culturas-plantadas/entities/cultura-plantada.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Propriedade, CulturaPlantada])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
