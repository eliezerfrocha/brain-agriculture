import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Safra } from './entities/safra.entity';
import { SafrasService } from './safras.service';
import { SafrasController } from './safras.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Safra])],
  controllers: [SafrasController],
  providers: [SafrasService],
  exports: [SafrasService],
})
export class SafrasModule {}
