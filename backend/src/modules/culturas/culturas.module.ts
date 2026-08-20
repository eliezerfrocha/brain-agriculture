import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { CulturasService } from './culturas.service';
import { CulturasController } from './culturas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cultura])],
  controllers: [CulturasController],
  providers: [CulturasService],
  exports: [CulturasService],
})
export class CulturasModule {}
