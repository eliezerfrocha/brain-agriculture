import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Decisão: synchronize:true para agilidade no teste técnico (ver README, seção Checklist).
export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: Number(configService.get('DATABASE_PORT', 5432)),
  username: configService.get('DATABASE_USER', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'postgres'),
  database: configService.get('DATABASE_NAME', 'brain_agriculture'),
  autoLoadEntities: true,
  synchronize: configService.get('NODE_ENV') !== 'production',
  ssl: configService.get('DATABASE_SSL') === 'true' ? { rejectUnauthorized: false } : false,
});
