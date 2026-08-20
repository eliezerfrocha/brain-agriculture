import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { typeOrmConfig } from './config/typeorm.config';

import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ProdutoresModule } from './modules/produtores/produtores.module';
import { PropriedadesModule } from './modules/propriedades/propriedades.module';
import { SafrasModule } from './modules/safras/safras.module';
import { CulturasModule } from './modules/culturas/culturas.module';
import { CulturasPlantadasModule } from './modules/culturas-plantadas/culturas-plantadas.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { GeocodingModule } from './modules/geocoding/geocoding.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      },
    }),
    TypeOrmModule.forRootAsync({ inject: [ConfigService], useFactory: typeOrmConfig }),
    AuthModule,
    ProdutoresModule,
    PropriedadesModule,
    SafrasModule,
    CulturasModule,
    CulturasPlantadasModule,
    DashboardModule,
    GeocodingModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
