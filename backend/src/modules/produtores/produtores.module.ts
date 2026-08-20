import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produtor } from './entities/produtor.entity';
import { ProdutoresService } from './produtores.service';
import { ProdutoresController } from './produtores.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Produtor])],
  controllers: [ProdutoresController],
  providers: [ProdutoresService],
  exports: [ProdutoresService],
})
export class ProdutoresModule {}
